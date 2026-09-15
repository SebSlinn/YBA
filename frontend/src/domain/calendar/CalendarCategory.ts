//frontend/src/domain/calendar/CalendarCategory.ts

/**
 * The fixed set of calendar categories used across the calendar feature.
 * Lives in domain/ (not components/calendar/, where it used to live) so
 * that services/ics/icsParser.ts — which needs to assign a category to
 * incoming ICS feed events — never has to import from the presentation
 * layer. components/calendar/calendarCategories.ts still owns the
 * label/colour metadata per key; it imports this type rather than
 * declaring it, and re-exports it so existing imports keep working.
 *
 * 'holiday' was merged into 'term' (Sept 2026) — term dates and holidays
 * were felt to be the same kind of thing for filtering purposes, and the
 * TermSpine ruler already shows the term structure separately.
 */
export type CalendarCategoryKey = 'term' | 'exam' | 'staff' | 'general';
