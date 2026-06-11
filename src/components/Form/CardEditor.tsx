import { useState, type ReactNode } from 'react';

import { useStory, type StoryCard } from '../../state/storyContext';
import { TextField } from '../fields/TextField';
import { TextArea } from '../fields/TextArea';
import { ImageUpload } from '../fields/ImageUpload';
import { TEMPLATE_FIELDS } from '../../templates';
import styles from './CardEditor.module.css';

/**
 * Collapsible per-card section. Phase 3 renders a generic title /
 * subtitle / CTA / image set. Phase 4 will swap this for a
 * template-specific field set (looked up by templateKey) — the
 * component is shaped so that swap is one branch.
 */
export type CardEditorProps = {
  /** Index of the card in `state.currentStory.cards`. */
  index: number;
  card: StoryCard;
  /** Whether the section starts open. First card defaults to open. */
  defaultOpen?: boolean;
  /** Whether the Remove button is shown. Hidden when only one card remains. */
  canRemove: boolean;
};

function asString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

export function CardEditor({ index, card, defaultOpen = true, canRemove }: CardEditorProps) {
  const { state, dispatch } = useStory();
  const [open, setOpen] = useState(defaultOpen);
  const { templateKey, variation } = state.currentStory;

  const update = (patch: Partial<StoryCard>) => {
    dispatch({ type: 'UPDATE_CARD', index, patch });
  };

  const onRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canRemove) return;
    dispatch({ type: 'REMOVE_CARD', index });
  };

  // Per-template fields if registered; otherwise fall back to the generic
  // title/subtitle/cta/image block so templates without a registry entry
  // (e.g. ones owned by the parallel agent) still render an editor.
  const TemplateFields = templateKey ? TEMPLATE_FIELDS[templateKey] : undefined;

  const fields: ReactNode = TemplateFields ? (
    <TemplateFields
      card={card}
      cardIndex={index}
      variation={variation}
      onPatch={(patch) => update(patch as Partial<StoryCard>)}
    />
  ) : (
    <>
      <TextField
        label="Title"
        value={asString(card.title)}
        onChange={(v) => update({ title: v })}
        placeholder="Card title"
      />
      <TextArea
        label="Subtitle"
        value={asString(card.subtitle)}
        onChange={(v) => update({ subtitle: v })}
        placeholder="Short supporting copy"
        rows={2}
      />
      <TextField
        label="CTA label"
        value={asString(card.cta)}
        onChange={(v) => update({ cta: v })}
        placeholder="Open"
      />
      <ImageUpload
        label="Image"
        value={asString(card.image) || null}
        metaName={asString(card.image_name) || undefined}
        metaSize={asNumber(card.image_size)}
        onChange={(next, meta) => {
          if (next === null) {
            update({ image: '', image_name: '', image_size: undefined });
          } else {
            update({
              image: next,
              image_name: meta?.name ?? '',
              image_size: meta?.size,
            });
          }
        }}
      />
    </>
  );

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={`${styles.head} ${open ? styles.headOpen : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <svg
          className={`${styles.caret} ${open ? '' : styles.caretCollapsed}`}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className={styles.cardBadge}>{index + 1}</div>
        <div className={styles.title}>Card {index + 1}</div>
        <div className={styles.spacer} />
        {canRemove ? (
          <span
            role="button"
            tabIndex={0}
            className={styles.removeBtn}
            onClick={onRemove}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                dispatch({ type: 'REMOVE_CARD', index });
              }
            }}
          >
            Remove
          </span>
        ) : null}
      </button>
      <div className={open ? styles.body : styles.collapsedBody}>{fields}</div>
    </div>
  );
}
