import { TextField } from '../../components/fields/TextField';
import { TextArea } from '../../components/fields/TextArea';
import { ImageUpload } from '../../components/fields/ImageUpload';
import { TimelineRowsField, type TimelineRow } from '../../components/fields/TimelineRowsField';
import type { FieldsProps } from '../types';
import { asString, asArray, asNumber } from '../shared/cardParts';
import groupStyles from '../shared/groupStyles.module.css';

/* Tools form fields. Mirrors buildToolsFields in 10-comms-cms.html. */

export function ToolsFields({ card, cardIndex, onPatch }: FieldsProps) {
  if (cardIndex === 0) return <Story1Fields card={card} onPatch={onPatch} />;
  return <Story2Fields card={card} onPatch={onPatch} />;
}

type Stat = { label: string; value: string };

function Story1Fields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const statsRaw = asArray<Record<string, unknown>>(card.stats);
  const stats: Stat[] = statsRaw.map((s) => ({
    label: asString(s.label),
    value: asString(s.value),
  }));

  const updateStat = (idx: number, patch: Partial<Stat>) => {
    const next = stats.map((s) => ({ ...s }));
    const existing = next[idx] ?? { label: '', value: '' };
    next[idx] = { ...existing, ...patch };
    onPatch({ stats: next });
  };

  const removeStat = (idx: number) => {
    const next = stats.slice();
    next.splice(idx, 1);
    onPatch({ stats: next });
  };

  const addStat = () => {
    if (stats.length >= 3) return;
    onPatch({ stats: [...stats, { label: '', value: '' }] });
  };

  return (
    <>
      <Group
        title="Banner"
        hint="Eyebrow strip at the top of the card. Palette-themed."
      >
        <TextField
          label="Banner text"
          value={asString(card.banner_text)}
          onChange={(v) => onPatch({ banner_text: v })}
          placeholder="NEW · TOOL"
          helperText="Examples: NEW TOOL, MOTHER'S DAY GIFT, FREE FOR MEMBERS."
        />
      </Group>

      <Group title="Header" hint="Tool name and one-line description">
        <TextField
          label="Heading"
          value={asString(card.title)}
          onChange={(v) => onPatch({ title: v })}
          placeholder="Create Everyday"
        />
        <TextArea
          label="Subheading"
          value={asString(card.subtitle)}
          onChange={(v) => onPatch({ subtitle: v })}
          placeholder="A daily 60-second reflection your future self will thank you for."
          rows={2}
        />
      </Group>

      <Group
        title="Hero image"
        hint="Main visual. Tool screenshot, illustration, or photo."
      >
        <ImageUpload
          label="Image"
          value={asString(card.hero_image) || null}
          metaName={asString(card.hero_image_name) || undefined}
          metaSize={asNumber(card.hero_image_size)}
          hint="Click to upload. Recommended 1080 x 720."
          onChange={(next, meta) => {
            if (next === null) {
              onPatch({
                hero_image: '',
                hero_image_name: '',
                hero_image_size: undefined,
              });
            } else {
              onPatch({
                hero_image: next,
                hero_image_name: meta?.name ?? '',
                hero_image_size: meta?.size,
              });
            }
          }}
        />
      </Group>

      <Group
        title="Info"
        hint="Stats strip. 1, 2, or 3 rows. Leave empty to hide."
      >
        <StatsEditor
          stats={stats}
          onUpdate={updateStat}
          onRemove={removeStat}
          onAdd={addStat}
        />
      </Group>

      <Group title="Primary CTA" hint="The main button">
        <div className={groupStyles.cols2}>
          <TextField
            label="Button text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder="Try Create Everyday"
          />
          <TextField
            label="URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder="me.habuild.in/tool/..."
          />
        </div>
      </Group>

      <Group
        title="Secondary CTA (optional)"
        hint="Secondary link shown under the primary button"
      >
        <div className={groupStyles.cols2}>
          <TextField
            label="Link text"
            value={asString(card.secondary_link_text)}
            onChange={(v) => onPatch({ secondary_link_text: v })}
            placeholder="Learn more"
          />
          <TextField
            label="URL"
            value={asString(card.secondary_url)}
            onChange={(v) => onPatch({ secondary_url: v })}
            placeholder="me.habuild.in/..."
          />
        </div>
      </Group>
    </>
  );
}

function StatsEditor({
  stats,
  onUpdate,
  onRemove,
  onAdd,
}: {
  stats: Stat[];
  onUpdate: (idx: number, patch: Partial<Stat>) => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
}) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap: 8,
            alignItems: 'end',
          }}
        >
          <TextField
            label={`Value ${idx + 1}`}
            value={stat.value}
            onChange={(v) => onUpdate(idx, { value: v })}
            placeholder="60 SEC"
          />
          <TextField
            label="Label"
            value={stat.label}
            onChange={(v) => onUpdate(idx, { label: v })}
            placeholder="Daily"
          />
          <button
            type="button"
            onClick={() => onRemove(idx)}
            aria-label={`Remove stat ${idx + 1}`}
            style={{
              height: 36,
              padding: '0 10px',
              border: '1px solid var(--border)',
              background: '#fff',
              borderRadius: 6,
              cursor: 'pointer',
              color: 'var(--text-2)',
            }}
          >
            ×
          </button>
        </div>
      ))}
      {stats.length < 3 ? (
        <button
          type="button"
          onClick={onAdd}
          style={{
            padding: '8px 12px',
            border: '1px dashed var(--border)',
            background: '#fff',
            borderRadius: 6,
            cursor: 'pointer',
            color: 'var(--text-2)',
            fontSize: 12,
            fontFamily: 'inherit',
          }}
        >
          + Add stat
        </button>
      ) : null}
    </div>
  );
}

function Story2Fields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const rich = asArray<Record<string, unknown>>(card.rich_bullets);
  const rows: TimelineRow[] = rich.map((b, i) => ({
    number: String(i + 1),
    title: asString(b.heading),
    body: asString(b.subheading),
  }));

  return (
    <>
      <Group
        title="Info pill"
        hint="Small eyebrow at the top of card 2 (optional)"
      >
        <TextField
          label="Info pill text"
          value={asString(card.info_pill)}
          onChange={(v) => onPatch({ info_pill: v })}
          placeholder="HOW IT WORKS"
        />
      </Group>

      <Group title="Header" hint="Heading and one-line subheading">
        <TextField
          label="Heading"
          value={asString(card.title)}
          onChange={(v) => onPatch({ title: v })}
          placeholder="How Create Everyday works"
        />
        <TextField
          label="Subheading"
          value={asString(card.subtitle)}
          onChange={(v) => onPatch({ subtitle: v })}
          placeholder="Three taps and you are done."
        />
      </Group>

      <Group
        title="Bullets"
        hint="Numbered steps. Each step has its own heading + subheading. 3 to 5 rows."
      >
        <TimelineRowsField
          label=""
          value={rows}
          onChange={(next) => {
            const mapped = next.map((r) => ({
              heading: r.title,
              subheading: r.body,
            }));
            onPatch({ rich_bullets: mapped });
          }}
          addLabel="+ Add step"
        />
      </Group>

      <Group
        title="Primary CTA"
        hint="Same destination as card 1's primary CTA"
      >
        <div className={groupStyles.cols2}>
          <TextField
            label="Button text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder="Try Create Everyday"
          />
          <TextField
            label="URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder="me.habuild.in/tool/..."
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
