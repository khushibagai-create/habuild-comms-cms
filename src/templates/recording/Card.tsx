import type { CardProps } from '../types';
import {
  CardFooter,
  CardInner,
  ExpertRow,
  FocusBlock,
  ScrollShell,
  asArray,
  asString,
  cardStyles,
} from '../shared/cardParts';
import styles from './Card.module.css';

/* Mirrors renderRecoveryCard in 10-comms-cms.html. */

export function RecordingCard({ card }: CardProps) {
  const expiryRaw = card.expiry_hours;
  const expiryNum =
    typeof expiryRaw === 'number'
      ? expiryRaw
      : typeof expiryRaw === 'string' && expiryRaw.trim() !== ''
        ? parseInt(expiryRaw, 10)
        : NaN;
  const hasExpiry = !isNaN(expiryNum) && expiryNum > 0;
  const expiryPillText = hasExpiry ? `${expiryNum}h` : '';

  const cover = asString(card.video_thumbnail).trim();
  const badge = asString(card.badge_text);
  const heading = asString(card.heading).trim();
  const subheading = asString(card.subheading).trim();
  const disclaimer = asString(card.disclaimer).trim();
  const focusBullets = asArray<string>(card.focus_bullets);
  const expertName = asString(card.expert_name);
  const primary = asString(card.primary_cta_text) || 'Watch recording';
  const secondary = asString(card.secondary_cta_text).trim();

  return (
    <>
      <ScrollShell>
        <CardInner>
          <div className={styles.videoThumb}>
            {cover ? <img className={styles.cover} src={cover} alt="" /> : null}
            {badge ? <div className={styles.badge}>{badge}</div> : null}
            {expiryPillText ? (
              <div className={styles.expiryPill}>{expiryPillText}</div>
            ) : null}
            <div className={styles.playBtn}>
              <svg viewBox="0 0 24 24" fill="#0F172A" aria-hidden>
                <path d="M7 4l14 8-14 8z" />
              </svg>
            </div>
          </div>
          <ExpertRow name={expertName} />
          {heading ? (
            <div className={`${cardStyles.title} ${styles.headingTop}`}>{heading}</div>
          ) : null}
          {subheading ? <div className={cardStyles.sub}>{subheading}</div> : null}
          <FocusBlock title={asString(card.focus_title)} bullets={focusBullets} />
          {disclaimer ? <div className={styles.disclaimer}>{disclaimer}</div> : null}
        </CardInner>
      </ScrollShell>
      <CardFooter primary={primary} secondary={secondary} />
    </>
  );
}
