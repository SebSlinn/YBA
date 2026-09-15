import type { CalendarCategoryKey } from '@/domain/calendar/CalendarCategory';

export type { CalendarCategoryKey };

export interface CalendarCategoryMeta {
  key: CalendarCategoryKey;
  label: string;
  /**
   * A real YBA brand colour (from styles/colours.css's --yba-* tokens —
   * these are global, so no local redefinition needed here). Used only as
   * an accent — the month-grid chip's left border and the small dots in
   * the filter chips/agenda list — never as running text on its own
   * background, so it doesn't need to pass a contrast check by itself;
   * event text always stays a fixed dark ink colour for legibility.
   */
  colorVar: string;
}

export const CALENDAR_CATEGORIES: Record<CalendarCategoryKey, CalendarCategoryMeta> = {
  term: { key: 'term', label: 'Term dates & holidays', colorVar: '--yba-navy' },
  exam: { key: 'exam', label: 'Exams & assessments', colorVar: '--yba-magenta' },
  staff: { key: 'staff', label: 'INSET / staff days', colorVar: '--yba-gold' },
  general: { key: 'general', label: 'School events', colorVar: '--yba-teal' },
};

export const CALENDAR_CATEGORY_LIST = Object.values(CALENDAR_CATEGORIES);

export function categoryFor(key?: string): CalendarCategoryMeta {
  if (key && key in CALENDAR_CATEGORIES) return CALENDAR_CATEGORIES[key as CalendarCategoryKey];
  return CALENDAR_CATEGORIES.general;
}
