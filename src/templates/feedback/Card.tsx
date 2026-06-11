import type { CardProps } from '../types';
import {
  CardFooter,
  CardInner,
  InfoPill,
  ScrollShell,
  asArray,
  asString,
  cardStyles,
} from '../shared/cardParts';
import styles from './Card.module.css';

/* Mirrors renderFeedbackCard in 10-comms-cms.html.
   Single card. Header (info pill + heading + subheading) + inline question
   stack. Each question = bold text + pill row (single/multi-select) or short
   textarea (text). Preview shows the first option of single-select and first
   two of multi-select as selected so comms can see the picked state.
   Optional Chat link sits above the Submit CTA. */

export type QuestionType = 'single-select' | 'multi-select' | 'text';

export type FeedbackQuestion = {
  text: string;
  type: QuestionType;
  options: string[];
};

export function FeedbackCard({ card }: CardProps) {
  const infoPill = asString(card.info_pill);
  const title = asString(card.title).trim() || 'Your feedback shapes the session';
  const subtitle = asString(card.subtitle).trim();
  const questionsRaw = asArray<Record<string, unknown>>(card.questions);
  const questions: FeedbackQuestion[] = questionsRaw.map((q) => {
    const rawType = asString(q.type);
    const type: QuestionType =
      rawType === 'multi-select' || rawType === 'text'
        ? rawType
        : 'single-select';
    return {
      text: asString(q.text),
      type,
      options: asArray<string>(q.options).map((o) => asString(o)),
    };
  });

  const showChatLink = card.show_chat_link === true;
  const chatLinkText = asString(card.chat_link_text) || 'Chat with Us';
  const primary = asString(card.primary_cta_text) || 'Submit Feedback';

  return (
    <>
      <ScrollShell>
        <CardInner>
          <InfoPill text={infoPill} />
          <div className={styles.heading}>{title}</div>
          {subtitle ? <div className={cardStyles.sub}>{subtitle}</div> : null}
          {questions.map((q, i) => (
            <QuestionPreview question={q} key={i} />
          ))}
          {showChatLink ? (
            <a
              className={styles.chatLink}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              {chatLinkText}
            </a>
          ) : null}
        </CardInner>
      </ScrollShell>
      <CardFooter primary={primary} />
    </>
  );
}

function QuestionPreview({ question }: { question: FeedbackQuestion }) {
  const text = question.text.trim();
  if (question.type === 'text') {
    return (
      <div className={styles.q}>
        {text ? <div className={styles.qText}>{text}</div> : null}
        <textarea
          className={styles.qTextInput}
          placeholder="Your answer..."
          readOnly
        />
      </div>
    );
  }

  const selectedCount = question.type === 'multi-select' ? 2 : 1;
  return (
    <div className={styles.q}>
      {text ? <div className={styles.qText}>{text}</div> : null}
      <div className={styles.qOptions}>
        {question.options.map((opt, oIdx) => {
          const isSelected = oIdx < selectedCount;
          return (
            <button
              key={oIdx}
              type="button"
              className={`${styles.qPill} ${isSelected ? styles.qPillSelected : ''}`}
              tabIndex={-1}
            >
              {opt || ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
