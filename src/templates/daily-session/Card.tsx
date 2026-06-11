import type { CardProps } from '../types';
import {
  CardFooter,
  CardInner,
  ExpertRow,
  FocusBlock,
  HeroImage,
  InfoPill,
  MetaRow3,
  ScrollShell,
  Timeline,
  asArray,
  asString,
  cardStyles,
} from '../shared/cardParts';

/* Mirrors renderDailyUpdateCard in 10-comms-cms.html.
   Story 1 = Today's session hero (badge + title + expert + stats + focus + CTAs).
   Story 2 = Deeper context (heading + subheading + rich bullets numbered timeline). */

export function DailySessionCard({ card, cardIndex }: CardProps) {
  if (cardIndex === 0) return <Story1 card={card} />;
  return <Story2 card={card} />;
}

function Story1({ card }: { card: Record<string, unknown> }) {
  const heroImage = asString(card.hero_image);
  const hasHero = !!heroImage;
  const infoPill = asString(card.info_pill);
  const title = asString(card.title).trim();
  const subtitle = asString(card.subtitle).trim();
  const focusBullets = asArray<string>(card.focus_bullets);

  return (
    <>
      <ScrollShell withGradient={!hasHero}>
        {hasHero ? (
          <div className={cardStyles.imageWrap}>
            <HeroImage src={heroImage} top />
            <InfoPill text={infoPill} />
          </div>
        ) : null}
        <CardInner>
          {!hasHero ? <InfoPill text={infoPill} /> : null}
          <ExpertRow name={asString(card.expert_name)} />
          {title ? <div className={cardStyles.title}>{title}</div> : null}
          {subtitle ? <div className={cardStyles.sub}>{subtitle}</div> : null}
          <MetaRow3
            time={asString(card.stat_time)}
            duration={asString(card.stat_duration)}
            program={asString(card.stat_program)}
          />
          <FocusBlock title={asString(card.focus_title)} bullets={focusBullets} />
        </CardInner>
      </ScrollShell>
      <CardFooter
        primary={asString(card.primary_cta_text) || 'Join live session'}
        secondary={asString(card.secondary_cta_text)}
      />
    </>
  );
}

function Story2({ card }: { card: Record<string, unknown> }) {
  const rich = asArray<Record<string, unknown>>(card.rich_bullets);
  const rows = rich.map((b) => ({
    title: asString(b.heading),
    sub: asString(b.subheading),
  }));
  const heading = asString(card.heading).trim();
  const subheading = asString(card.subheading).trim();

  return (
    <>
      <ScrollShell>
        <CardInner>
          {heading ? <div className={cardStyles.title}>{heading}</div> : null}
          {subheading ? <div className={cardStyles.sub}>{subheading}</div> : null}
          <Timeline rows={rows} />
        </CardInner>
      </ScrollShell>
      <CardFooter primary={asString(card.primary_cta_text) || 'Join live session'} />
    </>
  );
}
