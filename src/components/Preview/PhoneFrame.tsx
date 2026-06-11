import type { CSSProperties, ReactNode } from 'react';

import styles from './PhoneFrame.module.css';

/**
 * iPhone-shape preview frame. Mirrors .device-frame + .phone in
 * 10-comms-cms.html. The palette is applied via inline CSS vars on the
 * phone element so the entire card subtree picks it up via var(--p-*).
 */
export type PhoneFrameProps = {
  children: ReactNode;
  /** Inline style string from paletteStyleString(). Passed through as-is. */
  paletteStyle?: string;
  /** Optional data-palette attribute for selector-based overrides. */
  paletteAttr?: string;
};

export function PhoneFrame({ children, paletteStyle, paletteAttr }: PhoneFrameProps) {
  // The inline style string is a `--p-cta:#…;--p-dark:#…;…` blob. React
  // wants an object, so parse on the fly. Keeping the string-based API
  // matches paletteStyleString() in the source HTML.
  const inlineStyle: CSSProperties | undefined = paletteStyle
    ? parseStyleString(paletteStyle)
    : undefined;

  return (
    <div className={styles.deviceFrame}>
      <div
        className={styles.phone}
        data-palette={paletteAttr}
        style={inlineStyle}
      >
        <div className={styles.island} aria-hidden />
        {children}
      </div>
    </div>
  );
}

function parseStyleString(s: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of s.split(';')) {
    const [rawKey, ...rest] = decl.split(':');
    if (!rawKey) continue;
    const key = rawKey.trim();
    const value = rest.join(':').trim();
    if (key.length === 0 || value.length === 0) continue;
    out[key] = value;
  }
  return out as CSSProperties;
}
