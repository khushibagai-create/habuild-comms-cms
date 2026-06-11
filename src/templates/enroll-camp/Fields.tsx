import { TextField } from '../../components/fields/TextField';
import { TextArea } from '../../components/fields/TextArea';
import { ImageUpload } from '../../components/fields/ImageUpload';
import { BulletListField } from '../../components/fields/BulletListField';
import { TimelineRowsField, type TimelineRow } from '../../components/fields/TimelineRowsField';
import type { FieldsProps } from '../types';
import { asString, asArray, asNumber } from '../shared/cardParts';
import groupStyles from '../shared/groupStyles.module.css';

/* Program Announcement form fields.
   Mirrors buildEnrollCampSingleFields / buildEnrollCampMultiStory2Fields /
   buildEnrollCampMoreDetailsFields in 10-comms-cms.html.

   Card index -> form mapping:
   - Single variation, card 0 = hero (single fields).
   - Multi variation, card 0 = hero (single fields), card 1 = numbered timeline.
   - Any card with kind === 'more-details' = numbered timeline + header. */

export function EnrollCampFields({ card, cardIndex, variation, onPatch }: FieldsProps) {
  const kind = asString(card.kind);
  if (kind === 'more-details') {
    return <MoreDetailsFields card={card} onPatch={onPatch} />;
  }
  const v = variation || 'single';
  if (v === 'single') return <HeroFields card={card} onPatch={onPatch} />;
  // Multi: card 0 = hero, card 1 = timeline.
  if (cardIndex === 0) return <HeroFields card={card} onPatch={onPatch} />;
  return <TimelineCardFields card={card} onPatch={onPatch} />;
}

/* ============================================================
   Hero (Single + Multi-day Story 1)
   ============================================================ */
function HeroFields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const focusBullets = asArray<string>(card.focus_bullets);

  return (
    <>
      <Group title="Hero content" hint="Top of the announcement card">
        <TextField
          label="Info pill"
          value={asString(card.info_pill)}
          onChange={(v) => onPatch({ info_pill: v })}
          placeholder="FREE EVENT"
        />
        <ImageUpload
          label="Hero image"
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
        <TextField
          label="Title"
          value={asString(card.title)}
          onChange={(v) => onPatch({ title: v })}
          placeholder="International Yoga Day 2026"
        />
        <TextArea
          label="Subtitle"
          value={asString(card.subtitle)}
          onChange={(v) => onPatch({ subtitle: v })}
          placeholder="Join Saurabh Bothra live for a one-hour global session."
          rows={2}
        />
      </Group>

      <Group title="Expert" hint="Name shown under the hero. Uppercase recommended.">
        <TextField
          label="Expert name"
          value={asString(card.expert_name)}
          onChange={(v) => onPatch({ expert_name: v })}
          placeholder="DR. SAURABH BOTHRA"
        />
      </Group>

      <Group title="Stats" hint="Three quick facts shown in the hero strip">
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
            placeholder="45 min"
          />
          <TextField
            label="Program"
            value={asString(card.stat_program)}
            onChange={(v) => onPatch({ stat_program: v })}
            placeholder="14 Days"
          />
        </div>
      </Group>

      <Group
        title="Bullet points"
        hint="Optional. Editable section title + bullets. Hidden if both are blank."
      >
        <TextField
          label="Section title"
          value={asString(card.focus_title)}
          onChange={(v) => onPatch({ focus_title: v })}
          placeholder="Today's focus"
          helperText='Editable. Comms can rename to "What you will learn", "Key takeaways", etc.'
        />
        <BulletListField
          label="Bullets"
          value={focusBullets}
          onChange={(next) => onPatch({ focus_bullets: next })}
          placeholder="What members will learn or do"
          minRows={0}
        />
      </Group>

      <Group title="When and what" hint="Date and time of the event">
        <div className={groupStyles.cols2}>
          <TextField
            label="Event date"
            type="date"
            value={asString(card.event_date)}
            onChange={(v) => onPatch({ event_date: v })}
          />
          <TextField
            label="Event time"
            value={asString(card.event_time)}
            onChange={(v) => onPatch({ event_time: v })}
            placeholder="6:00 AM"
          />
        </div>
        <TextField
          label="Program"
          value={asString(card.program)}
          onChange={(v) => onPatch({ program: v })}
          placeholder="14-day Kids Camp"
        />
      </Group>

      <Group
        title="Call to action"
        hint="Primary register button. Secondary link is optional."
      >
        <div className={groupStyles.cols2}>
          <TextField
            label="Primary CTA text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder="Register free"
          />
          <TextField
            label="Primary URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder="me.habuild.in/iyd2026"
          />
        </div>
        <div className={groupStyles.cols2}>
          <TextField
            label="Secondary CTA text"
            value={asString(card.secondary_cta_text)}
            onChange={(v) => onPatch({ secondary_cta_text: v })}
            placeholder="Add to calendar (optional)"
          />
          <TextField
            label="Secondary URL"
            value={asString(card.secondary_cta_url)}
            onChange={(v) => onPatch({ secondary_cta_url: v })}
            placeholder="me.habuild.in/iyd2026/calendar"
          />
        </div>
      </Group>
    </>
  );
}

/* ============================================================
   Multi-day Story 2 (numbered day timeline only)
   ============================================================ */
function TimelineCardFields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const rawRows = asArray<Record<string, unknown>>(card.timeline_rows);
  const rows: TimelineRow[] = rawRows.map((r, i) => ({
    number: String(asString(r.number) || asNumber(r.number) || i + 1),
    title: asString(r.title),
    body: asString(r.time_more_info),
  }));

  return (
    <>
      <Group title="Heading" hint="Top of Story 2">
        <TextField
          label="Info pill"
          value={asString(card.info_pill)}
          onChange={(v) => onPatch({ info_pill: v })}
          placeholder="PROGRAM PLAN"
        />
        <TextField
          label="Title"
          value={asString(card.title)}
          onChange={(v) => onPatch({ title: v })}
          placeholder="Title Goes Here"
        />
        <TextArea
          label="Subtitle"
          value={asString(card.subtitle)}
          onChange={(v) => onPatch({ subtitle: v })}
          placeholder="Subtext goes here"
          rows={2}
        />
      </Group>

      <Group
        title="Timeline"
        hint="Numbered rows. One per day or step. Numbers auto-increment."
      >
        <TimelineRowsField
          label=""
          value={rows}
          onChange={(next) => {
            const mapped = next.map((r, i) => ({
              number: parseInt(r.number, 10) || i + 1,
              title: r.title,
              time_more_info: r.body,
            }));
            onPatch({ timeline_rows: mapped });
          }}
          addLabel="+ Add row"
        />
      </Group>

      <Group title="Call to action" hint="Primary enroll button">
        <div className={groupStyles.cols2}>
          <TextField
            label="Primary CTA text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder="Enroll Now"
          />
          <TextField
            label="Primary URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder="me.habuild.in/enroll/..."
          />
        </div>
      </Group>
    </>
  );
}

/* ============================================================
   More details card (appended to either variation)
   ============================================================ */
function MoreDetailsFields({
  card,
  onPatch,
}: {
  card: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const rawRows = asArray<Record<string, unknown>>(card.timeline_rows);
  const rows: TimelineRow[] = rawRows.map((r, i) => ({
    number: String(asString(r.number) || asNumber(r.number) || i + 1),
    title: asString(r.title),
    body: asString(r.time_more_info),
  }));

  return (
    <>
      <Group title="Header" hint="Pill, heading, subheading">
        <TextField
          label="Info pill"
          value={asString(card.info_pill)}
          onChange={(v) => onPatch({ info_pill: v })}
          placeholder="MORE DETAILS"
        />
        <TextField
          label="Title"
          value={asString(card.title)}
          onChange={(v) => onPatch({ title: v })}
          placeholder="What to expect"
        />
        <TextArea
          label="Subtitle"
          value={asString(card.subtitle)}
          onChange={(v) => onPatch({ subtitle: v })}
          placeholder="A few extra things worth knowing."
          rows={2}
        />
      </Group>

      <Group title="Timeline" hint="Numbered rows. Numbers auto-increment.">
        <TimelineRowsField
          label=""
          value={rows}
          onChange={(next) => {
            const mapped = next.map((r, i) => ({
              number: parseInt(r.number, 10) || i + 1,
              title: r.title,
              time_more_info: r.body,
            }));
            onPatch({ timeline_rows: mapped });
          }}
          addLabel="+ Add row"
        />
      </Group>

      <Group title="Call to action" hint="Primary button on this card">
        <div className={groupStyles.cols2}>
          <TextField
            label="Primary CTA text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder="Enroll Now"
          />
          <TextField
            label="Primary URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder="me.habuild.in/enroll/..."
          />
        </div>
      </Group>
    </>
  );
}

/* ============================================================
   Section wrapper — mirrors sectionWrap() in source HTML, used
   only inside this template (kept simple, not exported).
   ============================================================ */
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
