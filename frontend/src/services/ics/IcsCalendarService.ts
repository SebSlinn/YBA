import { ICalendarService, CalendarQueryOptions } from '../interfaces/ICalendarService';
import { CalendarEvent } from '@/domain/calendar/CalendarEvent';
import { parseIcsToCalendarEvents } from './icsParser';

export interface IcsFeedConfig {
  /** A public/published .ics URL — this is what a "Publish calendar" link in Outlook/O365 or Google Calendar gives you, no OAuth needed. */
  url: string;
  /** A short label for logging/debugging, e.g. "office365-inset-days". */
  label: string;
  /** How long to cache the parsed feed before re-fetching. Default 15 min — these feeds change rarely. */
  cacheTtlMs?: number;
}

/**
 * Merges a live external ICS feed straight into the calendar at request
 * time — nothing gets written to Directus. Good fit for a calendar that's
 * genuinely owned elsewhere (e.g. a staff-managed O365 calendar for INSET
 * days) where you want changes there to show up here automatically,
 * without anyone remembering to re-import.
 *
 * For events you actually want editors to be able to tweak in Directus
 * (e.g. curated term dates), use the one-off import script instead
 * (scripts/import-ics-to-directus.ts) and let DirectusCalendarService
 * pick them up as normal Directus events.
 */
export class IcsCalendarService implements ICalendarService {
  private cache: { events: CalendarEvent[]; fetchedAt: number } | null = null;

  constructor(private config: IcsFeedConfig) {}

  async getEvents(options?: CalendarQueryOptions): Promise<CalendarEvent[]> {
    const ttl = this.config.cacheTtlMs ?? 15 * 60 * 1000;
    const now = Date.now();

    if (!this.cache || now - this.cache.fetchedAt > ttl) {
      await this.refresh();
    }

    return this.applyOptions(this.cache!.events, options);
  }

  private async refresh(): Promise<void> {
    const res = await fetch(this.config.url, { next: { revalidate: 900 } });
    if (!res.ok) {
      // Don't throw here if we have a stale cache — better to show slightly
      // old events than none at all if the upstream calendar is briefly down.
      if (this.cache) {
        console.error(`ICS feed "${this.config.label}" fetch failed (${res.status}); serving cached copy.`);
        return;
      }
      throw new Error(`Failed to fetch ICS feed "${this.config.label}": ${res.status}`);
    }

    const icsText = await res.text();
    const events = parseIcsToCalendarEvents(icsText, 'ics');
    this.cache = { events, fetchedAt: Date.now() };
  }

  private applyOptions(events: CalendarEvent[], options?: CalendarQueryOptions): CalendarEvent[] {
    let result = events;
    if (options?.from) result = result.filter((e) => (e.endDate ?? e.startDate) >= options.from!);
    if (options?.to) result = result.filter((e) => e.startDate <= options.to!);
    if (options?.category) result = result.filter((e) => e.category === options.category);
    result = result.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    if (options?.limit) result = result.slice(0, options.limit);
    return result;
  }
}
