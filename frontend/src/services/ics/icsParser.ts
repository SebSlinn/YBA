import ICAL from 'ical.js';
import { CalendarEvent, CalendarEventSource } from '@/domain/calendar/CalendarEvent';
import { CalendarCategoryKey } from '@/domain/calendar/CalendarCategory';

/**
 * Confirmed (Sept 2026) that Ysgol Bryn Alyn's published O365 "Parent and
 * Student Calendar" ICS feed does not carry a CATEGORIES property per
 * event — checked live, 0 matches even on events tagged with an Outlook
 * category. So category has to be inferred from the event title instead.
 * Order matters: checked top to bottom, first match wins (e.g. "INSET -
 * School Closed to Students" must hit the staff rule before the term
 * rule, since it matches both patterns). 'holiday' was merged into 'term'.
 */
const CATEGORY_KEYWORD_RULES: { category: CalendarCategoryKey; test: RegExp }[] = [
  { category: 'staff', test: /inset/i },
  { category: 'exam', test: /\bnea\b|\bexam|assessment|results\b/i },
  { category: 'term', test: /half term|holiday|\bbreak\b|school (open|closed) to (students|pupils)/i },
];

function inferCategory(title: string): CalendarCategoryKey {
  for (const rule of CATEGORY_KEYWORD_RULES) {
    if (rule.test.test(title)) return rule.category;
  }
  // No keyword match — most of the feed is ordinary school-life events
  // (assemblies, coffee mornings, awareness days) that genuinely belong
  // under "School events" rather than a specific category.
  return 'general';
}

/**
 * ICS all-day events store an EXCLUSIVE end date (the day *after* the
 * event's last day) per RFC5545 — e.g. a single-day all-day event's DTEND
 * is already the next midnight. Our CalendarEvent.endDate is inclusive
 * (matching how Directus's own event end_date field is entered/used), so
 * for all-day events we pull the ICS end date back by one day. Without
 * this, a single all-day event shows on both its real day AND the day
 * after in the month grid, which checks date *ranges* — the agenda view
 * never showed this bug, since it only ever looks at the start date.
 */
function adjustIcsEndDate(rawEnd: Date | undefined, allDay: boolean): Date | undefined {
  if (!rawEnd || !allDay) return rawEnd;
  return new Date(rawEnd.getTime() - 24 * 60 * 60 * 1000);
}

/**
 * Parses raw .ics text into CalendarEvents. Used both by IcsCalendarService
 * (live feed, merged in at request time) and by the import script (one-off
 * pull into Directus). Does NOT expand recurring events by default — see
 * expandRecurringEvents() below if a feed actually uses RRULE (most school
 * term-date/INSET exports don't; O365 "shared calendar" exports usually
 * expand recurrences server-side already).
 */
export function parseIcsToCalendarEvents(
  icsText: string,
  source: CalendarEventSource = 'ics'
): CalendarEvent[] {
  const jcalData = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent');

  return vevents
    .map((vevent): CalendarEvent | null => {
      try {
        const event = new ICAL.Event(vevent);
        const title = event.summary || 'Untitled event';
        const allDay = event.startDate.isDate; // true when the ICS value is DATE-only (no time component) — the standard way all-day events are marked
        const rawEnd = event.endDate ? event.endDate.toJSDate() : undefined;

        return {
          id: `${source}-${event.uid}`,
          title,
          description: event.description || undefined,
          startDate: event.startDate.toJSDate(),
          endDate: adjustIcsEndDate(rawEnd, allDay),
          allDay,
          location: event.location || undefined,
          category: inferCategory(title),
          source,
          externalUid: event.uid,
        };
      } catch (err) {
        // A single malformed VEVENT shouldn't take down the whole feed
        console.error('Skipping unparseable ICS event:', err);
        return null;
      }
    })
    .filter((e): e is CalendarEvent => e !== null);
}

/**
 * Optional: expand recurring (RRULE) events within a date window.
 * Only call this if you actually hit a feed with real recurrence rules —
 * most school calendar exports don't need it, and it's easy to over-build
 * this before there's a concrete need for it.
 */
export function expandRecurringEvents(
  icsText: string,
  windowStart: Date,
  windowEnd: Date,
  source: CalendarEventSource = 'ics'
): CalendarEvent[] {
  const jcalData = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent');
  const results: CalendarEvent[] = [];

  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);
    const title = event.summary || 'Untitled event';

    if (!event.isRecurring()) {
      const start = event.startDate.toJSDate();
      const allDay = event.startDate.isDate;
      const rawEnd = event.endDate ? event.endDate.toJSDate() : undefined;
      if (start >= windowStart && start <= windowEnd) {
        results.push({
          id: `${source}-${event.uid}`,
          title,
          description: event.description || undefined,
          startDate: start,
          endDate: adjustIcsEndDate(rawEnd, allDay),
          allDay,
          location: event.location || undefined,
          category: inferCategory(title),
          source,
          externalUid: event.uid,
        });
      }
      continue;
    }

    const iterator = event.iterator();
    let next: ICAL.Time | null;
    // eslint-disable-next-line no-cond-assign
    while ((next = iterator.next())) {
      const occurrence = next.toJSDate();
      if (occurrence > windowEnd) break;
      if (occurrence < windowStart) continue;

      const details = event.getOccurrenceDetails(next);
      const allDay = next.isDate;
      const rawEnd = details.endDate ? details.endDate.toJSDate() : undefined;
      results.push({
        id: `${source}-${event.uid}-${next.toICALString()}`,
        title,
        description: event.description || undefined,
        startDate: details.startDate.toJSDate(),
        endDate: adjustIcsEndDate(rawEnd, allDay),
        allDay,
        location: event.location || undefined,
        category: inferCategory(title),
        source,
        externalUid: `${event.uid}-${next.toICALString()}`,
      });
    }
  }

  return results;
}
