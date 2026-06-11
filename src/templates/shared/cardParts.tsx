import type { ReactNode } from 'react';

import styles from './card.module.css';

/**
 * Reusable visual primitives for the per-template card previews.
 * Mirrors the helper HTML factories in 10-comms-cms.html
 * (infoPillHtml, ctaHtml, heroImageHtml, focusBlockRender, metaRow3).
 */

export function asString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

export function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

export function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export function initials(name: string): string {
  const n = (name || '').trim();
  if (!n) return 'Hb';
  const parts = n.split(/\s+/);
  if (parts.length === 1) {
    const first = parts[0] ?? '';
    return first.slice(0, 2).toUpperCase();
  }
  const a = parts[0]?.[0] ?? '';
  const b = parts[1]?.[0] ?? '';
  return (a + b).toUpperCase();
}

export function isImageSource(s: string): boolean {
  if (!s) return false;
  return /^data:/.test(s) || /^https?:/i.test(s) || s.startsWith('/');
}

export function InfoPill({ text }: { text: string }) {
  if (!text) return null;
  return <div className={styles.infoPill}>{text}</div>;
}

export function CardFooter({
  primary,
  secondary,
}: {
  primary: string;
  secondary?: string;
}) {
  return (
    <div className={styles.foot}>
      <button type="button" className={styles.cta}>
        {primary || 'Enroll Now'}
      </button>
      {secondary ? (
        <button type="button" className={styles.cta2}>
          {secondary}
        </button>
      ) : null}
    </div>
  );
}

export function HeroImage({
  src,
  top,
  fallback = 'Hero image',
}: {
  src: string;
  top?: boolean;
  fallback?: string;
}) {
  const cls = `${styles.image} ${top ? styles.imageHeroTop : ''}`;
  if (src && isImageSource(src)) {
    return (
      <div className={cls} style={{ background: '#f4f5f7' }}>
        <img src={src} alt="" />
      </div>
    );
  }
  if (src) {
    return <div className={cls}>{src}</div>;
  }
  return <div className={cls}>{fallback}</div>;
}

export function ExpertRow({ name }: { name: string }) {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;
  return (
    <div className={styles.expertRow}>
      <div className={styles.expertAvatar}>{initials(trimmed)}</div>
      <div className={styles.expertName}>{trimmed.toUpperCase()}</div>
    </div>
  );
}

export function MetaRow3({
  time,
  duration,
  program,
}: {
  time: string;
  duration: string;
  program: string;
}) {
  const t = (time || '').trim();
  const d = (duration || '').trim();
  const p = (program || '').trim();
  if (!t && !d && !p) return null;
  return (
    <div className={styles.metaRow}>
      <div className={styles.metaCell}>
        <div className={styles.metaVal}>{t}</div>
        <div className={styles.metaLbl}>Time</div>
      </div>
      <div className={styles.metaCell}>
        <div className={styles.metaVal}>{d}</div>
        <div className={styles.metaLbl}>Duration</div>
      </div>
      <div className={styles.metaCell}>
        <div className={styles.metaVal}>{p}</div>
        <div className={styles.metaLbl}>Program</div>
      </div>
    </div>
  );
}

/**
 * Optional "Today's focus" block. Renders nothing when both title and
 * bullets are empty. Mirrors focusBlockRender() in the HTML.
 */
export function FocusBlock({
  title,
  bullets,
}: {
  title: string;
  bullets: ReadonlyArray<string>;
}) {
  const t = (title || '').trim();
  const clean = bullets.filter((b) => typeof b === 'string' && b.trim() !== '');
  if (!t && clean.length === 0) return null;
  return (
    <div className={styles.focusBlock}>
      {t ? <div className={styles.focusTitle}>{t}</div> : null}
      {clean.length > 0 ? (
        <ul className={styles.focusBullets}>
          {clean.map((b, i) => (
            <li key={i}>
              <span className={styles.focusDot} />
              {b}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Numbered timeline component, used by Multi-day Story 2, More-details,
 * Daily Session Story 2 (with rich_bullets shape), and others.
 * `rows` is the data; the caller maps to {title, sub} pairs.
 */
export type TimelineRow = { title: string; sub: string };
export function Timeline({ rows }: { rows: ReadonlyArray<TimelineRow> }) {
  if (rows.length === 0) return null;
  return (
    <div className={styles.timeline}>
      {rows.map((r, i) => {
        const t = (r.title || '').trim();
        const s = (r.sub || '').trim();
        return (
          <div className={styles.timelineRow} key={i}>
            <div className={styles.tlCircle}>{i + 1}</div>
            <div className={styles.tlText}>
              {t ? <div className={styles.tlTitle}>{t}</div> : null}
              {s ? <div className={styles.tlSub}>{s}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ScrollShell({
  children,
  withGradient = true,
}: {
  children: ReactNode;
  withGradient?: boolean;
}) {
  return (
    <div className={styles.scroll}>
      {withGradient ? <div className={styles.gradient} aria-hidden /> : null}
      {children}
    </div>
  );
}

export function CardInner({ children }: { children: ReactNode }) {
  return <div className={styles.inner}>{children}</div>;
}

export { styles as cardStyles };
