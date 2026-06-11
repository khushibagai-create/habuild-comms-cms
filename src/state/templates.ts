/**
 * Story template registry.
 * Mirrors the TEMPLATES object in prototypes/comms-in-app/10-comms-cms.html.
 *
 * - `today` is the pinned poster template (always rendered first in the feed).
 * - All other templates render in the card-stack format.
 * - `avAccent` is the avatar / hero accent shown in the CMS sidebar.
 * - `variations` is present only on templates that have multiple sub-formats
 *   the editor picks between (single vs. multi card, certificate vs. resource).
 */

export type TemplateFormat = 'poster' | 'card-stack';

export type TemplateDef = {
  label: string;
  cardCount: number;
  format: TemplateFormat;
  avAccent: string;
  pinned?: boolean;
  variations?: readonly string[];
  defaultVariation?: string;
};

const TEMPLATE_DEFS = {
  today: {
    label: 'Today',
    cardCount: 1,
    format: 'poster',
    avAccent: '#9A6009',
    pinned: true,
    variations: ['poster', 'quiz', 'video', 'pdf'],
    defaultVariation: 'poster',
  },
  'enroll-camp': {
    label: 'Program Announcement',
    cardCount: 1,
    format: 'card-stack',
    avAccent: '#0EA5E9',
    variations: ['single', 'multi'],
    defaultVariation: 'single',
  },
  'daily-update': {
    label: 'Daily Session',
    cardCount: 2,
    format: 'card-stack',
    avAccent: '#10B981',
  },
  recovery: {
    label: 'Recording',
    cardCount: 1,
    format: 'card-stack',
    avAccent: '#475569',
  },
  certificate: {
    label: 'Certificate / Resources',
    cardCount: 1,
    format: 'card-stack',
    avAccent: '#9A6009',
    variations: ['certificate', 'resource'],
    defaultVariation: 'certificate',
  },
  tools: {
    label: 'Tools',
    cardCount: 2,
    format: 'card-stack',
    avAccent: '#0EA5E9',
  },
  'monthly-calendar': {
    label: 'Monthly Calendar',
    cardCount: 1,
    format: 'card-stack',
    avAccent: '#5EA123',
  },
  feedback: {
    label: 'Feedback',
    cardCount: 1,
    format: 'card-stack',
    avAccent: '#7C3AED',
  },
} as const satisfies Record<string, TemplateDef>;

export type TemplateKey = keyof typeof TEMPLATE_DEFS;

// Widen value type so optional fields (pinned, variations, defaultVariation)
// are accessible on every entry without TS narrowing them away. The literal
// key set is preserved for TemplateKey.
export const TEMPLATES: Record<TemplateKey, TemplateDef> = TEMPLATE_DEFS;

export const TEMPLATE_KEYS = Object.keys(TEMPLATES) as TemplateKey[];

export function getTemplate(key: TemplateKey): TemplateDef {
  return TEMPLATES[key];
}
