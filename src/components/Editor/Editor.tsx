import { useStory } from '../../state/storyContext';
import { TEMPLATES } from '../../state/templates';
import { paletteStyleString } from '../../state/palettes';
import { ColorPaletteSwatches } from '../fields/ColorPaletteSwatches';
import { FormPane } from '../Form/FormPane';
import { PhoneFrame } from '../Preview/PhoneFrame';
import { CardStack } from '../Preview/CardStack';
import styles from './Editor.module.css';

/**
 * Editor shell — split-pane container that wraps a form on the left
 * and a sticky phone-frame preview on the right. Mirrors .form-screen
 * in 10-comms-cms.html.
 *
 * The header carries the back link, template name, palette swatches,
 * optional variation toggle, and save / publish actions. The form
 * column scrolls; the preview column is sticky.
 */
const VARIATION_LABELS: Record<string, string> = {
  poster: 'Poster',
  quiz: 'Quiz',
  video: 'Video',
  pdf: 'PDF',
  single: 'Single day',
  multi: 'Multi day',
  certificate: 'Certificate',
  resource: 'Resource',
};

function formatVariationLabel(v: string): string {
  return VARIATION_LABELS[v] ?? v.charAt(0).toUpperCase() + v.slice(1);
}

export function Editor() {
  const { state, dispatch } = useStory();
  const { currentStory } = state;
  const { templateKey, paletteKey, variation, cards } = currentStory;

  if (templateKey === null) {
    // Defensive — view should only flip to 'editor' once a template is set.
    return null;
  }

  const tpl = TEMPLATES[templateKey];
  const variations = tpl.variations;
  const paletteStyle = paletteStyleString(paletteKey);

  const onBack = () => dispatch({ type: 'SET_VIEW', view: 'new-story-picker' });
  const onSave = () => dispatch({ type: 'SAVE_STORY' });

  const previewSub =
    tpl.format === 'poster'
      ? "Today's share preview"
      : cards.length > 1
        ? `Card stack · ${cards.length} cards`
        : '1 card';

  return (
    <div className={styles.editor}>
      <div className={styles.formCol}>
        {/* ----- Header ----- */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <button type="button" className={styles.backLink} onClick={onBack}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3 4 8l6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to picker
            </button>
            <div className={styles.tplPill}>Template</div>
            <div className={styles.tplName}>{tpl.label}</div>
            <div className={styles.spacer} />
            <div className={styles.headerActions}>
              <button type="button" className={styles.btn} onClick={onSave}>
                Save draft
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={onSave}
              >
                Publish
              </button>
            </div>
          </div>

          <ColorPaletteSwatches
            value={paletteKey}
            onChange={(next) => dispatch({ type: 'SET_PALETTE', paletteKey: next })}
          />

          {variations !== undefined && variations.length > 0 ? (
            <div className={styles.variationRow}>
              <div className={styles.variationLabel}>Variation</div>
              <div className={styles.variation} role="radiogroup" aria-label="Variation">
                {variations.map((v) => {
                  const isActive = v === (variation ?? variations[0]);
                  return (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      className={`${styles.vTab} ${isActive ? styles.vTabActive : ''}`}
                      onClick={() => dispatch({ type: 'SET_VARIATION', variation: v })}
                    >
                      {formatVariationLabel(v)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* ----- Form ----- */}
        <FormPane />

        {/* ----- Footer ----- */}
        <div className={styles.formFooter}>
          <div className={styles.statusDot}>
            <span className={styles.statusDotInner} /> Draft auto-saved in memory
          </div>
          <button type="button" className={styles.btn} onClick={onSave}>
            Save draft
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={onSave}
          >
            Publish
          </button>
        </div>
      </div>

      {/* ----- Preview ----- */}
      <aside className={styles.previewCol}>
        <div className={styles.previewShell}>
          <div className={styles.previewHead}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="3" y="2" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="8" cy="12" r="0.8" fill="currentColor" />
            </svg>
            <span className={styles.previewTitle}>Live preview</span>
            <span className={styles.previewSub}>{previewSub}</span>
          </div>
          <PhoneFrame paletteStyle={paletteStyle} paletteAttr={paletteKey}>
            <CardStack
              cards={cards}
              programName={tpl.label}
              templateKey={templateKey}
              variation={variation}
            />
          </PhoneFrame>
        </div>
      </aside>
    </div>
  );
}
