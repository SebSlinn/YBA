'use client';

import styles from './TermSpine.module.css';

export interface TermMarker {
  label: string;
  start: Date;
  end: Date;
}

interface TermSpineProps {
  yearStart: Date;
  yearEnd: Date;
  terms: TermMarker[];
  today?: Date;
}

const TERM_PALETTE = ['--cal-ink', '--cal-slate', '--cal-sage'];

function pct(date: Date, start: Date, end: Date): number {
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 0;
  const elapsed = date.getTime() - start.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

/**
 * A physical "wall planner" reading of the school year: a horizontal
 * ruler spanning September to the following summer, with each term
 * marked as a block and a pin showing where today falls. This is the one
 * deliberately bold element in the calendar — everything else stays
 * quiet around it.
 *
 * Pass real term dates in via `terms` (e.g. sourced from a Directus
 * "term dates" record, or hand-maintained) — nothing here is hardcoded
 * to a specific school year.
 */
export function TermSpine({ yearStart, yearEnd, terms, today = new Date() }: TermSpineProps) {
  const months: Date[] = [];
  const cursor = new Date(yearStart.getFullYear(), yearStart.getMonth(), 1);
  while (cursor <= yearEnd) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const showToday = today >= yearStart && today <= yearEnd;
  const todayPct = pct(today, yearStart, yearEnd);

  return (
    <div
      className={styles.spine}
      role="img"
      aria-label={`School year ${yearStart.getFullYear()}–${yearEnd.getFullYear()}, ${
        showToday ? 'today marked' : 'today outside this range'
      }`}
    >
      <div className={styles.track}>
        {terms.map((term, i) => {
          const left = pct(term.start, yearStart, yearEnd);
          const width = pct(term.end, yearStart, yearEnd) - left;
          const colorVar = TERM_PALETTE[i % TERM_PALETTE.length];
          return (
            <div
              key={term.label}
              className={styles.termBlock}
              style={{ left: `${left}%`, width: `${width}%`, background: `var(${colorVar})` }}
            >
              <span className={styles.termLabel} style={{ color: `var(${colorVar})` }}>
                {term.label}
              </span>
            </div>
          );
        })}

        {months.map((m) => (
          <div key={m.toISOString()} className={styles.tick} style={{ left: `${pct(m, yearStart, yearEnd)}%` }}>
            <span className={styles.tickLabel}>{m.toLocaleDateString('en-GB', { month: 'short' })}</span>
          </div>
        ))}

        {showToday && (
          <div className={styles.todayPin} style={{ left: `${todayPct}%` }}>
            <span className={styles.todayLabel}>Today</span>
          </div>
        )}
      </div>
    </div>
  );
}
