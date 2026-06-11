import type { CardProps } from '../types';
import { asString, asArray, isImageSource } from '../shared/cardParts';
import styles from './Card.module.css';

/* Mirrors renderTodayPreview in 10-comms-cms.html.
   Single-card poster template with four variations: poster, quiz, video, pdf.
   The CMS preview shows a dark-backdrop story with a white poster card. CTA
   colors are locked at #0C4A6E.

   This card renders the full poster experience (heading + subheading text
   block, poster image, variation overlays, footer with Watch/Download/Share
   primary). The parent CardStack already wraps the standard story header,
   so the visual difference vs. the source HTML is that on Today the parent
   wrapper renders a duplicate story header on top — Khushi will iterate on
   that shell behavior separately if needed. */

type Variation = 'poster' | 'quiz' | 'video' | 'pdf';

function readVariation(card: Record<string, unknown>, fallback?: string): Variation {
  const raw = asString(card.variation) || asString(fallback);
  if (raw === 'quiz' || raw === 'video' || raw === 'pdf') return raw;
  return 'poster';
}

export function TodayCard({ card, variation }: CardProps) {
  const v = readVariation(card, variation);
  const heading = asString(card.heading).trim();
  const subheading = asString(card.subheading).trim();
  const posterImage = asString(card.poster_image).trim();
  const hasImg = !!posterImage;
  // Only render images we can resolve. Bare filenames (legacy gallery refs)
  // fall back to the gradient placeholder.
  const renderableImg = hasImg && isImageSource(posterImage) ? posterImage : '';

  const posterClass = [
    styles.poster,
    hasImg ? styles.posterHasImg : '',
    v === 'video' ? styles.posterVideo : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.story}>
      {(heading || subheading) ? (
        <div className={styles.textBlock}>
          {heading ? <div className={styles.heading}>{heading}</div> : null}
          {subheading ? <div className={styles.sub}>{subheading}</div> : null}
        </div>
      ) : null}

      <div className={styles.card}>
        <div className={posterClass}>
          {renderableImg ? (
            <img className={styles.posterImg} src={renderableImg} alt="" />
          ) : (
            <div className={styles.posterPlaceholder}>POSTER</div>
          )}
          {v === 'video' ? <VideoOverlay durationText={asString(card.video_duration).trim()} /> : null}
          {v === 'pdf' ? <PdfBadge pages={asString(card.pdf_pages).trim()} /> : null}
        </div>

        {v === 'video' && asString(card.video_credit).trim() ? (
          <div className={styles.videoCredit}>
            {asString(card.video_credit).trim()}
          </div>
        ) : null}

        {v === 'quiz' ? (
          <QuizBlock
            question={asString(card.quiz_question).trim() || subheading}
            options={asArray<string>(card.quiz_options)
              .slice(0, 4)
              .map((o) => asString(o).trim())
              .filter((o) => !!o)}
          />
        ) : null}

        <Footer variation={v} card={card} />
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.dotActive}`} />
        </div>
      </div>
    </div>
  );
}

function VideoOverlay({ durationText }: { durationText: string }) {
  return (
    <>
      <div className={styles.playOverlay}>
        <div className={styles.playCircle}>
          <svg viewBox="0 0 24 24" fill="#0F172A" aria-hidden>
            <polygon points="8,5 19,12 8,19" />
          </svg>
        </div>
      </div>
      {durationText ? (
        <div className={styles.videoDurationPill}>{durationText}</div>
      ) : null}
    </>
  );
}

function PdfBadge({ pages }: { pages: string }) {
  return (
    <div className={styles.pdfBadge}>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 2h5l3 3v9H4z" />
        <path d="M9 2v3h3" />
      </svg>
      <span>{pages ? `PDF · ${pages}` : 'PDF'}</span>
    </div>
  );
}

function QuizBlock({
  question,
  options,
}: {
  question: string;
  options: string[];
}) {
  if (!question && options.length === 0) return null;
  return (
    <div className={styles.quizBlock}>
      {question ? <div className={styles.quizQuestion}>{question}</div> : null}
      {options.length > 0 ? (
        <div className={styles.quizOptions}>
          {options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
              <div className={styles.quizOpt} key={i}>
                <span className={styles.optLetter}>{letter}</span>
                {opt}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Footer({
  variation,
  card,
}: {
  variation: Variation;
  card: Record<string, unknown>;
}) {
  // Primary button: Share for poster + quiz, Watch for video, Download for PDF.
  // Secondary button label varies by variation. PDF always shows Share PDF.
  let primary;
  if (variation === 'video') {
    primary = (
      <button type="button" className={`${styles.shareBtn} ${styles.shareBtnWatch}`}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <polygon points="4,3 13,8 4,13" />
        </svg>
        Watch
      </button>
    );
  } else if (variation === 'pdf') {
    const pdfPrimaryLabel = asString(card.cta) || 'Download PDF';
    primary = (
      <button type="button" className={`${styles.shareBtn} ${styles.shareBtnDownload}`}>
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M8 2v8M4 8l4 4 4-4M3 14h10" />
        </svg>
        {pdfPrimaryLabel}
      </button>
    );
  } else {
    primary = (
      <button type="button" className={styles.shareBtn}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M11 2l3 3-3 3M14 5H7a4 4 0 0 0-4 4v3" />
        </svg>
        Share
      </button>
    );
  }

  const rawSecondary =
    variation === 'pdf'
      ? asString(card.secondaryCta) || 'Share PDF'
      : asString(card.secondary_cta_text).trim();

  return (
    <div className={styles.foot}>
      {primary}
      {rawSecondary ? (
        <button type="button" className={styles.secondaryBtn}>
          {rawSecondary}
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
        </button>
      ) : null}
    </div>
  );
}
