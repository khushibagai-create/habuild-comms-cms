import { PALETTES, PALETTE_KEYS, type PaletteKey } from '../../state/palettes';
import styles from './ColorPaletteSwatches.module.css';

/**
 * 5-dot palette picker. Mirrors .palette-picker / .pp-swatch markup
 * in 10-comms-cms.html. Used in the editor header above the form.
 */
export type ColorPaletteSwatchesProps = {
  value: PaletteKey;
  onChange: (next: PaletteKey) => void;
  showLabel?: boolean;
};

export function ColorPaletteSwatches({
  value,
  onChange,
  showLabel = true,
}: ColorPaletteSwatchesProps) {
  return (
    <div className={styles.wrap} role="radiogroup" aria-label="Palette">
      {showLabel ? <div className={styles.label}>Palette</div> : null}
      <div className={styles.swatches}>
        {PALETTE_KEYS.map((key) => {
          const palette = PALETTES[key];
          const isSelected = key === value;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`${styles.swatch} ${isSelected ? styles.swatchSelected : ''}`}
              onClick={() => onChange(key)}
              title={palette.name}
            >
              <span className={styles.dot} style={{ background: palette.cta }} aria-hidden>
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={styles.name}>{palette.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
