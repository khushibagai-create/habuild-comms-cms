import { TextField } from '../../components/fields/TextField';
import { ImageUpload } from '../../components/fields/ImageUpload';
import { BulletListField } from '../../components/fields/BulletListField';
import type { FieldsProps } from '../types';
import { asString, asArray, asNumber } from '../shared/cardParts';
import groupStyles from '../shared/groupStyles.module.css';

/* Recording form fields.
   Mirrors buildRecoveryFields in 10-comms-cms.html. */

export function RecordingFields({ card, onPatch }: FieldsProps) {
  const focusBullets = asArray<string>(card.focus_bullets);
  const expiry = card.expiry_hours;
  const expiryStr =
    typeof expiry === 'number'
      ? String(expiry)
      : typeof expiry === 'string'
        ? expiry
        : '';

  return (
    <>
      <Group title="Header" hint="Badge, heading, subheading">
        <TextField
          label="Badge text"
          value={asString(card.badge_text)}
          onChange={(v) => onPatch({ badge_text: v })}
          placeholder="RECORDING · 39 min"
          helperText="Shows over the top-left of the thumbnail."
        />
        <TextField
          label="Heading"
          value={asString(card.heading)}
          onChange={(v) => onPatch({ heading: v })}
          placeholder="Full Body Stretch"
        />
        <TextField
          label="Subheading"
          value={asString(card.subheading)}
          onChange={(v) => onPatch({ subheading: v })}
          placeholder="You missed yesterday's morning session."
        />
      </Group>

      <Group title="Video" hint="Thumbnail, link, duration">
        <ImageUpload
          label="Video thumbnail"
          value={asString(card.video_thumbnail) || null}
          metaName={asString(card.video_thumbnail_name) || undefined}
          metaSize={asNumber(card.video_thumbnail_size)}
          hint="Click to upload. Recommended 16:9."
          onChange={(next, meta) => {
            if (next === null) {
              onPatch({
                video_thumbnail: '',
                video_thumbnail_name: '',
                video_thumbnail_size: undefined,
              });
            } else {
              onPatch({
                video_thumbnail: next,
                video_thumbnail_name: meta?.name ?? '',
                video_thumbnail_size: meta?.size,
              });
            }
          }}
        />
        <div className={groupStyles.cols2}>
          <TextField
            label="Video URL"
            value={asString(card.video_url)}
            onChange={(v) => onPatch({ video_url: v })}
            placeholder="me.habuild.in/recording/..."
          />
          <TextField
            label="Duration"
            value={asString(card.video_duration)}
            onChange={(v) => onPatch({ video_duration: v })}
            placeholder="39 min"
          />
        </div>
      </Group>

      <Group title="Expert" hint="Avatar initials + uppercase name">
        <TextField
          label="Expert name"
          value={asString(card.expert_name)}
          onChange={(v) => onPatch({ expert_name: v })}
          placeholder="DR. SAURABH BOTHRA"
        />
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
        />
        <BulletListField
          label="Bullets"
          value={focusBullets}
          onChange={(next) => onPatch({ focus_bullets: next })}
          placeholder="What this recording covers"
          minRows={0}
        />
      </Group>

      <Group title="Expiry and disclaimer" hint="Both optional">
        <div className={groupStyles.cols2}>
          <TextField
            label="Expiry hours (optional)"
            value={expiryStr}
            onChange={(v) => {
              const trimmed = v.trim();
              if (trimmed === '') {
                onPatch({ expiry_hours: '' });
              } else {
                const n = parseInt(trimmed, 10);
                onPatch({ expiry_hours: isNaN(n) ? trimmed : n });
              }
            }}
            placeholder="Leave blank if no expiry"
            helperText='Drives the thumbnail pill (e.g. "24h"). Leave blank or 0 to hide.'
          />
          <TextField
            label="Disclaimer (optional)"
            value={asString(card.disclaimer)}
            onChange={(v) => onPatch({ disclaimer: v })}
            placeholder="Available for 24 hours"
            helperText="Line under the heading. Leave blank to hide."
          />
        </div>
      </Group>

      <Group title="Primary CTA" hint="Full-width Watch button">
        <div className={groupStyles.cols2}>
          <TextField
            label="Primary CTA text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder="Watch recording"
          />
          <TextField
            label="Primary CTA URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder="me.habuild.in/recording/..."
          />
        </div>
      </Group>

      <Group
        title="Secondary CTA"
        hint="Optional inline link below the primary"
      >
        <div className={groupStyles.cols2}>
          <TextField
            label="Secondary CTA text"
            value={asString(card.secondary_cta_text)}
            onChange={(v) => onPatch({ secondary_cta_text: v })}
            placeholder="Save for later"
          />
          <TextField
            label="Secondary CTA URL"
            value={asString(card.secondary_cta_url)}
            onChange={(v) => onPatch({ secondary_cta_url: v })}
            placeholder="me.habuild.in/..."
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
