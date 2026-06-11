import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import styles from './Topbar.module.css';

/**
 * Mirrors .topbar in 10-comms-cms.html: sticky 52px bar with
 * a breadcrumb trail on the left, flex spacer, and an action slot
 * on the right that callers fill (e.g. "+ New story").
 */

export function Topbar({
  crumbs,
  actions,
}: {
  crumbs: ReadonlyArray<Crumb>;
  actions?: ReactNode;
}) {
  return (
    <div className={styles.topbar}>
      <Breadcrumbs items={crumbs} />
      <div className={styles.spacer} />
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
