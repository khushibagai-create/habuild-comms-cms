import { useStory } from '../../state/storyContext';
import type { Audience, ScheduleMode } from '../../state/storyContext';
import { SelectField } from '../fields/SelectField';
import { TextField } from '../fields/TextField';
import { CardEditor } from './CardEditor';
import styles from './FormPane.module.css';

// Only enroll-camp supports user-added cards (More-details extras).
// Every other template has a fixed card count driven by template + variation.
const SUPPORTS_ADD_CARD = new Set<string>(['enroll-camp']);

/**
 * Form pane — vertical stack of:
 *   1. Settings block (schedule + audience + push toggle/copy).
 *   2. One CardEditor per card in the current story.
 *   3. "+ Add card" button.
 *
 * Settings live at story level (not per card), so they sit above the
 * card list. Push title/body inputs are inline — keeps the block to
 * one logical section instead of nested collapsibles.
 */

const SCHEDULE_OPTIONS = [
  { value: 'now', label: 'Publish now' },
  { value: 'later', label: 'Schedule for later' },
] as const;

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All members' },
  { value: 'event-enrolled', label: 'Event-enrolled' },
  { value: 'plan-tier', label: 'By plan tier' },
] as const;

export function FormPane() {
  const { state, dispatch } = useStory();
  const { currentStory } = state;
  const { cards, settings, templateKey } = currentStory;
  const canAddCard = templateKey !== null && SUPPORTS_ADD_CARD.has(templateKey);

  return (
    <div className={styles.pane}>
      {/* ---- Settings block ---- */}
      <section className={styles.settings} aria-label="Story settings">
        <div className={styles.settingsHead}>
          <div className={styles.settingsBadge}>S</div>
          <div className={styles.settingsTitle}>Settings</div>
          <div className={styles.settingsHint}>Schedule · Audience · Push</div>
        </div>

        <div className={`${styles.fieldRow} ${styles.cols3}`}>
          <SelectField
            label="Publish"
            value={settings.scheduleMode}
            onChange={(v) =>
              dispatch({
                type: 'SET_SETTINGS',
                patch: { scheduleMode: v as ScheduleMode },
              })
            }
            options={SCHEDULE_OPTIONS}
          />
          <TextField
            label="Date"
            type="date"
            value={settings.scheduleDate}
            onChange={(v) => dispatch({ type: 'SET_SETTINGS', patch: { scheduleDate: v } })}
          />
          <TextField
            label="Time"
            type="time"
            value={settings.scheduleTime}
            onChange={(v) => dispatch({ type: 'SET_SETTINGS', patch: { scheduleTime: v } })}
          />
        </div>

        <SelectField
          label="Audience"
          value={settings.audience}
          onChange={(v) =>
            dispatch({
              type: 'SET_SETTINGS',
              patch: { audience: v as Audience },
            })
          }
          options={AUDIENCE_OPTIONS}
          helperText="Audience filters are sourced from the Event page in the full CMS."
        />

        <div className={styles.switchRow}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={settings.pushEnabled}
              onChange={(e) =>
                dispatch({
                  type: 'SET_SETTINGS',
                  patch: { pushEnabled: e.target.checked },
                })
              }
            />
            <span className={styles.switchSlot} />
          </label>
          <span className={styles.switchLabel}>Send a push when this goes live</span>
        </div>

        {settings.pushEnabled ? (
          <div className={`${styles.fieldRow} ${styles.cols2}`}>
            <TextField
              label="Push title"
              value={settings.pushTitle}
              onChange={(v) => dispatch({ type: 'SET_SETTINGS', patch: { pushTitle: v } })}
              placeholder="Auto-generated from story heading"
            />
            <TextField
              label="Push body"
              value={settings.pushBody}
              onChange={(v) => dispatch({ type: 'SET_SETTINGS', patch: { pushBody: v } })}
              placeholder="Auto-generated from subheading"
            />
          </div>
        ) : null}
      </section>

      {/* ---- Cards ---- */}
      <div className={styles.cardsHeader}>
        <div className={styles.cardsHeaderTitle}>Cards</div>
      </div>

      {cards.map((card, idx) => (
        <CardEditor
          key={idx}
          index={idx}
          card={card}
          defaultOpen={idx === 0}
          canRemove={cards.length > 1}
        />
      ))}

      {canAddCard ? (
        <button
          type="button"
          className={styles.addCardBtn}
          onClick={() => dispatch({ type: 'ADD_CARD' })}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Add card
        </button>
      ) : null}
    </div>
  );
}
