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

/* Mirrors renderEnrollCampHero / renderEnrollCampCard (Story 2) /
   renderEnrollCampMoreDetails in 10-comms-cms.html. */

export function EnrollCampCard({ card, cardIndex, variation }: CardProps) {
  const kind = asString(card.kind);
  if (kind === 'more-details') return <MoreDetailsCard card={card} />;

  const v = variation || asString(card.variation) || 'single';
  // Single, and Multi-day Story 1, render the same Hero card.
  if (v === 'single') return <HeroCard card={card} variation="single" />;
  if (v === 'multi' && cardIndex === 0) return <HeroCard card={card} variation="multi" />;

  // Multi-day Story 2 — numbered day timeline only.
  return <TimelineCard card={card} />;
}

/* ============================================================
   Hero — Single + Multi-day Story 1.
   ============================================================ */
function HeroCard({
  card,
  variation,
}: {
  card: Record<string, unknown>;
  variation: 'single' | 'multi';
}) {
  const heroImage = asString(card.hero_image);
  const hasHero = !!heroImage;
  const infoPill = asString(card.info_pill);
  const title = asString(card.title).trim();
  const subtitle = asString(card.subtitle).trim();
  const expertName = asString(card.expert_name);
  const eventDate = asString(card.event_date);

  let startsLine: string | null = null;
  if (eventDate) {
    try {
      const d = new Date(eventDate);
      if (!isNaN(d.getTime())) {
        startsLine = new Intl.DateTimeFormat('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }).format(d);
      }
    } catch {
      startsLine = null;
    }
  }

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
          <ExpertRow name={expertName} />
          {title ? <div className={cardStyles.title}>{title}</div> : null}
          {subtitle ? <div className={cardStyles.sub}>{subtitle}</div> : null}
          {startsLine ? (
            <div className={cardStyles.startsLine}>
              <span className={cardStyles.startsLabel}>Starts</span>
              {startsLine}
            </div>
          ) : null}
          <MetaRow3
            time={asString(card.stat_time)}
            duration={asString(card.stat_duration)}
            program={asString(card.stat_program)}
          />
          <FocusBlock title={asString(card.focus_title)} bullets={focusBullets} />
          {variation === 'multi' ? (
            <a
              className={cardStyles.seePlan}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              See full Plan ›
            </a>
          ) : null}
        </CardInner>
      </ScrollShell>
      <CardFooter
        primary={asString(card.primary_cta_text) || 'Enroll Now'}
        secondary={asString(card.secondary_cta_text)}
      />
    </>
  );
}

/* ============================================================
   Multi-day Story 2 — numbered day timeline only.
   ============================================================ */
function TimelineCard({ card }: { card: Record<string, unknown> }) {
  const rawRows = asArray<Record<string, unknown>>(card.timeline_rows);
  const rows = rawRows.map((r) => ({
    title: asString(r.title),
    sub: asString(r.time_more_info),
  }));
  const title = asString(card.title).trim();
  const subtitle = asString(card.subtitle).trim();

  return (
    <>
      <ScrollShell>
        <CardInner>
          <InfoPill text={asString(card.info_pill)} />
          {title ? <div className={cardStyles.title}>{title}</div> : null}
          {subtitle ? <div className={cardStyles.sub}>{subtitle}</div> : null}
          <Timeline rows={rows} />
        </CardInner>
      </ScrollShell>
      <CardFooter primary={asString(card.primary_cta_text) || 'Enroll Now'} />
    </>
  );
}

/* ============================================================
   More details card — same numbered timeline pattern.
   ============================================================ */
function MoreDetailsCard({ card }: { card: Record<string, unknown> }) {
  const rawRows = asArray<Record<string, unknown>>(card.timeline_rows);
  const rows = rawRows.map((r) => ({
    title: asString(r.title),
    sub: asString(r.time_more_info),
  }));
  const title = asString(card.title).trim();
  const subtitle = asString(card.subtitle).trim();

  return (
    <>
      <ScrollShell>
        <CardInner>
          <InfoPill text={asString(card.info_pill)} />
          {title ? <div className={cardStyles.title}>{title}</div> : null}
          {subtitle ? <div className={cardStyles.sub}>{subtitle}</div> : null}
          <Timeline rows={rows} />
        </CardInner>
      </ScrollShell>
      <CardFooter primary={asString(card.primary_cta_text) || 'Enroll Now'} />
    </>
  );
}
