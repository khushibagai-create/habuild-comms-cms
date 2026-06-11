import { TextField } from '../../components/fields/TextField';
import { TextArea } from '../../components/fields/TextArea';
import { ImageUpload } from '../../components/fields/ImageUpload';
import type { FieldsProps } from '../types';
import { asString, asNumber } from '../shared/cardParts';
import groupStyles from '../shared/groupStyles.module.css';

/* Certificate / Resources form fields.
   Mirrors buildCertificateFields in 10-comms-cms.html. Variation flips
   placeholders only; the same fields stay on screen. */

export function CertificateFields({ card, variation, onPatch }: FieldsProps) {
  const v = (variation || asString(card.variation) || 'certificate') as
    | 'certificate'
    | 'resource';
  const isCert = v === 'certificate';

  const pillPlaceholder = isCert ? '14 DAY PROGRAM' : 'RECIPE BOOKLET';
  const headingPlaceholder = isCert
    ? 'You finished Surya Namaskar'
    : 'Your Recipe Booklet is ready';
  const subheadingPlaceholder = isCert
    ? 'All 5 days, all the rounds. Saurabh Bothra has a small thank-you for you.'
    : '10 nutrition recipes from Yamini. Save and cook all year.';
  const downloadPlaceholder = isCert ? 'Download certificate' : 'Download booklet';
  const downloadUrlPlaceholder = isCert
    ? 'me.habuild.in/certificate/...'
    : 'me.habuild.in/booklet/...';
  const primaryCtaPlaceholder = isCert ? 'Share My Certificate' : 'Share booklet';
  const primaryUrlPlaceholder = isCert
    ? 'me.habuild.in/share/cert/...'
    : 'me.habuild.in/share/booklet/...';
  const imageHint = isCert
    ? "Upload the member's certificate. Recommended 1200 x 800."
    : 'Upload the booklet cover. Recommended 1200 x 800.';

  return (
    <>
      <Group
        title={isCert ? 'Certificate image' : 'Cover image'}
        hint="Full-width hero at the top of the card"
      >
        <ImageUpload
          label="Image"
          value={asString(card.certificate_image) || null}
          metaName={asString(card.certificate_image_name) || undefined}
          metaSize={asNumber(card.certificate_image_size)}
          hint={imageHint}
          onChange={(next, meta) => {
            if (next === null) {
              onPatch({
                certificate_image: '',
                certificate_image_name: '',
                certificate_image_size: undefined,
              });
            } else {
              onPatch({
                certificate_image: next,
                certificate_image_name: meta?.name ?? '',
                certificate_image_size: meta?.size,
              });
            }
          }}
        />
      </Group>

      <Group
        title="Pill"
        hint="Small accent pill at the top-left of the white area below the image"
      >
        <TextField
          label="Pill text"
          value={asString(card.pill_text)}
          onChange={(v) => onPatch({ pill_text: v })}
          placeholder={pillPlaceholder}
          helperText="Uppercase reads best. Palette accent background."
        />
      </Group>

      <Group title="Header" hint="Heading and subheading">
        <TextField
          label="Heading"
          value={asString(card.heading)}
          onChange={(v) => onPatch({ heading: v })}
          placeholder={headingPlaceholder}
        />
        <TextArea
          label="Subheading"
          value={asString(card.subheading)}
          onChange={(v) => onPatch({ subheading: v })}
          placeholder={subheadingPlaceholder}
          rows={2}
        />
      </Group>

      <Group
        title="Download link"
        hint="Inline link shown above the primary button"
      >
        <div className={groupStyles.cols2}>
          <TextField
            label="Download text"
            value={asString(card.download_text)}
            onChange={(v) => onPatch({ download_text: v })}
            placeholder={downloadPlaceholder}
          />
          <TextField
            label="Download URL"
            value={asString(card.download_url)}
            onChange={(v) => onPatch({ download_url: v })}
            placeholder={downloadUrlPlaceholder}
          />
        </div>
      </Group>

      <Group
        title="Primary CTA"
        hint="The main button at the bottom of the card"
      >
        <div className={groupStyles.cols2}>
          <TextField
            label="Button text"
            value={asString(card.primary_cta_text)}
            onChange={(v) => onPatch({ primary_cta_text: v })}
            placeholder={primaryCtaPlaceholder}
          />
          <TextField
            label="URL"
            value={asString(card.primary_cta_url)}
            onChange={(v) => onPatch({ primary_cta_url: v })}
            placeholder={primaryUrlPlaceholder}
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
