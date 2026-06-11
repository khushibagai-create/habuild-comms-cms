import { EnrollCampFields } from './enroll-camp/Fields';
import { EnrollCampCard } from './enroll-camp/Card';
import { DailySessionFields } from './daily-session/Fields';
import { DailySessionCard } from './daily-session/Card';
import { RecordingFields } from './recording/Fields';
import { RecordingCard } from './recording/Card';
import { CertificateFields } from './certificate/Fields';
import { CertificateCard } from './certificate/Card';
import { ToolsFields } from './tools/Fields';
import { ToolsCard } from './tools/Card';
import { TodayFields } from './today/Fields';
import { TodayCard } from './today/Card';
import { MonthlyCalendarFields } from './monthly-calendar/Fields';
import { MonthlyCalendarCard } from './monthly-calendar/Card';
import { FeedbackFields } from './feedback/Fields';
import { FeedbackCard } from './feedback/Card';

import type { TemplateKey } from '../state/templates';
import type { TemplateFieldsComponent, TemplateCardComponent } from './types';

export type { FieldsProps, CardProps } from './types';

/* ============================================================
   Template registry — maps each template key to its Fields and
   Card components. Templates not yet built return `undefined`;
   the editor shell falls back to the generic block.
   ============================================================ */

export const TEMPLATE_FIELDS: Partial<Record<TemplateKey, TemplateFieldsComponent>> = {
  'enroll-camp': EnrollCampFields,
  'daily-update': DailySessionFields,
  recovery: RecordingFields,
  certificate: CertificateFields,
  tools: ToolsFields,
  today: TodayFields,
  'monthly-calendar': MonthlyCalendarFields,
  feedback: FeedbackFields,
};

export const TEMPLATE_CARDS: Partial<Record<TemplateKey, TemplateCardComponent>> = {
  'enroll-camp': EnrollCampCard,
  'daily-update': DailySessionCard,
  recovery: RecordingCard,
  certificate: CertificateCard,
  tools: ToolsCard,
  today: TodayCard,
  'monthly-calendar': MonthlyCalendarCard,
  feedback: FeedbackCard,
};

/* ============================================================
   Defaults — mirror newCard(template, cardIdx) in
   10-comms-cms.html. Each call returns a fresh card object so
   callers can push the result straight into state without
   worrying about shared references.

   For variation-aware templates, the count of cards (and the
   shape of each) depends on the variation. See
   getExpectedCardCount() for the count side of that contract.
   ============================================================ */

export function getDefaultCard(
  templateKey: TemplateKey,
  variation: string | undefined,
  cardIndex: number,
): Record<string, unknown> {
  switch (templateKey) {
    case 'enroll-camp':
      return defaultEnrollCampCard(variation, cardIndex);
    case 'daily-update':
      return defaultDailySessionCard(cardIndex);
    case 'recovery':
      return defaultRecordingCard();
    case 'certificate':
      return defaultCertificateCard(variation);
    case 'tools':
      return defaultToolsCard(cardIndex);
    case 'today':
      return defaultTodayCard(variation);
    case 'monthly-calendar':
      return defaultMonthlyCalendarCard();
    case 'feedback':
      return defaultFeedbackCard();
    default:
      return {};
  }
}

/* Number of default cards a template seeds when a new story starts.
   Mirrors the variation-aware adjustment inside initForm(template)
   in the source HTML. Defaults to the static cardCount on the
   template definition for non-variation templates. */
export function getExpectedCardCount(
  templateKey: TemplateKey,
  variation: string | undefined,
  fallback: number,
): number {
  if (templateKey === 'enroll-camp') {
    return variation === 'multi' ? 2 : 1;
  }
  if (templateKey === 'tools') return 2;
  if (templateKey === 'today') return 1;
  if (templateKey === 'monthly-calendar') return 1;
  if (templateKey === 'feedback') return 1;
  return Math.max(1, fallback);
}

/* ============================================================
   Per-template defaults (one-to-one with newCard() in HTML)
   ============================================================ */

function defaultEnrollCampCard(
  variation: string | undefined,
  cardIndex: number,
): Record<string, unknown> {
  const v = variation || 'single';

  if (v === 'single') {
    return {
      variation: 'single',
      info_pill: 'FREE EVENT',
      hero_image: '',
      expert_name: 'DR. SAURABH BOTHRA',
      title: 'International Yoga Day 2026',
      subtitle: 'Join Saurabh Bothra live for a one-hour global session.',
      event_date: '2026-06-21',
      event_time: '6:00 AM',
      program: 'International Yoga Day 2026',
      stat_time: '6 AM | 11 AM',
      stat_duration: '45 min',
      stat_program: '14 Days',
      focus_title: "Today's focus",
      focus_bullets: [],
      primary_cta_text: 'Register free',
      primary_cta_url: '',
      secondary_cta_text: '',
      secondary_cta_url: '',
    };
  }

  // Multi-day: card 0 = hero, card 1 = timeline.
  if (cardIndex === 0) {
    return {
      variation: 'multi',
      info_pill: '14 DAY PROGRAM',
      hero_image: '',
      expert_name: 'DR. SAURABH BOTHRA',
      title: 'A 14-day camp for Kids',
      subtitle:
        'Mornings of Yoga and activities, led by 5 experts. Age 6 to 14.',
      event_date: '2026-06-14',
      event_time: '6:00 AM',
      program: '14-day Kids Camp',
      stat_time: '6 AM | 11 AM',
      stat_duration: '45 min',
      stat_program: '14 Days',
      focus_title: "Today's focus",
      focus_bullets: [],
      primary_cta_text: 'Enroll Now',
      primary_cta_url: '',
      secondary_cta_text: '',
      secondary_cta_url: '',
    };
  }

  return {
    variation: 'multi',
    info_pill: 'PROGRAM PLAN',
    title: 'Title Goes Here',
    subtitle: 'Subtext goes here',
    timeline_rows: [
      { number: 1, title: 'Main Title', time_more_info: 'Time. More info' },
      { number: 2, title: 'Main Title', time_more_info: 'Time. More info' },
      { number: 3, title: 'Main Title', time_more_info: 'Time. More info' },
      { number: 4, title: 'Main Title', time_more_info: 'Time. More info' },
      { number: 5, title: 'Main Title', time_more_info: 'Time. More info' },
    ],
    primary_cta_text: 'Enroll Now',
    primary_cta_url: '',
  };
}

function defaultDailySessionCard(cardIndex: number): Record<string, unknown> {
  if (cardIndex === 0) {
    return {
      info_pill: 'DAY 3 OF 7',
      hero_image: '',
      title: 'Heart Opening Flow',
      subtitle: 'Open the chest and shoulders. A gentle 30-minute flow.',
      expert_name: 'DR. SAURABH BOTHRA',
      stat_time: '6 AM | 11 AM',
      stat_duration: '30 min',
      stat_program: 'Day 3 of 7',
      timing: '6 AM | 11 AM',
      focus_title: "Today's focus",
      focus_bullets: [
        '12 rounds of Surya Namaskar',
        'Heart opening backbends',
        'Pranayama for the lungs',
        'Cool down and rest',
      ],
      primary_cta_text: 'Join live session',
      primary_cta_url: '',
      secondary_cta_text: '',
      secondary_cta_url: '',
    };
  }
  return {
    heading: 'Why this matters',
    subheading:
      'Heart opening releases the upper-body tension we collect all day.',
    rich_bullets: [
      {
        heading: 'For your chest',
        subheading: 'Counters the slouch from sitting and screen time.',
      },
      {
        heading: 'For your shoulders',
        subheading: 'Eases the stiffness that builds up overnight.',
      },
      {
        heading: 'For your breath',
        subheading: 'Opens the lungs so each inhale feels deeper.',
      },
    ],
    primary_cta_text: 'Join live session',
    primary_cta_url: '',
  };
}

function defaultRecordingCard(): Record<string, unknown> {
  return {
    badge_text: 'RECORDING · 39 min',
    video_thumbnail: '',
    video_url: '',
    video_duration: '39 min',
    heading: 'Full Body Stretch',
    subheading: "You missed yesterday's morning session.",
    expert_name: 'DR. SAURABH BOTHRA',
    expiry_hours: 24,
    disclaimer: 'Available for 24 hours',
    focus_title: "Today's focus",
    focus_bullets: [],
    primary_cta_text: 'Watch recording',
    primary_cta_url: '',
    secondary_cta_text: '',
    secondary_cta_url: '',
  };
}

function defaultCertificateCard(
  variation: string | undefined,
): Record<string, unknown> {
  if (variation === 'resource') {
    return {
      variation: 'resource',
      certificate_image: '',
      pill_text: 'RECIPE BOOKLET',
      heading: 'Your Recipe Booklet is ready',
      subheading: '10 nutrition recipes from Yamini. Save and cook all year.',
      download_text: 'Download booklet',
      download_url: '',
      primary_cta_text: 'Share booklet',
      primary_cta_url: '',
    };
  }
  return {
    variation: 'certificate',
    certificate_image: '',
    pill_text: '14 DAY PROGRAM',
    heading: 'You finished Surya Namaskar',
    subheading:
      'All 5 days, all the rounds. Saurabh Bothra has a small thank-you for you.',
    download_text: 'Download certificate',
    download_url: '',
    primary_cta_text: 'Share My Certificate',
    primary_cta_url: '',
  };
}

/* Tools — 2-card stack. Card 1 = hero + banner + stats. Card 2 = How it works. */
function defaultToolsCard(cardIndex: number): Record<string, unknown> {
  if (cardIndex === 0) {
    return {
      banner_text: 'NEW · TOOL',
      hero_image: '',
      title: 'Create Everyday',
      subtitle:
        'A daily 60-second reflection your future self will thank you for.',
      stats: [
        { label: 'Daily', value: '60 SEC' },
        { label: 'Cost', value: 'FREE' },
      ],
      primary_cta_text: 'Try Create Everyday',
      primary_cta_url: '',
      secondary_link_text: 'Learn more',
      secondary_url: '',
    };
  }
  return {
    info_pill: 'HOW IT WORKS',
    title: 'How Create Everyday works',
    subtitle: 'Three taps and you are done.',
    rich_bullets: [
      {
        heading: 'Pick a prompt',
        subheading: 'A new reflection question every morning.',
      },
      {
        heading: 'Write in 60 seconds',
        subheading: 'Type or voice-note. Whatever feels easier.',
      },
      {
        heading: 'Look back anytime',
        subheading: 'Your entries become a private journal you can revisit.',
      },
    ],
    primary_cta_text: 'Try Create Everyday',
    primary_cta_url: '',
  };
}

/* Today — single-card poster with four variations.
   Mirrors newTodayCard(variation) in 10-comms-cms.html. Each variation has a
   fully self-contained shape so toggling never bleeds stale fields between
   variations. */
function defaultTodayCard(
  variation: string | undefined,
): Record<string, unknown> {
  const v = variation || 'poster';

  if (v === 'quiz') {
    return {
      variation: 'quiz',
      heading: 'Habit Everyday: Better Snack',
      subheading: 'A quick quiz from Yamini to start your day.',
      poster_label: 'Better Snack quiz',
      poster_image: '/today-template-refs/Habuild CRM Image (1).jpeg',
      quiz_question: 'Why can makhana be a better snack than biscuits?',
      quiz_options: [
        'It is lighter and less processed',
        'It is always more expensive',
        'It has more sugar',
      ],
      quiz_correct: 'A',
      quiz_hint_enabled: true,
      quiz_hint:
        'Think about how the snack is made. Less processed = gentler on energy.',
      quiz_correct_message:
        'Correct. Makhana is roasted, light, and low on processing.',
      quiz_wrong_message:
        'Not quite. Makhana wins because it is lighter and less processed.',
      cta: 'Share',
      secondary_cta_text: "Take today's quiz",
      secondary_cta_url: '/quiz',
      toastOnCta: 'Opening WhatsApp share sheet',
      toastOnSecondary: 'Opening the quiz screen',
    };
  }

  if (v === 'video') {
    return {
      variation: 'video',
      heading: '15 lakh people started their health journey in 7 days',
      subheading: 'Watch the story behind the community.',
      poster_label: 'Story of Habuild',
      poster_image: '/today-template-refs/Habuild CRM Image (3).jpeg',
      video_url: 'https://youtube.com/shorts/example',
      video_duration: '3 min',
      video_credit: 'News credit: The Better India',
      eyebrow: 'Story of Habuild · 3 min',
      cta: 'Watch',
      secondary_cta_text: 'Join 21-Day Yoga',
      secondary_cta_url: 'habit.yoga/anitarodrigues_ebi48',
      toastOnCta: 'Opening video player',
      toastOnSecondary: 'Opening the 21-Day Yoga signup',
    };
  }

  if (v === 'pdf') {
    return {
      variation: 'pdf',
      heading: 'Surya Namaskar Recipe Booklet',
      subheading: '10 nutrition recipes from Yamini. Save and cook all year.',
      poster_label: 'Recipe Booklet PDF',
      poster_image: '/today-template-refs/Habuild CRM Image (5).jpeg',
      pdf_url: 'https://habuild.in/booklets/surya-recipes.pdf',
      pdf_pages: '12 pages',
      cta: 'Download PDF',
      secondaryCta: 'Share PDF',
      secondaryCtaUrl: '',
      secondary_cta_text: '',
      secondary_cta_url: '',
      toastOnCta: 'Opening PDF download',
      toastOnSecondary: 'Opening WhatsApp share sheet',
    };
  }

  // Poster (default)
  return {
    variation: 'poster',
    heading: 'Health bhi rishton jaisi hai',
    subheading: 'Care for it and it cares for you.',
    poster_label: 'India Gate poster',
    poster_image: '/today-template-refs/Habuild CRM Image (8).jpeg',
    cta: 'Share',
    secondary_cta_text: 'Join 21-Day Yoga',
    secondary_cta_url: 'habit.yoga/anitarodrigues_ebi48',
    toastOnCta: 'Opening WhatsApp share sheet',
    toastOnSecondary: 'Opening the 21-Day Yoga signup',
  };
}

/* Monthly Calendar — single Story 2 card with header + event stack.
   Story 1 Overview was deliberately removed per Phase 4b spec. */
function defaultMonthlyCalendarCard(): Record<string, unknown> {
  return {
    info_pill: 'JUNE 2026',
    title: 'What is happening this month',
    subtitle: 'Workshops, expert series, and live events.',
    events: [
      {
        info_pill: 'WORKSHOP',
        date_start: '08',
        date_end: '12',
        month_label: 'JUN',
        title: 'Kids Camp Begins',
        sub: '10-days program for ages 6-12',
      },
      {
        info_pill: 'WORKSHOP',
        date_start: '14',
        date_end: '',
        month_label: 'JUN',
        title: 'Box Breathing 7-Day',
        sub: 'Calming breath practice',
      },
      {
        info_pill: 'WORKSHOP',
        date_start: '16',
        date_end: '',
        month_label: 'JUN',
        title: 'Surya Namaskar 5-Day',
        sub: 'Daily flow with Saurabh',
      },
      {
        info_pill: 'EVENT',
        date_start: '24',
        date_end: '28',
        month_label: 'JUN',
        title: 'International Yoga Day',
        sub: 'Live with 7 lakh+ members',
      },
    ],
  };
}

/* Feedback — single card with inline question stack + optional chat link. */
function defaultFeedbackCard(): Record<string, unknown> {
  return {
    info_pill: 'PROGRAM NAME',
    title: 'Your feedback shapes the session',
    subtitle: 'Takes 10 seconds only.',
    questions: [
      {
        text: 'How was the pace of 5 days?',
        type: 'single-select',
        options: ['Same', 'Good', 'Better'],
      },
      {
        text: 'What would you change?',
        type: 'multi-select',
        options: [
          'More breathing',
          'Shorter sessions',
          'Different time',
          'Nothing',
        ],
      },
    ],
    show_chat_link: true,
    chat_link_text: 'Chat with Us',
    chat_link_url: '',
    primary_cta_text: 'Submit Feedback',
    primary_cta_url: '',
  };
}
