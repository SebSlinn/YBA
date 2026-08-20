/**
 * A single, source-agnostic event shape. This is what pages/components
 * consume regardless of whether the event came from Directus (editorial),
 * an ICS feed (imported or live), Office365, or Bromcom later on.
 *
 * This is deliberately separate from the existing `Event` domain type
 * (@/domain/event/Event.ts), which is specifically the shape of a Directus
 * "events" record used on its own detail/listing pages. CalendarEvent is
 * the merged, calendar-wide view built on top of it.
 */

export type CalendarEventSource = 'directus' | 'ics' | 'office365' | 'bromcom';

export interface CalendarEvent {
  /** Unique across all merged sources — prefixed with source to avoid collisions, e.g. "directus-14" or "ics-9f8a...". */
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  allDay: boolean;
  location?: string;
  category?: string;
  source: CalendarEventSource;
  /** Original UID from the upstream system (ICS UID, O365 event id). Used for de-duplication and re-import matching — not shown to users. */
  externalUid?: string;
  /** Optional link — e.g. back to a Directus news/event detail page, if one exists. */
  url?: string;
}
