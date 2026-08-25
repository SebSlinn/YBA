'use client';

import { CALENDAR_CATEGORY_LIST } from './calendarCategories';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  active: Set<string>;
  onToggle: (key: string) => void;
}

export function CategoryFilter({ active, onToggle }: CategoryFilterProps) {
  return (
    <div className={styles.row} role="group" aria-label="Filter by category">
      {CALENDAR_CATEGORY_LIST.map((cat) => {
        const isActive = active.has(cat.key);
        return (
          <button
            key={cat.key}
            type="button"
            className={styles.chip}
            aria-pressed={isActive}
            data-active={isActive}
            onClick={() => onToggle(cat.key)}
          >
            <span className={styles.dot} style={{ background: `var(${cat.colorVar})` }} aria-hidden="true" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
