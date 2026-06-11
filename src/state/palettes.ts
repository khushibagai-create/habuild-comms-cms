/**
 * 5-palette theme system for member-facing cards.
 * Mirrors the PALETTES object in prototypes/comms-in-app/10-comms-cms.html.
 *
 * The CSS side of this lives in src/styles/tokens.css under the
 * [data-palette="..."] selectors. The TS side is here so the picker UI
 * and any imperative style needs (e.g. canvas exports) can read the same
 * source of truth.
 */

export type PaletteKey = 'blue' | 'purple' | 'green' | 'coral' | 'gold';

export type Palette = {
  name: string;
  cta: string;
  dark: string;
  mid: string;
  light: string;
  gradientTop: string;
  statBg: string;
  todayPill: string;
  pillText: string;
  ctaText: string;
};

export const PALETTES: Record<PaletteKey, Palette> = {
  blue: {
    name: 'Blue',
    cta: '#0A6598',
    dark: '#0369A1',
    mid: '#0281CA',
    light: '#1C7BB0',
    gradientTop: '#E0F2FE',
    statBg: '#EFF6FF',
    todayPill: '#0A6598',
    pillText: '#FFFFFF',
    ctaText: '#FFFFFF',
  },
  purple: {
    name: 'Purple',
    cta: '#A23AAD',
    dark: '#692770',
    mid: '#87458E',
    light: '#B977C0',
    gradientTop: '#F3E8FF',
    statBg: '#FAF5FF',
    todayPill: '#A23AAD',
    pillText: '#FFFFFF',
    ctaText: '#FFFFFF',
  },
  green: {
    name: 'Green',
    cta: '#5EA123',
    dark: '#3E5F20',
    mid: '#608043',
    light: '#86A85F',
    gradientTop: '#ECFDF5',
    statBg: '#F0FDF4',
    todayPill: '#5EA123',
    pillText: '#FFFFFF',
    ctaText: '#FFFFFF',
  },
  coral: {
    name: 'Coral',
    cta: '#FF5269',
    dark: '#952837',
    mid: '#997C7F',
    light: '#FBA5AF',
    gradientTop: '#FFE4E6',
    statBg: '#FFF1F2',
    todayPill: '#FF5269',
    pillText: '#FFFFFF',
    ctaText: '#FFFFFF',
  },
  gold: {
    name: 'Gold',
    cta: '#9A6009',
    dark: '#6E4506',
    mid: '#8A6A35',
    light: '#C99D60',
    gradientTop: '#FEF8EE',
    statBg: '#FAF3E5',
    todayPill: '#9A6009',
    pillText: '#FFFFFF',
    ctaText: '#FFFFFF',
  },
};

export const PALETTE_KEYS: PaletteKey[] = ['blue', 'purple', 'green', 'coral', 'gold'];

/**
 * Inline-style string for a palette, mirroring paletteStyleString() in the
 * source HTML. Useful when a subtree needs to override the palette without
 * relying on [data-palette] (e.g. a canvas/HTML export).
 */
export function paletteStyleString(key: PaletteKey): string {
  const p = PALETTES[key] ?? PALETTES.blue;
  return [
    `--p-cta:${p.cta}`,
    `--p-dark:${p.dark}`,
    `--p-mid:${p.mid}`,
    `--p-light:${p.light}`,
    `--p-gradient-top:${p.gradientTop}`,
    `--p-stat-bg:${p.statBg}`,
    `--p-today-pill:${p.todayPill}`,
    `--p-pill-text:${p.pillText}`,
    `--p-cta-text:${p.ctaText}`,
  ].join(';');
}
