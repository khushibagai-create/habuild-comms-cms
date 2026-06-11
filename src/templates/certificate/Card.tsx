import type { CardProps } from '../types';
import {
  CardFooter,
  ScrollShell,
  asString,
  isImageSource,
} from '../shared/cardParts';
import styles from './Card.module.css';

/* Mirrors renderCertificateCard in 10-comms-cms.html.
   Layout: hero image -> body { pill (top-left float) -> heading -> sub ->
   inline download link } -> footer with primary CTA. */

export function CertificateCard({ card, variation }: CardProps) {
  const v = (variation || asString(card.variation) || 'certificate') as
    | 'certificate'
    | 'resource';
  const isCert = v === 'certificate';

  const img = asString(card.certificate_image);
  const pillLabel = asString(card.pill_text).trim();
  const heading = asString(card.heading).trim();
  const sub = asString(card.subheading).trim();
  const downloadText =
    asString(card.download_text) || (isCert ? 'Download certificate' : 'Download booklet');
  const primaryLabel =
    asString(card.primary_cta_text) || (isCert ? 'Share My Certificate' : 'Share booklet');

  const hasImage = img && isImageSource(img);

  return (
    <>
      <ScrollShell withGradient={false}>
        {hasImage ? (
          <div className={styles.img}>
            <img src={img} alt="" />
          </div>
        ) : (
          <div className={`${styles.img} ${styles.imgEmpty}`}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="4" width="18" height="14" rx="1.5" />
              <circle cx="12" cy="10.5" r="2.2" />
              <path d="M9.5 13.5l-1.5 4 4-2 4 2-1.5-4" />
            </svg>
            <div className={styles.imgEmptyTxt}>
              {isCert ? 'Upload a certificate' : 'Upload a cover'}
            </div>
          </div>
        )}
        <div className={styles.body}>
          {pillLabel ? <div className={styles.pill}>{pillLabel}</div> : null}
          {heading ? <div className={styles.heading}>{heading}</div> : null}
          {sub ? <div className={styles.subheading}>{sub}</div> : null}
          <a
            className={styles.downloadLink}
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            {downloadText} <span className={styles.downloadChev}>&rsaquo;</span>
          </a>
        </div>
      </ScrollShell>
      <CardFooter primary={primaryLabel} />
    </>
  );
}
