import type { ReactNode } from 'react';

import { TEMPLATES, type TemplateKey } from '../state/templates';
import { useStory } from '../state/storyContext';
import styles from './TemplatePicker.module.css';

/**
 * Template picker grid. Mirrors the .tpl-grid markup in
 * 10-comms-cms.html (the modal body), rendered inline in the main
 * pane when view === 'new-story-picker'. On click, dispatches
 * START_NEW_STORY which also flips view -> 'editor'.
 */

type IconVariant = 'tpl-1' | 'tpl-2' | 'tpl-3' | 'tpl-4' | 'tpl-5' | 'tpl-6' | 'tpl-8';

type CardConfig = {
  key: TemplateKey;
  iconVariant: IconVariant;
  countLabel: string;
  description: string;
  icon: ReactNode;
};

const CARDS: ReadonlyArray<CardConfig> = [
  {
    key: 'today',
    iconVariant: 'tpl-8',
    countLabel: '1 card · Pinned',
    description:
      'Daily share asset pinned to the front of the rail. Poster, quiz, video, or PDF.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.7 5.2H19l-4.2 3.1 1.6 5.2L12 13.4l-4.4 3.1 1.6-5.2L5 8.2h5.3z" />
      </svg>
    ),
  },
  {
    key: 'enroll-camp',
    iconVariant: 'tpl-1',
    countLabel: 'Single / Multi-day',
    description:
      'Announce a new program. Pick Single-day for one-off events (Yoga Day) or Multi-day for workshops (Kids Camp, Stress Management).',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    key: 'daily-update',
    iconVariant: 'tpl-2',
    countLabel: '2 cards',
    description:
      "Day-of update inside an ongoing program. Today's expert, timing, focus, and arc progress.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    key: 'recovery',
    iconVariant: 'tpl-6',
    countLabel: '1 card',
    description:
      'Single video. Missed session recording, YouTube clip, or archive video. Expiry pill on thumbnail.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="m10 9 5 3-5 3z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'certificate',
    iconVariant: 'tpl-4',
    countLabel: 'Certificate / Resource',
    description:
      'Post-program deliverable. Workshop completion certificate or downloadable resource (recipe booklet, guide).',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="5" />
        <path d="M9 14l-2 6 5-3 5 3-2-6" />
      </svg>
    ),
  },
  {
    key: 'tools',
    iconVariant: 'tpl-1',
    countLabel: '2 cards',
    description:
      "Promote a tool or sister product. Mother's Day card maker, Create Everyday, Diwali poster, Digital Maa-stery.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 7a3 3 0 1 1 3 3l-7 7-3 1 1-3 7-7z" />
        <path d="M4 20l3-1" />
      </svg>
    ),
  },
  {
    key: 'monthly-calendar',
    iconVariant: 'tpl-5',
    countLabel: '2 cards',
    description:
      'Monthly schedule drop. Sessions, workshops, and special events for the month ahead.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4M8 14h2M13 14h2M18 14h.01M8 17h2M13 17h2" />
      </svg>
    ),
  },
  {
    key: 'feedback',
    iconVariant: 'tpl-3',
    countLabel: '1 card',
    description:
      'Post-program feedback. Short survey shown to members who completed a workshop or program.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v11H8l-4 4z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
];

// CSS module imports are typed as `Record<string, string>` so each lookup
// is `string | undefined` under noUncheckedIndexedAccess. Fall back to ''
// on the off chance a class isn't defined — keeps the type clean without
// disabling the strict flag.
const iconStyles: Record<IconVariant, string> = {
  'tpl-1': styles.tpl1 ?? '',
  'tpl-2': styles.tpl2 ?? '',
  'tpl-3': styles.tpl3 ?? '',
  'tpl-4': styles.tpl4 ?? '',
  'tpl-5': styles.tpl5 ?? '',
  'tpl-6': styles.tpl6 ?? '',
  'tpl-8': styles.tpl8 ?? '',
};

export function TemplatePicker() {
  const { dispatch } = useStory();

  return (
    <section className={styles.wrap} aria-label="Template picker">
      <header className={styles.header}>
        <h1 className={styles.title}>Pick a template</h1>
        <p className={styles.sub}>
          Eight templates cover every Habuild comms format. Today is always pinned first.
          Pick the template that matches your story type.
        </p>
      </header>

      <div className={styles.grid}>
        {CARDS.map((card) => {
          const def = TEMPLATES[card.key];
          const isPinned = def.pinned === true;
          return (
            <button
              key={card.key}
              type="button"
              className={`${styles.card} ${isPinned ? styles.cardPinned : ''}`}
              onClick={() => dispatch({ type: 'START_NEW_STORY', templateKey: card.key })}
            >
              <div className={styles.head}>
                <div className={`${styles.icon} ${iconStyles[card.iconVariant]}`} aria-hidden>
                  {card.icon}
                </div>
                <div className={styles.name}>{def.label}</div>
                <span className={`${styles.count} ${isPinned ? styles.countPinned : ''}`}>
                  {card.countLabel}
                </span>
              </div>
              <div className={styles.desc}>{card.description}</div>
              <div className={styles.meta}>
                <span>{def.format === 'poster' ? 'Poster' : 'Card stack'}</span>
                <span className={styles.cta}>Pick</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
