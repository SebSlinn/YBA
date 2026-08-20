import { CalendarEvent } from '@/domain/calendar/CalendarEvent';

export interface CalendarQueryOptions {
  from?: Date;
  to?: Date;
  category?: string;
  limit?: number;
}

/**
 * The single contract calendar-consuming pages depend on. Whether there's
 * one source behind it (just Directus, today) or four (Directus + ICS +
 * Office365 + Bromcom, eventually), pages never need to know.
 */
export interface ICalendarService {
  getEvents(options?: CalendarQueryOptions): Promise<CalendarEvent[]>;
}
