import { TextField } from '../../components/fields/TextField';
import { SelectField } from '../../components/fields/SelectField';
import type { FeedbackQuestion, QuestionType } from './Card';
import styles from './QuestionsField.module.css';

/**
 * Editable list of feedback questions. Each question has:
 *   - text: question prompt
 *   - type: 'single-select' | 'multi-select' | 'text'
 *   - options: string[] (hidden for type='text', capped at 6)
 *
 * Mirrors the questions section of buildFeedbackFields in 10-comms-cms.html.
 * Lives inside the feedback template (not shared) per the Phase 4b spec.
 */

const TYPE_OPTIONS: ReadonlyArray<{ value: QuestionType; label: string }> = [
  { value: 'single-select', label: 'Single select' },
  { value: 'multi-select', label: 'Multi select' },
  { value: 'text', label: 'Text input' },
];

export type QuestionsFieldProps = {
  value: ReadonlyArray<FeedbackQuestion>;
  onChange: (next: FeedbackQuestion[]) => void;
};

export function QuestionsField({ value, onChange }: QuestionsFieldProps) {
  const questions = value.map((q) => ({ ...q, options: q.options.slice() }));

  const updateQuestion = (
    idx: number,
    patch: Partial<FeedbackQuestion>,
  ) => {
    const next = questions.map((q) => ({ ...q, options: q.options.slice() }));
    const existing = next[idx] ?? {
      text: '',
      type: 'single-select' as QuestionType,
      options: [],
    };
    next[idx] = { ...existing, ...patch };
    onChange(next);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    const next = questions.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  const addQuestion = () => {
    onChange([
      ...questions,
      {
        text: '',
        type: 'single-select',
        options: ['Same', 'Good', 'Better'],
      },
    ]);
  };

  const updateOption = (qIdx: number, oIdx: number, next: string) => {
    const q = questions[qIdx];
    if (!q) return;
    const opts = q.options.slice();
    opts[oIdx] = next;
    updateQuestion(qIdx, { options: opts });
  };

  const addOption = (qIdx: number) => {
    const q = questions[qIdx];
    if (!q) return;
    if (q.options.length >= 6) return;
    updateQuestion(qIdx, { options: [...q.options, ''] });
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const q = questions[qIdx];
    if (!q) return;
    if (q.options.length <= 1) return;
    const opts = q.options.slice();
    opts.splice(oIdx, 1);
    updateQuestion(qIdx, { options: opts });
  };

  return (
    <div className={styles.list}>
      {questions.map((q, idx) => (
        <div className={styles.item} key={idx}>
          <div className={styles.itemHead}>
            <div className={styles.num}>{idx + 1}</div>
            <div className={styles.itemTitle}>Question {idx + 1}</div>
            <div className={styles.spacer} />
            {questions.length > 1 ? (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeQuestion(idx)}
                aria-label={`Remove question ${idx + 1}`}
              >
                ×
              </button>
            ) : null}
          </div>
          <div className={styles.itemBody}>
            <TextField
              label="Question text"
              value={q.text}
              onChange={(v) => updateQuestion(idx, { text: v })}
              placeholder="e.g. How was the pace?"
            />
            <SelectField
              label="Question type"
              value={q.type}
              onChange={(v) =>
                updateQuestion(idx, { type: v as QuestionType })
              }
              options={TYPE_OPTIONS}
            />
            {q.type !== 'text' ? (
              <div className={styles.optionsBlock}>
                <div className={styles.optionsLabel}>Answer options</div>
                <div className={styles.optionsList}>
                  {q.options.map((opt, oIdx) => (
                    <div className={styles.optionRow} key={oIdx}>
                      <input
                        type="text"
                        className={styles.optionInput}
                        value={opt}
                        onChange={(e) =>
                          updateOption(idx, oIdx, e.target.value)
                        }
                        placeholder={`Option ${oIdx + 1}`}
                      />
                      {q.options.length > 1 ? (
                        <button
                          type="button"
                          className={styles.removeOptBtn}
                          onClick={() => removeOption(idx, oIdx)}
                          aria-label={`Remove option ${oIdx + 1}`}
                        >
                          ×
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
                {q.options.length < 6 ? (
                  <button
                    type="button"
                    className={styles.addOptBtn}
                    onClick={() => addOption(idx)}
                  >
                    + Add option
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ))}
      <button type="button" className={styles.addBtn} onClick={addQuestion}>
        + Add question
      </button>
    </div>
  );
}
