import { TextField } from '../../components/fields/TextField';
import { TextArea } from '../../components/fields/TextArea';
import { ImageUpload } from '../../components/fields/ImageUpload';
import { BulletListField } from '../../components/fields/BulletListField';
import { TimelineRowsField, type TimelineRow } from '../../components/fields/TimelineRowsField';
import type { FieldsProps } from '../types';
import { asString, asArray, asNumber } from '../shared/cardParts';
import groupStyles from '../shared/groupStyles.module.css';

/* Daily Session Story form fields.
   Mirrors buildDailyUpdateStory1Fields / buildDailyUpdateStory2Fields. */

export function DailySessionFields({ card, cardIndex, onPatch }: FieldsProps) {
  if (cardIndex === 0) return <Story1Fields card={card} onPatch={onPatch} />;
  return <Story2Fields card={card} onPatch={onPatch} />;
}

function Story1Fields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const focusBullets = asArray<string>(card.focus_bullets);

  return (
    <>
      <Group title="Today's session" hint="Top of Story 1">
        <TextField
          label="Badge"
          value={asString(card.info_pill)}
          onChange={(v) => onPatch({ info_pill: v })}
          placeholder="DAY 3 OF 7"
        />
        <TextField
          label="Title"
          value={asString(card.title)}
          onChange={(v) => onPatch({ title: v })}
          placeholder="Heart Opening Flow"
        />
        <TextArea
          label="Subtitle"
          value={asString(card.subtitle)}
          onChange={(v) => onPatch({ subtitle: v })}
          placeholder="Open the chest and shoulders. A gentle 30-minute flow."
          rows={2}
        />
      </Group>

      <Group
        title="Banner image (optional)"
        hint="Full-width hero at the top of the card. Badge overlays the top-left."
      >
        <ImageUpload
          label="Image"
          value={asString(card.hero_image) || null}
          metaName={asString(card.hero_image_name) || undefined}
          metaSize={asNumber(card.hero_image_size)}
          hint="Click to upload. Recommended 1080 x 720."
          onChange={(next, meta) => {
            if (next === null) {
              onPatch({ hero_image: '', hero_image_name: '', hero_image_size: undefined });
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

      <Group title="Expert" hint="Expert chip shown above the title">
        <TextField
          label="Expert"
          value={asString(card.expert_name)}
          onChange={(v) => onPatch({ expert_name: v })}
          placeholder="DR. SAURABH BOTHRA"
        />
      </Group>

      <Group
        title="Stats"
        hint="Time, Duration, Program. Same strip as Program Announcement hero."
      >
        <div className={groupStyles.cols3}>
          <TextField
            label="Time"
            value={asString(card.stat_time)}
            onChange={(v) => onPatch({ stat_time: v })}
            placeholder="6 AM | 11 AM"
          />
          <TextField
            label="Duration"
            value={asString(card.stat_duration)}
            onChange={(v) => onPatch({ stat_duration: v })}
            placeholder="30 min"
          />
          <TextField
            label="Program"
            value={asString(card.stat_program)}
            onChange={(v) => onPatch({ stat_program: v })}
            placeholder="Day 3 of 7"
          />
        </div>
      </Group>

      <Group
        title="Bullet points"
        hint="Editable section title + bullets. Hidden if both are blank."
      >
        <TextField
          label="Section title"
          value={asString(card.focus_title)}
          onChange={(v) => onPatch({ focus_title: v })}
          placeholder="Today's focus"
        />
        <BulletListField
          label="Bullets"
          value={focusBullets}
          onChange={(next) => onPatch({ focus_bullets: next })}
          placeholder="12 rounds of Surya Namaskar"
          minRows={0}
        />
      </Group>

      <Group
        title="Call to action"
        hint="Primary join button. Secondary is optional."
      >
        <div className={groupStyles.cols2}>
          <TextField
            label="Primary CTA text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder="Join live session"
          />
          <TextField
            label="Primary URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder="me.habuild.in/live/..."
          />
        </div>
        <div className={groupStyles.cols2}>
          <TextField
            label="Secondary CTA text"
            value={asString(card.secondary_cta_text)}
            onChange={(v) => onPatch({ secondary_cta_text: v })}
            placeholder="See yesterday's recording (optional)"
          />
          <TextField
            label="Secondary URL"
            value={asString(card.secondary_cta_url)}
            onChange={(v) => onPatch({ secondary_cta_url: v })}
            placeholder="me.habuild.in/recording/..."
          />
        </div>
      </Group>
    </>
  );
}

function Story2Fields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  // Rich bullets — heading + subheading per row. We surface them through the
  // TimelineRowsField primitive (which has heading + body inputs); we ignore
  // its "number" field on read and re-assign it on write.
  const rich = asArray<Record<string, unknown>>(card.rich_bullets);
  const rows: TimelineRow[] = rich.map((b, i) => ({
    number: String(i + 1),
    title: asString(b.heading),
    body: asString(b.subheading),
  }));

  return (
    <>
      <Group title="Deeper context" hint="Top of Story 2">
        <TextField
          label="Heading"
          value={asString(card.heading)}
          onChange={(v) => onPatch({ heading: v })}
          placeholder="Why this matters"
        />
        <TextArea
          label="Subheading"
          value={asString(card.subheading)}
          onChange={(v) => onPatch({ subheading: v })}
          placeholder="A one-line elaboration of the heading."
          rows={2}
        />
      </Group>

      <Group
        title="Rich bullets"
        hint="Each bullet has its own heading and subheading."
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
          addLabel="+ Add bullet"
        />
      </Group>

      <Group title="Call to action" hint="Same join button as Story 1">
        <div className={groupStyles.cols2}>
          <TextField
            label="Primary CTA text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder="Join live session"
          />
          <TextField
            label="Primary URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder="me.habuild.in/live/..."
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
