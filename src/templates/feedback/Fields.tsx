import { TextField } from '../../components/fields/TextField';
import type { FieldsProps } from '../types';
import { asArray, asString } from '../shared/cardParts';
import groupStyles from '../shared/groupStyles.module.css';
import { QuestionsField } from './QuestionsField';
import type { FeedbackQuestion, QuestionType } from './Card';

/* Feedback form fields. Mirrors buildFeedbackFields in 10-comms-cms.html.
   Inline questions (single-select / multi-select / text), optional chat link,
   and a Submit CTA. */

export function FeedbackFields({ card, onPatch }: FieldsProps) {
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

  const showChat = card.show_chat_link === true;

  return (
    <>
      <Group title="Header" hint="Info pill, heading, subheading">
        <TextField
          label="Info pill text"
          value={asString(card.info_pill)}
          onChange={(v) => onPatch({ info_pill: v })}
          placeholder="PROGRAM NAME"
        />
        <TextField
          label="Heading"
          value={asString(card.title)}
          onChange={(v) => onPatch({ title: v })}
          placeholder="Your feedback shapes the session"
        />
        <TextField
          label="Subheading"
          value={asString(card.subtitle)}
          onChange={(v) => onPatch({ subtitle: v })}
          placeholder="Takes 10 seconds only."
        />
      </Group>

      <Group
        title="Questions"
        hint="Add questions inline. Each is single-select pills, multi-select pills, or a short text input."
      >
        <QuestionsField
          value={questions}
          onChange={(next) => onPatch({ questions: next })}
        />
      </Group>

      <Group
        title="Chat link"
        hint="Optional inline link above the Submit button"
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: 'var(--text-2)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showChat}
            onChange={(e) => onPatch({ show_chat_link: e.target.checked })}
          />
          Show "Chat with Us" link
        </label>
        <div className={groupStyles.cols2}>
          <TextField
            label="Link text"
            value={asString(card.chat_link_text)}
            onChange={(v) => onPatch({ chat_link_text: v })}
            placeholder="Chat with Us"
          />
          <TextField
            label="Link URL"
            value={asString(card.chat_link_url)}
            onChange={(v) => onPatch({ chat_link_url: v })}
            placeholder="me.habuild.in/chat"
          />
        </div>
      </Group>

      <Group
        title="Primary CTA"
        hint="Submit button + optional destination URL"
      >
        <div className={groupStyles.cols2}>
          <TextField
            label="Button text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder="Submit Feedback"
          />
          <TextField
            label="Form URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder="me.habuild.in/feedback/..."
          />
        </div>
      </Group>
    </>
  );
}

function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={groupStyles.group}>
      <div className={groupStyles.head}>
        <div className={groupStyles.title}>{title}</div>
        {hint ? <div className={groupStyles.hint}>{hint}</div> : null}
      </div>
      <div className={groupStyles.body}>{children}</div>
    </div>
  );
}
