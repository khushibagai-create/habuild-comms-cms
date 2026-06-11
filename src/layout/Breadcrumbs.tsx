import type { MouseEvent } from 'react';
import styles from './Breadcrumbs.module.css';

/**
 * Small crumb trail. Matches .crumbs in 10-comms-cms.html — clickable
 * non-leaf items, plain leaf for the current location, "/" separators.
 */

export type Crumb = {
  label: string;
  onClick?: () => void;
};

export function Breadcrumbs({ items }: { items: ReadonlyArray<Crumb> }) {
  return (
    <nav className={styles.crumbs} aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLeaf = i === items.length - 1;
        const isClickable = !isLeaf && typeof item.onClick === 'function';
        const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
          e.preventDefault();
          item.onClick?.();
        };
        return (
          <span key={`${item.label}-${i}`} className={styles.crumbWrap}>
            {isClickable ? (
              <span
                role="link"
                tabIndex={0}
                className={`${styles.crumb} ${styles.clickable}`}
                onClick={handleClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.onClick?.();
                  }
                }}
              >
                {item.label}
              </span>
            ) : (
              <span className={`${styles.crumb} ${isLeaf ? styles.leaf : ''}`}>
                {item.label}
              </span>
            )}
            {!isLeaf && <span className={styles.sep} aria-hidden>/</span>}
          </span>
        );
      })}
    </nav>
  );
}
