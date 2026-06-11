import { useEffect, useMemo, useRef, useState } from 'react';
import type { CardProps } from '../types';
import { asString, asArray, isImageSource } from '../shared/cardParts';
import styles from './Card.module.css';

/* Today template — variation-aware single-card preview.

   Layout per the App Pod Design (2026-06):
     - Poster / PDF / Video share a layout: thin top ribbon, hero image
       (~60% of card), title, description, secondary text link with
       chevron, and a full-width primary CTA. The video variation adds a
       play overlay on the image. PDF and Poster swap the ribbon copy.
     - Quiz is a distinct layout: instructor image fills the top half,
       a white rounded card slides up over the lower half holding the
       question + options + "Get Hint" link. Two preview-only "2nd open"
       states swap the question card for completion or wrong-answer
       summaries. A no-image toggle hides the instructor image and
       centers the question card.
     - Optional Poster sub-state: clicking the poster image expands it
       to fill the card with a NAVIGATE pill on top. Click again to
       collapse.

   CTA colors are palette-driven via var(--p-cta) — the global palette
   picker on the editor governs them. Per-variation themed colors in
   the design mocks are visual variety only; we follow whatever palette
   the user selects. */

type Variation = 'poster' | 'quiz' | 'video' | 'pdf';

function readVariation(card: Record<string, unknown>, fallback?: string): Variation {
  const raw = asString(card.variation) || asString(fallback);
  if (raw === 'quiz' || raw === 'video' || raw === 'pdf') return raw;
  return 'poster';
}

function defaultRibbon(v: Variation, card: Record<string, unknown>): string {
  if (v === 'poster') {
    const edition = asString(card.poster_edition).trim() || '13TH EDITION';
    return `Today's Poster · ${edition}`;
  }
  if (v === 'pdf') {
    return asString(card.pdf_pages).trim() || '12 Pages PDF';
  }
  if (v === 'video') {
    return asString(card.video_theme).trim() || 'Meditation';
  }
  return asString(card.quiz_ribbon).trim() || "Today's Quiz";
}

type QuizPhase = 'initial' | 'wrong' | 'correct' | 'correctRevealed' | 'hint';

type QuizState = {
  phase: QuizPhase;
  pickedIdx: number | null;
  hintWrongIdx: number | null;
};

export function TodayCard({ card, variation }: CardProps) {
  const v = readVariation(card, variation);

  // Shared field reads
  const title = asString(card.title).trim() || asString(card.heading).trim();
  const description = asString(card.description).trim() || asString(card.subheading).trim();
  const posterImage = asString(card.poster_image).trim();
  const renderableImg = posterImage && isImageSource(posterImage) ? posterImage : '';
  const ribbon = defaultRibbon(v, card);
  const primaryLabel = asString(card.cta).trim() || defaultPrimaryLabel(v);
  const secondaryLabel = asString(card.secondary_cta_text).trim() || defaultSecondaryLabel(v);

  return (
    <div className={styles.story}>
      <div className={styles.cardWrap}>
        {v === 'quiz' ? (
          <QuizCard
            card={card}
            ribbon={ribbon}
            primaryLabel={primaryLabel}
            renderableImg={renderableImg}
          />
        ) : (
          <StandardCard
            variation={v}
            ribbon={ribbon}
            title={title}
            description={description}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            renderableImg={renderableImg}
          />
        )}
      </div>
      <div className={styles.bottomNav}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.dotActive}`} />
        </div>
      </div>
    </div>
  );
}

function defaultPrimaryLabel(v: Variation): string {
  if (v === 'video') return 'Watch Now';
  if (v === 'pdf') return 'Download PDF';
  if (v === 'quiz') return 'Share this Quiz';
  return 'Share Poster';
}

function defaultSecondaryLabel(v: Variation): string {
  if (v === 'video') return 'Share Video';
  if (v === 'pdf') return 'Share PDF';
  return 'Download Poster';
}

/* -------------------------------------------------------------------------- */
/* Standard card: Poster / PDF / Video                                        */
/* -------------------------------------------------------------------------- */

function StandardCard({
  variation,
  ribbon,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  renderableImg,
}: {
  variation: Variation;
  ribbon: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  renderableImg: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPoster = variation === 'poster';
  const cardCls = [
    styles.card,
    expanded && isPoster ? styles.cardExpanded : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardCls}>
      <div className={styles.ribbonRow}>
        <span className={styles.ribbon}>{ribbon}</span>
      </div>

      <button
        type="button"
        className={styles.hero}
        onClick={() => {
          if (isPoster) setExpanded((e) => !e);
        }}
        aria-label={isPoster ? (expanded ? 'Collapse poster' : 'Expand poster') : 'Hero image'}
        tabIndex={isPoster ? 0 : -1}
      >
        {renderableImg ? (
          <img className={styles.heroImg} src={renderableImg} alt="" />
        ) : (
          <div className={styles.heroPlaceholder}>{variation.toUpperCase()}</div>
        )}
        {variation === 'video' ? <PlayOverlay /> : null}
        {expanded && isPoster ? (
          <span className={styles.navigatePill}>NAVIGATE</span>
        ) : null}
      </button>

      {!expanded ? (
        <div className={styles.body}>
          {title ? <div className={styles.title}>{title}</div> : null}
          {description ? <div className={styles.desc}>{description}</div> : null}
          {secondaryLabel ? (
            <button type="button" className={styles.secondaryLink}>
              {secondaryLabel}
              <Chevron />
            </button>
          ) : null}
          <button type="button" className={styles.primaryBtn}>
            {primaryLabel}
          </button>
        </div>
      ) : (
        <div className={styles.bodyExpanded}>
          <button type="button" className={styles.primaryBtn}>
            {primaryLabel}
          </button>
        </div>
      )}
    </div>
  );
}

function PlayOverlay() {
  return (
    <span className={styles.playOverlay} aria-hidden>
      <span className={styles.playCircle}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#0F172A" aria-hidden>
          <polygon points="8,5 19,12 8,19" />
        </svg>
      </span>
    </span>
  );
}

function Chevron() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginLeft: 6 }}
      aria-hidden
    >
      <path d="M5 3l5 5-5 5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Quiz card                                                                  */
/* -------------------------------------------------------------------------- */

function QuizCard({
  card,
  ribbon,
  primaryLabel,
  renderableImg,
}: {
  card: Record<string, unknown>;
  ribbon: string;
  primaryLabel: string;
  renderableImg: string;
}) {
  const question = asString(card.quiz_question).trim() || 'Can you guess the above pose?';
  const rawOptions = asArray<unknown>(card.quiz_options)
    .map((o) => asString(o).trim())
    .filter((o) => !!o);
  const options = rawOptions.length > 0
    ? rawOptions.slice(0, 4)
    : ['Adhomukha Svanasana', 'Eka Pada Rajakapotasana', 'Sukhasana'];
  const correctLetter = (asString(card.quiz_correct).trim() || 'A').toUpperCase();
  const correctIdx = Math.max(0, Math.min(options.length - 1, correctLetter.charCodeAt(0) - 65));
  const noImage = card.quiz_no_image === true;
  const showCompleted = card.quiz_show_completed_state === true;
  const showWrong = card.quiz_show_wrong_state === true;

  // Preview-state toggles take priority over the interactive machine.
  if (showCompleted) {
    return (
      <QuizCompletedCard
        ribbon={ribbon}
        options={options}
        correctIdx={correctIdx}
        renderableImg={renderableImg}
        noImage={noImage}
        primaryLabel={primaryLabel}
      />
    );
  }
  if (showWrong) {
    return (
      <QuizWrongCard
        ribbon={ribbon}
        options={options}
        correctIdx={correctIdx}
        renderableImg={renderableImg}
        noImage={noImage}
        primaryLabel={primaryLabel}
      />
    );
  }

  return (
    <QuizInteractive
      ribbon={ribbon}
      question={question}
      options={options}
      correctIdx={correctIdx}
      renderableImg={renderableImg}
      noImage={noImage}
      primaryLabel={primaryLabel}
    />
  );
}

function QuizInteractive({
  ribbon,
  question,
  options,
  correctIdx,
  renderableImg,
  noImage,
  primaryLabel,
}: {
  ribbon: string;
  question: string;
  options: string[];
  correctIdx: number;
  renderableImg: string;
  noImage: boolean;
  primaryLabel: string;
}) {
  const [state, setState] = useState<QuizState>({
    phase: 'initial',
    pickedIdx: null,
    hintWrongIdx: null,
  });
  const [showShareCta, setShowShareCta] = useState(false);

  // Reset interactive state whenever the inputs that drive it change.
  const resetKey = useMemo(
    () => `${question}::${options.join('|')}::${correctIdx}`,
    [question, options, correctIdx],
  );
  const lastKeyRef = useRef(resetKey);
  useEffect(() => {
    if (lastKeyRef.current !== resetKey) {
      lastKeyRef.current = resetKey;
      setState({ phase: 'initial', pickedIdx: null, hintWrongIdx: null });
      setShowShareCta(false);
    }
  }, [resetKey]);

  // Quiz state transitions:
  //   correct pick -> flash green -> after 600ms, swap to "correct" view -> after 4s show share CTA.
  //   wrong pick   -> red X stays; user can try again.
  //   hint click   -> mark a non-correct option with red X + "Answer is not X" label.
  useEffect(() => {
    if (state.phase !== 'correct') return;
    const t = setTimeout(() => {
      setState((s) => (s.phase === 'correct' ? { ...s, phase: 'correctRevealed' } : s));
    }, 600);
    return () => clearTimeout(t);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== 'correctRevealed') return;
    const t = setTimeout(() => setShowShareCta(true), 4000);
    return () => clearTimeout(t);
  }, [state.phase]);

  const handlePick = (idx: number) => {
    if (state.phase === 'correctRevealed' || state.phase === 'correct') return;
    if (idx === correctIdx) {
      setState({ phase: 'correct', pickedIdx: idx, hintWrongIdx: state.hintWrongIdx });
    } else {
      setState((s) => ({ phase: 'wrong', pickedIdx: idx, hintWrongIdx: s.hintWrongIdx }));
    }
  };

  const handleHint = () => {
    if (state.phase !== 'initial' && state.phase !== 'wrong') return;
    // Pick the last non-correct option as the deterministic hint target.
    let target: number | null = null;
    for (let i = options.length - 1; i >= 0; i -= 1) {
      if (i !== correctIdx) {
        target = i;
        break;
      }
    }
    if (target === null) return;
    setState((s) => ({ ...s, hintWrongIdx: target, phase: 'hint' }));
  };

  const isRevealed = state.phase === 'correct' || state.phase === 'correctRevealed';
  const headerText = isRevealed ? 'Correct Answer! You are amazing.' : question;

  return (
    <QuizShell renderableImg={renderableImg} noImage={noImage} ribbon={ribbon}>
      <div className={styles.quizQuestion}>{headerText}</div>
      <div className={styles.quizOptions}>
        {options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isCorrect = idx === correctIdx;
          const isPicked = state.pickedIdx === idx;
          const isHintWrong = state.hintWrongIdx === idx;

          let cls = styles.quizOpt;
          let trailing: React.ReactNode = null;

          if (isRevealed) {
            if (isCorrect) {
              cls = `${styles.quizOpt} ${styles.quizOptCorrect}`;
              trailing = <CheckIcon />;
            } else {
              cls = `${styles.quizOpt} ${styles.quizOptMuted}`;
            }
          } else if (state.phase === 'wrong' && isPicked) {
            cls = `${styles.quizOpt} ${styles.quizOptWrong}`;
            trailing = <CrossIcon />;
          } else if (state.phase === 'hint' && isHintWrong) {
            cls = `${styles.quizOpt} ${styles.quizOptWrong}`;
            trailing = (
              <span className={styles.hintTag}>Answer is not {letter}</span>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              className={cls}
              onClick={() => handlePick(idx)}
              disabled={isRevealed}
            >
              <span className={styles.optLetter}>{letter}</span>
              <span className={styles.optLabel}>{opt}</span>
              {trailing ? <span className={styles.optTrailing}>{trailing}</span> : null}
            </button>
          );
        })}
      </div>

      {!isRevealed && state.phase !== 'hint' ? (
        <button type="button" className={styles.hintLink} onClick={handleHint}>
          Get Hint
          <Chevron />
        </button>
      ) : null}

      {isRevealed && showShareCta ? (
        <button type="button" className={`${styles.primaryBtn} ${styles.quizPrimaryBtn}`}>
          {primaryLabel}
        </button>
      ) : null}
    </QuizShell>
  );
}

function QuizCompletedCard({
  ribbon,
  options,
  correctIdx,
  renderableImg,
  noImage,
  primaryLabel,
}: {
  ribbon: string;
  options: string[];
  correctIdx: number;
  renderableImg: string;
  noImage: boolean;
  primaryLabel: string;
}) {
  return (
    <QuizShell renderableImg={renderableImg} noImage={noImage} ribbon={ribbon}>
      <div className={styles.quizQuestion}>You Completed Today's Quiz</div>
      <div className={styles.quizOptions}>
        {options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isCorrect = idx === correctIdx;
          const cls = isCorrect
            ? `${styles.quizOpt} ${styles.quizOptCorrect}`
            : `${styles.quizOpt} ${styles.quizOptMuted}`;
          return (
            <div key={idx} className={cls}>
              <span className={styles.optLetter}>{letter}</span>
              <span className={styles.optLabel}>{opt}</span>
              {isCorrect ? (
                <span className={styles.optTrailing}>
                  <span className={styles.correctTag}>Correct</span>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <button type="button" className={`${styles.primaryBtn} ${styles.quizPrimaryBtn}`}>
        {primaryLabel}
      </button>
    </QuizShell>
  );
}

function QuizWrongCard({
  ribbon,
  options,
  correctIdx,
  renderableImg,
  noImage,
  primaryLabel,
}: {
  ribbon: string;
  options: string[];
  correctIdx: number;
  renderableImg: string;
  noImage: boolean;
  primaryLabel: string;
}) {
  // Pick a deterministic "user wrong pick" — last non-correct option.
  let wrongPick = -1;
  for (let i = options.length - 1; i >= 0; i -= 1) {
    if (i !== correctIdx) {
      wrongPick = i;
      break;
    }
  }
  const correctLetter = String.fromCharCode(65 + correctIdx);

  return (
    <QuizShell renderableImg={renderableImg} noImage={noImage} ribbon={ribbon}>
      <div className={styles.quizQuestion}>
        Oops. You missed it. Correct Answer is {correctLetter}.
      </div>
      <div className={styles.quizOptions}>
        {options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isCorrect = idx === correctIdx;
          const isWrongPick = idx === wrongPick;
          let cls = `${styles.quizOpt} ${styles.quizOptMuted}`;
          let trailing: React.ReactNode = null;
          if (isCorrect) {
            cls = `${styles.quizOpt} ${styles.quizOptCorrect}`;
            trailing = <CheckIcon />;
          } else if (isWrongPick) {
            cls = `${styles.quizOpt} ${styles.quizOptMutedWrong}`;
            trailing = <CrossIcon />;
          }
          return (
            <div key={idx} className={cls}>
              <span className={styles.optLetter}>{letter}</span>
              <span className={styles.optLabel}>{opt}</span>
              {trailing ? <span className={styles.optTrailing}>{trailing}</span> : null}
            </div>
          );
        })}
      </div>
      <button type="button" className={`${styles.primaryBtn} ${styles.quizPrimaryBtn}`}>
        {primaryLabel}
      </button>
    </QuizShell>
  );
}

function QuizShell({
  renderableImg,
  noImage,
  ribbon,
  children,
}: {
  renderableImg: string;
  noImage: boolean;
  ribbon: string;
  children: React.ReactNode;
}) {
  const showImage = !noImage;
  const cls = [
    styles.card,
    styles.quizCard,
    noImage ? styles.quizCardNoImage : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {showImage ? (
        <div className={styles.quizHero}>
          {renderableImg ? (
            <img className={styles.heroImg} src={renderableImg} alt="" />
          ) : (
            <div className={styles.heroPlaceholder}>QUIZ</div>
          )}
          <div className={styles.quizHeroRibbon}>
            <span className={styles.ribbon}>{ribbon}</span>
          </div>
        </div>
      ) : (
        <div className={styles.ribbonRow}>
          <span className={styles.ribbon}>{ribbon}</span>
        </div>
      )}
      <div className={`${styles.quizBody} ${noImage ? styles.quizBodyNoImage : ''}`}>{children}</div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 8.5l3.2 3.2L13 5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
