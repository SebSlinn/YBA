'use client';

import { CalendarEvent } from '@/types/calendar';
import { categoryFor } from './calendarCategories';
import styles from './AgendaList.module.css';

interface AgendaListProps {
  events: CalendarEvent[];
}

function dateKey(d: Date): string {
  return d.toDateString();
}

function formatTime(e: CalendarEvent): string {
  if (e.allDay) return 'All day';
  return e.startDate.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });
}

export function AgendaList({ events }: AgendaListProps) {
  const sorted = [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const groups = new Map<string, CalendarEvent[]>();
  for (const e of sorted) {
    const key = dateKey(e.startDate);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }

  if (groups.size === 0) {
    return <p className={styles.empty}>Nothing scheduled here yet.</p>;
  }

  return (
    <div className={styles.agenda}>
      {Array.from(groups.entries()).map(([key, dayEvents]) => {
        const date = dayEvents[0].startDate;
        return (
          <div key={key} className={styles.dayGroup}>
            <div className={styles.dateColumn}>
              <span className={styles.dateNum}>{date.getDate()}</span>
              <span className={styles.dateMonth}>{date.toLocaleDateString('en-GB', { month: 'short' })}</span>
              <span className={styles.dateWeekday}>{date.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
            </div>

            <ul className={styles.eventList}>
              {dayEvents.map((e) => {
                const cat = categoryFor(e.category);
                const content = (
                  <>
                    <span className={styles.dot} style={{ background: `var(${cat.colorVar})` }} aria-hidden="true" />
                    <span className={styles.eventBody}>
                      <span className={styles.eventTitle}>{e.title}</span>
                      <span className={styles.eventMeta}>
                        {formatTime(e)}
                        {e.location ? ` · ${e.location}` : ''}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li key={e.id} className={styles.eventItem}>
                    {e.url ? (
                      <a href={e.url} className={styles.eventLink}>
                        {content}
                      </a>
                    ) : (
                      <div className={styles.eventLink}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
