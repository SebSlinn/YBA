import { ICalendarService, CalendarQueryOptions } from './interfaces/ICalendarService';
import { CalendarEvent } from '@/domain/calendar/CalendarEvent';

/**
 * Merges however many calendar sources are wired in (today: just Directus
 * and maybe an ICS feed; later: Office365, Bromcom) into one sorted list.
 * Pages depend on ICalendarService, never on this class or its sources
 * directly — see ServiceFactory.
 */
export class CompositeCalendarService implements ICalendarService {
  constructor(private sources: ICalendarService[]) {}

  async getEvents(options?: CalendarQueryOptions): Promise<CalendarEvent[]> {
    const results = await Promise.allSettled(this.sources.map((s) => s.getEvents(options)));

    const events: CalendarEvent[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        events.push(...result.value);
      } else {
        // One broken source (e.g. an O365 feed that's temporarily down)
        // shouldn't blank out the whole school calendar.
        console.error('A calendar source failed to load:', result.reason);
      }
    }

    return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }
}
