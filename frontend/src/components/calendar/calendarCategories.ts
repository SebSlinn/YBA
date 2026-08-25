export type CalendarCategoryKey = 'term' | 'holiday' | 'exam' | 'staff' | 'general';

export interface CalendarCategoryMeta {
  key: CalendarCategoryKey;
  label: string;
  /** CSS custom property (defined in calendar-tokens.css) for this category's solid colour. */
  colorVar: string;
  /** CSS custom property for this category's soft/background tint. */
  softVar: string;
}

export const CALENDAR_CATEGORIES: Record<CalendarCategoryKey, CalendarCategoryMeta> = {
  term: { key: 'term', label: 'Term dates', colorVar: '--cal-ink', softVar: '--cal-slate-soft' },
  holiday: { key: 'holiday', label: 'Holidays', colorVar: '--cal-sage', softVar: '--cal-sage-soft' },
  exam: { key: 'exam', label: 'Exams & deadlines', colorVar: '--cal-brick', softVar: '--cal-brick-soft' },
  staff: { key: 'staff', label: 'INSET / staff days', colorVar: '--cal-slate', softVar: '--cal-slate-soft' },
  general: { key: 'general', label: 'School events', colorVar: '--cal-marigold', softVar: '--cal-marigold-soft' },
};

export const CALENDAR_CATEGORY_LIST = Object.values(CALENDAR_CATEGORIES);

export function categoryFor(key?: string): CalendarCategoryMeta {
  if (key && key in CALENDAR_CATEGORIES) return CALENDAR_CATEGORIES[key as CalendarCategoryKey];
  return CALENDAR_CATEGORIES.general;
}
