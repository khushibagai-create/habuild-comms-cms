import type { CardProps } from '../types';
import {
  CardFooter,
  CardInner,
  HeroImage,
  InfoPill,
  ScrollShell,
  Timeline,
  asArray,
  asString,
  cardStyles,
} from '../shared/cardParts';
import styles from './Card.module.css';

/* Mirrors renderToolsCard in 10-comms-cms.html.
   Card 1 = Banner strip (palette gradient) + hero image + heading +
     subheading + stats strip + primary CTA + optional secondary link.
   Card 2 = Info pill + heading + subheading + numbered timeline
     (rich bullets) + primary CTA. */

export function ToolsCard({ card, cardIndex }: CardProps) {
  if (cardIndex === 0) return <Story1 card={card} />;
  return <Story2 card={card} />;
}

function Story1({ card }: { card: Record<string, unknown> }) {
  const bannerLabel = asString(card.banner_text).trim().toUpperCase();
  const heroImage = asString(card.hero_image);
  const hasHero = !!heroImage;
  const title = asString(card.title).trim();
  const subtitle = asString(card.subtitle).trim();
  const stats = asArray<Record<string, unknown>>(card.stats).filter((s) => {
    const label = asString(s.label).trim();
    const value = asString(s.value).trim();
    return label || value;
  });
  const primary =
    asString(card.primary_cta_text) || 'Try Create Everyday';
  const secondaryLink = asString(card.secondary_link_text).trim();

  return (
    <>
      <ScrollShell withGradient={!hasHero}>
        {bannerLabel ? (
          <div className={styles.banner}>
            <div className={styles.bannerIcon}>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M11 2.5a2.5 2.5 0 0 1 2.5 2.5c0 .6-.2 1.1-.5 1.5l-7 7-2.5.5.5-2.5 7-7c.4-.3.9-.5 1.5-.5z" />
              </svg>
            </div>
            <div className={styles.bannerText}>{bannerLabel}</div>
          </div>
        ) : null}
        {hasHero ? <HeroImage src={heroImage} top /> : null}
        <CardInner>
          {title ? <div className={cardStyles.title}>{title}</div> : null}
          {subtitle ? <div className={cardStyles.sub}>{subtitle}</div> : null}
          {stats.length > 0 ? (
            <div className={cardStyles.metaRow}>
              {stats.map((s, i) => (
                <div className={cardStyles.metaCell} key={i}>
                  <div className={cardStyles.metaVal}>
                    {asString(s.value).trim()}
                  </div>
                  <div className={cardStyles.metaLbl}>
                    {asString(s.label).trim()}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </CardInner>
      </ScrollShell>
      <CardFooter primary={primary} secondary={secondaryLink} />
    </>
  );
}

function Story2({ card }: { card: Record<string, unknown> }) {
  const infoPill = asString(card.info_pill);
  const title = asString(card.title).trim();
  const subtitle = asString(card.subtitle).trim();
  const rich = asArray<Record<string, unknown>>(card.rich_bullets);
  const rows = rich.map((b) => ({
    title: asString(b.heading),
    sub: asString(b.subheading),
  }));
  const primary =
    asString(card.primary_cta_text) || 'Try Create Everyday';

  return (
    <>
      <ScrollShell>
        <CardInner>
          <InfoPill text={infoPill} />
          {title ? <div className={cardStyles.title}>{title}</div> : null}
          {subtitle ? <div className={cardStyles.sub}>{subtitle}</div> : null}
          <Timeline rows={rows} />
        </CardInner>
      </ScrollShell>
      <CardFooter primary={primary} />
    </>
  );
}
