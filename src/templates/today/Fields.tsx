import { TextField } from '../../components/fields/TextField';
import { TextArea } from '../../components/fields/TextArea';
import { SelectField } from '../../components/fields/SelectField';
import { ImageUpload } from '../../components/fields/ImageUpload';
import type { FieldsProps } from '../types';
import { asArray, asNumber, asString } from '../shared/cardParts';
import groupStyles from '../shared/groupStyles.module.css';

/* Today form fields.
   Variation-aware: poster / quiz / video / pdf. Per the 2026-06 design,
   the title + description live on the card itself (not on a dark backdrop
   above it). Each variation exposes a ribbon override, title, description,
   image, primary CTA, and secondary CTA. Quiz also gets question, options,
   correct answer, hint, and 3 preview-state toggles. */

type Variation = 'poster' | 'quiz' | 'video' | 'pdf';

function readVariation(card: Record<string, unknown>, fallback?: string): Variation {
  const raw = asString(card.variation) || asString(fallback);
  if (raw === 'quiz' || raw === 'video' || raw === 'pdf') return raw;
  return 'poster';
}

function ribbonField(card: Record<string, unknown>, v: Variation) {
  if (v === 'poster') {
    return {
      label: 'Edition (in ribbon)',
      placeholder: '13TH EDITION',
      value: asString(card.poster_edition) || '13TH EDITION',
      hint: 'Shows in the ribbon as "Today\'s Poster · 13TH EDITION".',
      key: 'poster_edition' as const,
    };
  }
  if (v === 'pdf') {
    return {
      label: 'Ribbon label',
      placeholder: '12 Pages PDF',
      value: asString(card.pdf_pages) || '12 Pages PDF',
      hint: 'Shown in the top ribbon. Usually the page count.',
      key: 'pdf_pages' as const,
    };
  }
  if (v === 'video') {
    return {
      label: 'Theme tag (in ribbon)',
      placeholder: 'Meditation',
      value: asString(card.video_theme) || 'Meditation',
      hint: 'A short theme tag for the ribbon (Meditation, Pranayama, Recipes, etc).',
      key: 'video_theme' as const,
    };
  }
  return {
    label: 'Ribbon label',
    placeholder: "Today's Quiz",
    value: asString(card.quiz_ribbon) || "Today's Quiz",
    hint: 'Shown at the top of the quiz card.',
    key: 'quiz_ribbon' as const,
  };
}

export function TodayFields({ card, variation, onPatch }: FieldsProps) {
  const v = readVariation(card, variation);
  const ribbon = ribbonField(card, v);

  return (
    <>
      <Group title="Ribbon" hint="The small colored pill at the top of the card.">
        <TextField
          label={ribbon.label}
          value={ribbon.value}
          onChange={(next) => onPatch({ [ribbon.key]: next })}
          placeholder={ribbon.placeholder}
          helperText={ribbon.hint}
        />
      </Group>

      <Group title="Title and description" hint="Shown on the card, below the image.">
        <TextField
          label="Title"
          value={asString(card.title)}
          onChange={(next) => onPatch({ title: next })}
          placeholder={defaultTitlePlaceholder(v)}
          helperText="Short title. Keep it under 60 characters."
        />
        <TextArea
          label="Description"
          value={asString(card.description)}
          onChange={(next) => onPatch({ description: next })}
          placeholder="1 to 2 line description."
          helperText="Members read this under the title. Keep it warm and concise."
          rows={2}
        />
      </Group>

      <Group title={imageLabel(v)} hint={imageHint(v)}>
        <ImageUpload
          label="Image"
          value={asString(card.poster_image) || null}
          metaName={asString(card.poster_image_name) || undefined}
          metaSize={asNumber(card.poster_image_size)}
          hint="Click to upload, drop a file, or paste a URL."
          onChange={(next, meta) => {
            if (next === null) {
              onPatch({
                poster_image: '',
                poster_image_name: '',
                poster_image_size: undefined,
              });
            } else {
              onPatch({
                poster_image: next,
                poster_image_name: meta?.name ?? '',
                poster_image_size: meta?.size,
              });
            }
          }}
        />
      </Group>

      {v === 'quiz' ? <QuizFields card={card} onPatch={onPatch} /> : null}
      {v === 'video' ? <VideoFields card={card} onPatch={onPatch} /> : null}

      <Group title="Primary CTA" hint="Full-width button at the bottom of the card.">
        <div className={groupStyles.cols2}>
          <TextField
            label="Button label"
            value={asString(card.cta) || defaultPrimary(v)}
            onChange={(next) => onPatch({ cta: next })}
            placeholder={defaultPrimary(v)}
          />
          <TextField
            label="URL or deep link"
            value={asString(card.primary_cta_url)}
            onChange={(next) => onPatch({ primary_cta_url: next })}
            placeholder={defaultPrimaryUrl(v)}
          />
        </div>
      </Group>

      {v !== 'quiz' ? (
        <Group title="Secondary CTA" hint="Small text link with chevron, above the primary button.">
          <div className={groupStyles.cols2}>
            <TextField
              label="Link label"
              value={asString(card.secondary_cta_text) || defaultSecondary(v)}
              onChange={(next) => onPatch({ secondary_cta_text: next })}
              placeholder={defaultSecondary(v)}
            />
            <TextField
              label="URL or deep link"
              value={asString(card.secondary_cta_url)}
              onChange={(next) => onPatch({ secondary_cta_url: next })}
              placeholder={defaultSecondaryUrl(v)}
            />
          </div>
        </Group>
      ) : null}
    </>
  );
}

function defaultTitlePlaceholder(v: Variation): string {
  if (v === 'video') return 'Thyroid Issues Video';
  if (v === 'pdf') return 'Health and wellness PDF';
  if (v === 'quiz') return 'Can you guess the above pose?';
  return 'Health and wellness Poster';
}

function imageLabel(v: Variation): string {
  if (v === 'video') return 'Video thumbnail';
  if (v === 'pdf') return 'Cover thumbnail';
  if (v === 'quiz') return 'Instructor image';
  return 'Poster image';
}

function imageHint(v: Variation): string {
  if (v === 'video') return 'Thumbnail members see before tapping play. Recommended 1080 x 1350.';
  if (v === 'pdf') return 'Cover thumbnail. Recommended 1080 x 1350 (4:5).';
  if (v === 'quiz') return 'Background image (usually the instructor). Optional. Hide with the no-image toggle.';
  return 'Poster image. Recommended 1080 x 1350 (4:5).';
}

function defaultPrimary(v: Variation): string {
  if (v === 'video') return 'Watch Now';
  if (v === 'pdf') return 'Download PDF';
  if (v === 'quiz') return 'Share this Quiz';
  return 'Share Poster';
}

function defaultPrimaryUrl(v: Variation): string {
  if (v === 'video') return 'https://youtube.com/shorts/...';
  if (v === 'pdf') return 'https://habuild.in/booklets/...';
  if (v === 'quiz') return '';
  return '';
}

function defaultSecondary(v: Variation): string {
  if (v === 'video') return 'Share Video';
  if (v === 'pdf') return 'Share PDF';
  return 'Download Poster';
}

function defaultSecondaryUrl(v: Variation): string {
  if (v === 'video') return '';
  if (v === 'pdf') return '';
  return '';
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

function QuizFields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const options = asArray<unknown>(card.quiz_options).map((o) => asString(o));
  const correct = asString(card.quiz_correct) || 'A';
  const showCompleted = card.quiz_show_completed_state === true;
  const showWrong = card.quiz_show_wrong_state === true;
  const noImage = card.quiz_no_image === true;

  const updateOption = (idx: number, next: string) => {
    const copy = options.slice();
    copy[idx] = next;
    onPatch({ quiz_options: copy });
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const copy = options.slice();
    copy.splice(idx, 1);
    const correctIdx = correct.charCodeAt(0) - 65;
    const nextPatch: Record<string, unknown> = { quiz_options: copy };
    if (correctIdx >= copy.length) nextPatch.quiz_correct = 'A';
    onPatch(nextPatch);
  };

  const addOption = () => {
    if (options.length >= 4) return;
    onPatch({ quiz_options: [...options, ''] });
  };

  const correctOptions = ['A', 'B', 'C', 'D']
    .slice(0, Math.max(options.length, 1))
    .map((L) => ({ value: L, label: L }));

  return (
    <>
      <Group title="Quiz" hint="Question, options, correct answer, hint.">
        <TextField
          label="Question"
          value={asString(card.quiz_question)}
          onChange={(next) => onPatch({ quiz_question: next })}
          placeholder="e.g. Can you guess the above pose?"
        />
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)' }}>
            Options
          </div>
          {options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            return (
              <div key={idx} style={optionRowStyle}>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${letter}`}
                  style={optionInputStyle}
                />
                {options.length > 2 ? (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    aria-label={`Remove option ${letter}`}
                    style={removeBtnStyle}
                  >
                    x
                  </button>
                ) : null}
              </div>
            );
          })}
          {options.length < 4 ? (
            <button type="button" onClick={addOption} style={addBtnStyle}>
              + Add another option
            </button>
          ) : null}
        </div>
        <div className={groupStyles.cols2}>
          <SelectField
            label="Correct answer"
            value={correct}
            onChange={(next) => onPatch({ quiz_correct: next })}
            options={correctOptions}
          />
          <TextField
            label="Hint text (optional)"
            value={asString(card.quiz_hint)}
            onChange={(next) => onPatch({ quiz_hint: next })}
            placeholder="A gentle nudge for the wrong-answer state."
          />
        </div>
      </Group>

      <Group title="Quiz layout and preview states" hint="Toggles only affect the preview.">
        <label style={toggleRowStyle}>
          <input
            type="checkbox"
            checked={noImage}
            onChange={(e) => onPatch({ quiz_no_image: e.target.checked })}
          />
          <span>No instructor image (centered question card)</span>
        </label>
        <label style={toggleRowStyle}>
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => onPatch({
              quiz_show_completed_state: e.target.checked,
              quiz_show_wrong_state: e.target.checked ? false : showWrong,
            })}
          />
          <span>Preview "completed" state (2nd open, answered correctly)</span>
        </label>
        <label style={toggleRowStyle}>
          <input
            type="checkbox"
            checked={showWrong}
            onChange={(e) => onPatch({
              quiz_show_wrong_state: e.target.checked,
              quiz_show_completed_state: e.target.checked ? false : showCompleted,
            })}
          />
          <span>Preview "wrong answer" state (2nd open, missed it)</span>
        </label>
      </Group>
    </>
  );
}

function VideoFields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  return (
    <Group title="Video" hint="YouTube or Shorts URL, optional duration and credit.">
      <TextField
        label="Video URL"
        value={asString(card.video_url)}
        onChange={(next) => onPatch({ video_url: next })}
        placeholder="https://youtube.com/shorts/..."
      />
      <div className={groupStyles.cols2}>
        <TextField
          label="Duration (optional)"
          value={asString(card.video_duration)}
          onChange={(next) => onPatch({ video_duration: next })}
          placeholder="e.g. 3 min"
        />
        <TextField
          label="Credit (optional)"
          value={asString(card.video_credit)}
          onChange={(next) => onPatch({ video_credit: next })}
          placeholder="e.g. News credit: The Better India"
        />
      </div>
    </Group>
  );
}

const optionRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  alignItems: 'center',
};

const optionInputStyle: React.CSSProperties = {
  flex: 1,
  height: 32,
  padding: '0 10px',
  border: '1px solid var(--border)',
  borderRadius: 6,
  fontSize: 12.5,
  fontFamily: 'inherit',
  background: '#fff',
};

const removeBtnStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: '#fff',
  width: 28,
  height: 28,
  borderRadius: 6,
  cursor: 'pointer',
  color: 'var(--text-3)',
};

const addBtnStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px dashed var(--border)',
  background: '#fff',
  borderRadius: 6,
  cursor: 'pointer',
  color: 'var(--text-2)',
  fontSize: 11.5,
  alignSelf: 'start',
  fontFamily: 'inherit',
};

const toggleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  color: 'var(--text-2)',
  cursor: 'pointer',
  padding: '4px 0',
};
