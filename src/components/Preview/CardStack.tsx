import { useEffect, useState } from 'react';

import type { StoryCard } from '../../state/storyContext';
import type { TemplateKey } from '../../state/templates';
import { TEMPLATES } from '../../state/templates';
import { TEMPLATE_CARDS } from '../../templates';
import styles from './CardStack.module.css';

/**
 * Renders a story's cards inside the phone frame as a card stack.
 * Phase 3 ships a generic card stub (title / subtitle / image / CTA)
 * driven off three known field keys. Phase 4 will replace this with
 * one per-template card component selected by `templateKey`.
 *
 * The palette is applied on the PhoneFrame wrapper, so every var(--p-*)
 * inside resolves correctly without prop-drilling.
 */
export type CardStackProps = {
  cards: ReadonlyArray<StoryCard>;
  /** Header line shown above the card (program name fallback). */
  programName?: string;
  /** Smaller header subline (e.g. "Starts on Jun 12"). */
  startsOn?: string;
  /** Active template key — drives which template card component renders. */
  templateKey?: TemplateKey | null;
  /** Active variation, if any — passed through to the template card. */
  variation?: string;
};

function asString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function CardStack({
  cards,
  programName = 'Habuild',
  startsOn = '',
  templateKey,
  variation,
}: CardStackProps) {
  const safeCards = cards.length === 0 ? [{}] : cards;
  const [activeIdx, setActiveIdx] = useState(0);

  // If cards shrink (card removed) while we're on a now-out-of-range index,
  // pull the active card back inside bounds.
  useEffect(() => {
    if (activeIdx >= safeCards.length) {
      setActiveIdx(Math.max(0, safeCards.length - 1));
    }
  }, [safeCards.length, activeIdx]);

  const activeCard = safeCards[activeIdx] ?? {};
  const title = asString(activeCard.title);
  const subtitle = asString(activeCard.subtitle);
  const cta = asString(activeCard.cta) || 'Open';
  const image = asString(activeCard.image);

  const prevDisabled = activeIdx === 0;
  const nextDisabled = activeIdx >= safeCards.length - 1;
  const showNav = safeCards.length > 1;

  // Per-template card if registered; otherwise the generic stub below
  // keeps templates without a registry entry rendering.
  const TemplateCard = templateKey ? TEMPLATE_CARDS[templateKey] : undefined;
  const isPoster = templateKey ? TEMPLATES[templateKey].format === 'poster' : false;

  // Poster format (Today): the template renders its own full-bleed story —
  // skip the standard story-header + .pcard chrome to avoid doubling up.
  if (isPoster && TemplateCard) {
    return (
      <div className={styles.stack}>
        <div className={styles.posterShell}>
          <TemplateCard
            card={activeCard}
            cardIndex={activeIdx}
            variation={variation}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stack}>
      <div className={styles.storyHeader}>
        <div className={styles.headerAvatar}>{initials(programName) || 'Hb'}</div>
        <div className={styles.headerMeta}>
          <div className={styles.headerName}>{programName}</div>
          {startsOn ? <div className={styles.headerSub}>{startsOn}</div> : null}
        </div>
        <div className={styles.headerClose} aria-hidden>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className={styles.pcard}>
        {TemplateCard ? (
          <TemplateCard
            card={activeCard}
            cardIndex={activeIdx}
            variation={variation}
          />
        ) : (
          <>
            <div className={styles.pcardScroll}>
              <div className={styles.pcardGradient} aria-hidden />
              <div className={styles.pcardInner}>
                <div className={styles.infoPill}>
                  Story · {activeIdx + 1}/{safeCards.length}
                </div>
                <div className={styles.pcardTitle}>{title || 'Card title appears here'}</div>
                {subtitle ? (
                  <div className={styles.pcardSub}>{subtitle}</div>
                ) : (
                  <div className={styles.pcardSub}>
                    Subtitle appears here. Phase 4 swaps this stub for the per-template card.
                  </div>
                )}
                <div className={styles.pcardImage}>
                  {image ? <img src={image} alt="" /> : <span>Image</span>}
                </div>
              </div>
            </div>
            <div className={styles.pcardFooter}>
              <button type="button" className={styles.pcardCta}>
                {cta}
              </button>
            </div>
          </>
        )}
      </div>

      {showNav ? (
        <div className={styles.pcardNav}>
          <button
            type="button"
            className={styles.arrow}
            disabled={prevDisabled}
            onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
            aria-label="Previous card"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={styles.dots}>
            {safeCards.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ''}`}
                onClick={() => setActiveIdx(i)}
                aria-label={`Card ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.arrow}
            disabled={nextDisabled}
            onClick={() => setActiveIdx((i) => Math.min(safeCards.length - 1, i + 1))}
            aria-label="Next card"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
