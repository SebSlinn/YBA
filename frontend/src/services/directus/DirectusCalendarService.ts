import { ICalendarService, CalendarQueryOptions } from '../interfaces/ICalendarService';
import { CalendarEvent } from '@/domain/calendar/CalendarEvent';
import { Event } from '@/domain/event/Event';
import { IEventService } from '../interfaces/IEventService';

/**
 * Adapts the existing editorial "events" collection (already live via
 * DirectusEventService / IEventService) into the shared CalendarEvent
 * shape, so it can sit alongside ICS/Office365 sources in a
 * CompositeCalendarService without duplicating any Directus-calling code.
 *
 * NOTE: adjust the method call below (`getUpcoming` / `getLatest` / etc.)
 * to whatever IEventService actually exposes — this file assumes it has
 * something equivalent to News's getLatest(options), but Event's real
 * interface may differ slightly (e.g. a date-range filter instead of a
 * limit). Wire it to whatever's really there rather than adding a new
 * method to IEventService unless one is genuinely missing.
 */
export class DirectusCalendarService implements ICalendarService {
  constructor(private eventService: IEventService) {}

  async getEvents(options?: CalendarQueryOptions): Promise<CalendarEvent[]> {
    const events = await this.eventService.getLatest({
      limit: options?.limit,
    });

    return events
      // Draft events aren't meant to be public yet — keep them off the calendar
      .filter((e) => e.status !== 'Draft')
      .filter((e) => this.withinRange(e, options))
      .map((e) => this.toCalendarEvent(e));
  }

  private withinRange(e: Event, options?: CalendarQueryOptions): boolean {
    if (options?.from && (e.endDate ?? e.startDate) < options.from) return false;
    if (options?.to && e.startDate > options.to) return false;
    if (options?.category && e.category !== options.category) return false;
    return true;
  }

  private toCalendarEvent(e: Event): CalendarEvent {
    return {
      id: `directus-${e.id}`,
      title: e.title,
      description: e.content,
      startDate: e.startDate,
      endDate: e.endDate,
      allDay: false,
      location: e.location,
      category: e.category,
      source: 'directus',
      url: `/events/${e.slug}`,
    };
  }
}
