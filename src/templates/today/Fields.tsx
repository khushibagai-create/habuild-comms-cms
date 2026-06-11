import { TextField } from '../../components/fields/TextField';
import { TextArea } from '../../components/fields/TextArea';
import { SelectField } from '../../components/fields/SelectField';
import { ImageUpload } from '../../components/fields/ImageUpload';
import type { FieldsProps } from '../types';
import { asArray, asNumber, asString } from '../shared/cardParts';
import groupStyles from '../shared/groupStyles.module.css';

/* Today form fields. Mirrors buildTodayFields in 10-comms-cms.html.
   Variation-aware: poster / quiz / video / pdf. Heading + subheading + image
   are shared; the per-variation block adds quiz options, video meta, or PDF
   meta. CTAs vary by variation (Watch is locked for video, Share is locked
   for poster + quiz; PDF has its own dual-CTA layout). */

type Variation = 'poster' | 'quiz' | 'video' | 'pdf';

function readVariation(card: Record<string, unknown>, fallback?: string): Variation {
  const raw = asString(card.variation) || asString(fallback);
  if (raw === 'quiz' || raw === 'video' || raw === 'pdf') return raw;
  return 'poster';
}

export function TodayFields({ card, variation, onPatch }: FieldsProps) {
  const v = readVariation(card, variation);
  const imageLabel =
    v === 'video'
      ? 'Video thumbnail'
      : v === 'pdf'
        ? 'Cover thumbnail'
        : 'Poster image';
  const imageHint =
    v === 'video'
      ? 'Thumbnail members see before tapping play. Recommended 1080 x 1350.'
      : v === 'pdf'
        ? 'Cover thumbnail. Recommended 1080 x 1350 (4:5).'
        : 'Poster image. Recommended 1080 x 1350 (4:5).';

  return (
    <>
      <Group
        title="Heading and subheading"
        hint="Shown above the poster on the dark story background"
      >
        <TextField
          label="Heading"
          value={asString(card.heading)}
          onChange={(v) => onPatch({ heading: v })}
          placeholder="e.g. Habit Everyday · Better Breakfast"
          helperText="Short title, 1 line. Keep it under 60 characters."
        />
        <TextArea
          label="Subheading"
          value={asString(card.subheading)}
          onChange={(v) => onPatch({ subheading: v })}
          placeholder="A 1 to 2 line description that tees up the poster."
          helperText="Members read this before the image loads. Keep it warm and clear."
          rows={2}
        />
      </Group>

      <Group title={imageLabel} hint={imageHint}>
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
      {v === 'pdf' ? <PdfFields card={card} onPatch={onPatch} /> : null}

      {v === 'pdf' ? (
        <Group
          title="Primary and secondary CTAs"
          hint="Members can download or share the PDF"
        >
          <div className={groupStyles.cols2}>
            <TextField
              label="Primary button label"
              value={asString(card.cta) || 'Download PDF'}
              onChange={(v) => onPatch({ cta: v })}
              placeholder="Download PDF"
            />
            <TextField
              label="Secondary button label"
              value={asString(card.secondaryCta) || 'Share PDF'}
              onChange={(v) => onPatch({ secondaryCta: v })}
              placeholder="Share PDF"
            />
          </div>
          <TextField
            label="Secondary URL or deep link (optional)"
            value={asString(card.secondaryCtaUrl)}
            onChange={(v) => onPatch({ secondaryCtaUrl: v })}
            placeholder="https://habuild.in/share/recipe-booklet"
            helperText="Where the share button opens. Leave blank for the native share sheet."
          />
        </Group>
      ) : (
        <Group title="Secondary CTA" hint="Where the secondary button takes members">
          <div className={groupStyles.cols2}>
            <TextField
              label="Button label"
              value={asString(card.secondary_cta_text)}
              onChange={(v) => onPatch({ secondary_cta_text: v })}
              placeholder="Take today's quiz / Open recipe / Watch full video"
            />
            <TextField
              label="URL or deep link"
              value={asString(card.secondary_cta_url)}
              onChange={(v) => onPatch({ secondary_cta_url: v })}
              placeholder="/quiz or me.habuild.in/recipes/cheela"
            />
          </div>
          <div style={lockedRowStyle}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M11 7V5a3 3 0 0 0-6 0v2M4 7h8v6H4z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              Primary CTA: <b>{v === 'video' ? 'Watch' : 'Share'}</b>{' '}
              {v === 'video'
                ? '(plays the video inline)'
                : '(uses native share sheet)'}{' '}
              · not editable
            </span>
          </div>
        </Group>
      )}
    </>
  );
}

const lockedRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
  padding: '8px 10px',
  background: 'var(--p-stat-bg, #f1f5f9)',
  borderRadius: 6,
  fontSize: 11.5,
  color: 'var(--text-2)',
};

function QuizFields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const options = asArray<string>(card.quiz_options).map((o) => asString(o));
  const correct = asString(card.quiz_correct) || 'A';
  const hintEnabled = card.quiz_hint_enabled === true;

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
    .slice(0, options.length)
    .map((L) => ({ value: L, label: L }));

  return (
    <Group title="Quiz" hint="Question, options, correct answer">
      <TextField
        label="Question"
        value={asString(card.quiz_question)}
        onChange={(v) => onPatch({ quiz_question: v })}
        placeholder="e.g. Why are sprouts often added to meals?"
        helperText="Often the same as the subheading. Edit if you want a tighter question."
      />
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)' }}>
          Options
        </div>
        {options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          return (
            <div
              key={idx}
              style={{ display: 'flex', gap: 6, alignItems: 'center' }}
            >
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Option ${letter}`}
                style={{
                  flex: 1,
                  height: 32,
                  padding: '0 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontFamily: 'inherit',
                  background: '#fff',
                }}
              />
              {options.length > 2 ? (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  aria-label={`Remove option ${letter}`}
                  style={{
                    border: '1px solid var(--border)',
                    background: '#fff',
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: 'var(--text-3)',
                  }}
                >
                  ×
                </button>
              ) : null}
            </div>
          );
        })}
        {options.length < 4 ? (
          <button
            type="button"
            onClick={addOption}
            style={{
              padding: '6px 10px',
              border: '1px dashed var(--border)',
              background: '#fff',
              borderRadius: 6,
              cursor: 'pointer',
              color: 'var(--text-2)',
              fontSize: 11.5,
              alignSelf: 'start',
              fontFamily: 'inherit',
            }}
          >
            + Add another option
          </button>
        ) : null}
      </div>
      <div className={groupStyles.cols2}>
        <SelectField
          label="Correct answer"
          value={correct}
          onChange={(v) => onPatch({ quiz_correct: v })}
          options={correctOptions}
        />
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: 'var(--text-2)',
            cursor: 'pointer',
            paddingTop: 22,
          }}
        >
          <input
            type="checkbox"
            checked={hintEnabled}
            onChange={(e) => onPatch({ quiz_hint_enabled: e.target.checked })}
          />
          Show "reply HINT for a gentle clue"
        </label>
      </div>
    </Group>
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
    <Group
      title="Video"
      hint="YouTube or Shorts URL, duration, optional credit"
    >
      <TextField
        label="Video URL"
        value={asString(card.video_url)}
        onChange={(v) => onPatch({ video_url: v })}
        placeholder="https://youtube.com/shorts/..."
      />
      <div className={groupStyles.cols2}>
        <TextField
          label="Duration"
          value={asString(card.video_duration)}
          onChange={(v) => onPatch({ video_duration: v })}
          placeholder="e.g. 3 min"
        />
        <TextField
          label="Credit (optional)"
          value={asString(card.video_credit)}
          onChange={(v) => onPatch({ video_credit: v })}
          placeholder="e.g. News credit: The Better India"
        />
      </div>
    </Group>
  );
}

function PdfFields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  return (
    <Group title="PDF" hint="Direct PDF link and size or page count">
      <TextField
        label="PDF URL"
        value={asString(card.pdf_url)}
        onChange={(v) => onPatch({ pdf_url: v })}
        placeholder="https://habuild.in/assets/recipe-booklet.pdf"
        helperText="Direct link to the downloadable PDF."
      />
      <TextField
        label="Pages or size"
        value={asString(card.pdf_pages)}
        onChange={(v) => onPatch({ pdf_pages: v })}
        placeholder='e.g. 12 pages or 2.4 MB'
        helperText='Shown as a small badge on the cover. Either "12 pages" or "2.4 MB" works.'
      />
    </Group>
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
