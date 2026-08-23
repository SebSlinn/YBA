import ICAL from 'ical.js';
import { CalendarEvent, CalendarEventSource } from '@/domain/calendar/CalendarEvent';

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

        return {
          id: `${source}-${event.uid}`,
          title: event.summary || 'Untitled event',
          description: event.description || undefined,
          startDate: event.startDate.toJSDate(),
          endDate: event.endDate ? event.endDate.toJSDate() : undefined,
          allDay: event.startDate.isDate, // true when the ICS value is DATE-only (no time component) — the standard way all-day events are marked
          location: event.location || undefined,
          category: undefined,
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

    if (!event.isRecurring()) {
      const start = event.startDate.toJSDate();
      if (start >= windowStart && start <= windowEnd) {
        results.push({
          id: `${source}-${event.uid}`,
          title: event.summary || 'Untitled event',
          description: event.description || undefined,
          startDate: start,
          endDate: event.endDate ? event.endDate.toJSDate() : undefined,
          allDay: event.startDate.isDate,
          location: event.location || undefined,
          category: undefined,
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
      results.push({
        id: `${source}-${event.uid}-${next.toICALString()}`,
        title: event.summary || 'Untitled event',
        description: event.description || undefined,
        startDate: details.startDate.toJSDate(),
        endDate: details.endDate ? details.endDate.toJSDate() : undefined,
        allDay: next.isDate,
        location: event.location || undefined,
        category: undefined,
        source,
        externalUid: `${event.uid}-${next.toICALString()}`,
      });
    }
  }

  return results;
}
