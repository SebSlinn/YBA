'use client';

import { CalendarEvent } from '@/types/calendar';
import { categoryFor } from './calendarCategories';
import styles from './MonthGrid.module.css';

interface MonthGridProps {
  month: Date; // any date within the month to display
  events: CalendarEvent[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_VISIBLE = 3;

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildGridDays(month: Date): Date[] {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday-first
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - startOffset);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
}

function eventsOnDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((e) => {
    const start = e.startDate;
    const end = e.endDate ?? e.startDate;
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    return start <= dayEnd && end >= dayStart;
  });
}

export function MonthGrid({ month, events, selectedDate, onSelectDate }: MonthGridProps) {
  const days = buildGridDays(month);
  const today = new Date();

  return (
    <div className={styles.grid}>
      {WEEKDAYS.map((label) => (
        <div key={label} className={styles.weekdayLabel}>
          {label}
        </div>
      ))}

      {days.map((day) => {
        const inMonth = day.getMonth() === month.getMonth();
        const dayEvents = eventsOnDay(events, day);
        const isToday = isSameDay(day, today);
        const isSelected = selectedDate !== null && isSameDay(day, selectedDate);
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;

        return (
          <button
            key={day.toISOString()}
            type="button"
            className={[
              styles.cell,
              !inMonth ? styles.outsideMonth : '',
              isWeekend ? styles.weekend : '',
              isSelected ? styles.selected : '',
            ].join(' ')}
            onClick={() => onSelectDate(day)}
            aria-pressed={isSelected}
            aria-label={`${day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}${
              dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''
            }`}
          >
            <span className={[styles.dayNumber, isToday ? styles.todayNumber : ''].join(' ')}>{day.getDate()}</span>

            <span className={styles.chips}>
              {dayEvents.slice(0, MAX_VISIBLE).map((e) => {
                const cat = categoryFor(e.category);
                return (
                  <span key={e.id} className={styles.chip} style={{ background: `var(${cat.softVar})`, color: `var(${cat.colorVar})` }}>
                    {e.title}
                  </span>
                );
              })}
              {dayEvents.length > MAX_VISIBLE && (
                <span className={styles.moreChip}>+{dayEvents.length - MAX_VISIBLE} more</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
