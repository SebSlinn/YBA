'use client';

import { useMemo, useState } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { TermSpine, TermMarker } from './TermSpine';
import { MonthGrid } from './MonthGrid';
import { AgendaList } from './AgendaList';
import { CategoryFilter } from './CategoryFilter';
import { CALENDAR_CATEGORY_LIST, categoryFor } from './calendarCategories';
import styles from './SchoolCalendar.module.css';
import './calendar-tokens.css';

type ViewMode = 'month' | 'agenda';

interface SchoolYear {
  start: Date;
  end: Date;
  terms: TermMarker[];
}

interface SchoolCalendarProps {
  events: CalendarEvent[];
  /** Optional — omit and the term-spine ruler simply won't render. */
  schoolYear?: SchoolYear;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function SchoolCalendar({ events, schoolYear }: SchoolCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [view, setView] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(CALENDAR_CATEGORY_LIST.map((c) => c.key))
  );

  const filteredEvents = useMemo(
    () => events.filter((e) => activeCategories.has(categoryFor(e.category).key)),
    [events, activeCategories]
  );

  const monthEvents = useMemo(
    () =>
      filteredEvents.filter((e) => {
        const end = e.endDate ?? e.startDate;
        return (
          (e.startDate.getFullYear() === currentMonth.getFullYear() && e.startDate.getMonth() === currentMonth.getMonth()) ||
          (end.getFullYear() === currentMonth.getFullYear() && end.getMonth() === currentMonth.getMonth())
        );
      }),
    [filteredEvents, currentMonth]
  );

  const agendaEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return filteredEvents.filter((e) => (e.endDate ?? e.startDate) >= now);
  }, [filteredEvents]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filteredEvents.filter((e) => {
      const start = e.startDate;
      const end = e.endDate ?? e.startDate;
      const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
      return start <= dayEnd && end >= dayStart;
    });
  }, [filteredEvents, selectedDate]);

  function toggleCategory(key: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function goToMonth(offset: number) {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedDate(null);
  }

  function goToToday() {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  }

  return (
    <div className="calendarScope">
      {schoolYear && (
        <TermSpine yearStart={schoolYear.start} yearEnd={schoolYear.end} terms={schoolYear.terms} />
      )}

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {view === 'month' && (
            <div className={styles.monthNav}>
              <button type="button" className={styles.navButton} onClick={() => goToMonth(-1)} aria-label="Previous month">
                ‹
              </button>
              <h2 className={styles.monthTitle}>
                {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </h2>
              <button type="button" className={styles.navButton} onClick={() => goToMonth(1)} aria-label="Next month">
                ›
              </button>
            </div>
          )}
          {view === 'agenda' && <h2 className={styles.monthTitle}>What&rsquo;s coming up</h2>}
        </div>

        <div className={styles.headerRight}>
          <button type="button" className={styles.todayButton} onClick={goToToday}>
            Today
          </button>
          <div className={styles.viewToggle} role="group" aria-label="Calendar view">
            <button
              type="button"
              className={styles.viewButton}
              data-active={view === 'month'}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={styles.viewButton}
              data-active={view === 'agenda'}
              onClick={() => setView('agenda')}
            >
              Agenda
            </button>
          </div>
        </div>
      </div>

      <div className={styles.filterRow}>
        <CategoryFilter active={activeCategories} onToggle={toggleCategory} />
      </div>

      <div className={styles.body}>
        {view === 'month' ? (
          <MonthGrid month={currentMonth} events={monthEvents} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        ) : (
          <AgendaList events={agendaEvents} />
        )}
      </div>

      {view === 'month' && selectedDate && (
        <div className={styles.dayPanel}>
          <h3 className={styles.dayPanelTitle}>
            {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          {selectedDayEvents.length === 0 ? (
            <p className={styles.dayPanelEmpty}>Nothing scheduled.</p>
          ) : (
            <AgendaList events={selectedDayEvents} />
          )}
        </div>
      )}
    </div>
  );
}
