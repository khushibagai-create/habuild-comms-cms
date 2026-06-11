import type { CardProps } from '../types';
import {
  CardInner,
  InfoPill,
  ScrollShell,
  asArray,
  asString,
  cardStyles,
} from '../shared/cardParts';
import styles from './Card.module.css';

/* Mirrors renderMonthlyCalendarCard in 10-comms-cms.html.
   Single card. Header (info pill + title + subtitle) + stack of event cards.
   No bottom CTA. Each event = info pill overlay + date column (single day or
   range) + divider + title + sub. All themed via palette CSS vars. */

type EventRow = {
  info_pill?: unknown;
  date_start?: unknown;
  date_end?: unknown;
  month_label?: unknown;
  title?: unknown;
  sub?: unknown;
};

export function MonthlyCalendarCard({ card }: CardProps) {
  const infoPill = asString(card.info_pill);
  const title = asString(card.title).trim();
  const subtitle = asString(card.subtitle).trim();
  const events = asArray<EventRow>(card.events);

  return (
    <ScrollShell>
      <CardInner>
        <InfoPill text={infoPill} />
        {title ? <div className={cardStyles.title}>{title}</div> : null}
        {subtitle ? <div className={cardStyles.sub}>{subtitle}</div> : null}
        {events.length > 0 ? (
          <div className={styles.list}>
            {events.map((ev, i) => {
              const dStart = asString(ev.date_start).trim();
              const dEnd = asString(ev.date_end).trim();
              const hasDate = !!(dStart || dEnd);
              const dayText = dEnd ? `${dStart}-${dEnd}` : dStart;
              const month = asString(ev.month_label).trim();
              const pill = asString(ev.info_pill).trim();
              const evTitle = asString(ev.title).trim();
              const evSub = asString(ev.sub).trim();

              return (
                <div className={styles.card} key={i}>
                  {pill ? <div className={styles.pill}>{pill}</div> : null}
                  <div className={styles.row}>
                    <div className={styles.date}>
                      {hasDate ? (
                        <div className={styles.day}>{dayText}</div>
                      ) : null}
                      {month ? <div className={styles.month}>{month}</div> : null}
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.content}>
                      {evTitle ? (
                        <div className={styles.eventTitle}>{evTitle}</div>
                      ) : null}
                      {evSub ? (
                        <div className={styles.eventSub}>{evSub}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </CardInner>
    </ScrollShell>
  );
}
