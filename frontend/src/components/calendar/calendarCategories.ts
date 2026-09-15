import type { CalendarCategoryKey } from '@/domain/calendar/CalendarCategory';
import type { CalendarEvent } from '@/domain/calendar/CalendarEvent';

export type { CalendarCategoryKey };

export interface CalendarCategoryMeta {
  key: CalendarCategoryKey;
  label: string;
  /**
   * A real YBA brand colour (from styles/colours.css's --yba-* tokens —
   * these are global, so no local redefinition needed here), or a neutral
   * fallback for "Other". Used as an accent — the month-grid chip's left
   * border and the small dots in the filter chips/agenda list — never as
   * running text on its own background, so it doesn't need to pass a
   * contrast check by itself; event text always stays a fixed dark ink
   * colour for legibility.
   */
  colorVar: string;
  /**
   * True only for the Directus/clickable accent below — gets a bold
   * solid-fill treatment instead of the subtle left-border-on-paper style
   * every filterable category uses, so events you can actually click
   * through to a page visibly stand out from ones you can't.
   */
  solid?: boolean;
}

export const CALENDAR_CATEGORIES: Record<CalendarCategoryKey, CalendarCategoryMeta> = {
  term: { key: 'term', label: 'Term dates & holidays', colorVar: '--yba-navy' },
  exam: { key: 'exam', label: 'Exams & assessments', colorVar: '--yba-teal' },
  staff: { key: 'staff', label: 'INSET / staff days', colorVar: '--yba-gold' },
  // The catch-all bucket for everything else from the ICS feed that isn't
  // term/exam/staff (Owain Glyndwr Day, coffee mornings, awareness weeks,
  // etc.) — deliberately neutral rather than a brand colour, since magenta
  // is reserved for the Directus/clickable accent below and this is the
  // "nothing special" bucket.
  general: { key: 'general', label: 'Other', colorVar: '--cal-ink-soft' },
};

export const CALENDAR_CATEGORY_LIST = Object.values(CALENDAR_CATEGORIES);

export function categoryFor(key?: string): CalendarCategoryMeta {
  if (key && key in CALENDAR_CATEGORIES) return CALENDAR_CATEGORIES[key as CalendarCategoryKey];
  return CALENDAR_CATEGORIES.general;
}

/**
 * Site-authored (Directus) events are always real links through to a
 * detail page, so they get their own bold, solid-fill accent (the
 * brightest YBA colour) rather than sharing "Other"'s muted treatment —
 * and, per SchoolCalendar.tsx's filteredEvents, they're never hidden by
 * the category filter buttons; this accent isn't one of those buttons,
 * it's applied purely by source.
 */
export const DIRECTUS_EVENT_ACCENT: CalendarCategoryMeta = {
  key: 'general',
  label: 'School events',
  colorVar: '--yba-magenta',
  solid: true,
};

/** The colour/style to render an event with: source wins over category. */
export function accentFor(event: Pick<CalendarEvent, 'category' | 'source'>): CalendarCategoryMeta {
  if (event.source === 'directus') return DIRECTUS_EVENT_ACCENT;
  return categoryFor(event.category);
}
