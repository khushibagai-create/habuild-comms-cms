import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';

import { TEMPLATES, type TemplateKey } from './templates';
import type { PaletteKey } from './palettes';
import { getDefaultCard, getExpectedCardCount } from '../templates';

/* ============================================================
   Story state — Phase 2.
   Mirrors the global `state` / `STORIES` / `formState` objects in
   prototypes/comms-in-app/10-comms-cms.html, but kept loosely typed
   on the card-shape side. Phase 3 will tighten card schemas per
   template once the editor lands.
   ============================================================ */

export type View =
  | 'stories-list'
  | 'new-story-picker'
  | 'editor'
  | 'events'
  | 'templates-ref';

// Loose card shape for Phase 2. Each template will narrow this later.
export type StoryCard = Record<string, unknown>;

/* Settings block — schedule + audience + push. Lightweight on purpose; the
   source HTML keeps these as flat ids on a global formState. */
export type ScheduleMode = 'now' | 'later';
export type Audience = 'all' | 'event-enrolled' | 'plan-tier';

export type StorySettings = {
  scheduleMode: ScheduleMode;
  scheduleDate: string;
  scheduleTime: string;
  audience: Audience;
  pushEnabled: boolean;
  pushTitle: string;
  pushBody: string;
};

export const DEFAULT_SETTINGS: StorySettings = {
  scheduleMode: 'later',
  scheduleDate: '2026-06-12',
  scheduleTime: '06:30',
  audience: 'all',
  pushEnabled: true,
  pushTitle: '',
  pushBody: '',
};

export type CurrentStory = {
  templateKey: TemplateKey | null;
  paletteKey: PaletteKey;
  variation?: string;
  cards: StoryCard[];
  settings: StorySettings;
};

export type SavedStory = {
  id: string;
  templateKey: TemplateKey;
  paletteKey: PaletteKey;
  variation?: string;
  cards: StoryCard[];
  settings: StorySettings;
  updatedAt: number;
};

export type StoryState = {
  view: View;
  currentStory: CurrentStory;
  stories: SavedStory[];
};

const EMPTY_STORY: CurrentStory = {
  templateKey: null,
  paletteKey: 'blue',
  cards: [],
  settings: { ...DEFAULT_SETTINGS },
};

const INITIAL_STATE: StoryState = {
  view: 'stories-list',
  currentStory: EMPTY_STORY,
  stories: [],
};

/* ============================================================
   Actions
   ============================================================ */

export type StoryAction =
  | { type: 'SET_VIEW'; view: View }
  | { type: 'START_NEW_STORY'; templateKey: TemplateKey }
  | { type: 'SET_PALETTE'; paletteKey: PaletteKey }
  | { type: 'SET_VARIATION'; variation: string }
  | { type: 'UPDATE_CARD'; index: number; patch: Partial<StoryCard> }
  | { type: 'ADD_CARD' }
  | { type: 'REMOVE_CARD'; index: number }
  | { type: 'REORDER_CARDS'; from: number; to: number }
  | { type: 'SET_SETTINGS'; patch: Partial<StorySettings> }
  | { type: 'SAVE_STORY' }
  | { type: 'LOAD_STORY'; id: string };

function makeId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function blankCardsFor(
  templateKey: TemplateKey,
  variation: string | undefined,
): StoryCard[] {
  const def = TEMPLATES[templateKey];
  const count = getExpectedCardCount(templateKey, variation, def.cardCount);
  return Array.from({ length: count }, (_, i) =>
    getDefaultCard(templateKey, variation, i),
  );
}

function reducer(state: StoryState, action: StoryAction): StoryState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.view };

    case 'START_NEW_STORY': {
      const def = TEMPLATES[action.templateKey];
      const variation = def.defaultVariation;
      const next: CurrentStory = {
        templateKey: action.templateKey,
        paletteKey: 'blue',
        cards: blankCardsFor(action.templateKey, variation),
        settings: { ...DEFAULT_SETTINGS },
        ...(variation !== undefined ? { variation } : {}),
      };
      return { ...state, currentStory: next, view: 'editor' };
    }

    case 'SET_PALETTE':
      return {
        ...state,
        currentStory: { ...state.currentStory, paletteKey: action.paletteKey },
      };

    case 'SET_VARIATION': {
      // Variation can change the expected card count (e.g. enroll-camp
      // single -> multi adds a Story 2 timeline card). It can also reshape
      // a card's content entirely (e.g. Today poster <-> quiz <-> video).
      // Rule: if a card stores its own `variation` field that mismatches the
      // new variation, replace it with fresh defaults. Otherwise preserve.
      const cs = state.currentStory;
      if (!cs.templateKey) {
        return { ...state, currentStory: { ...cs, variation: action.variation } };
      }
      const def = TEMPLATES[cs.templateKey];
      const nextCount = getExpectedCardCount(
        cs.templateKey,
        action.variation,
        def.cardCount,
      );
      const seeded = Array.from({ length: nextCount }, (_, i) => {
        const existing = cs.cards[i];
        const existingVariation =
          existing && typeof existing.variation === 'string'
            ? existing.variation
            : undefined;
        const variationMismatch =
          existingVariation !== undefined && existingVariation !== action.variation;
        if (existing && Object.keys(existing).length > 0 && !variationMismatch) {
          return existing;
        }
        return getDefaultCard(cs.templateKey!, action.variation, i);
      });
      return {
        ...state,
        currentStory: { ...cs, variation: action.variation, cards: seeded },
      };
    }

    case 'UPDATE_CARD': {
      const cards = state.currentStory.cards.slice();
      const existing = cards[action.index] ?? {};
      cards[action.index] = { ...existing, ...action.patch };
      return {
        ...state,
        currentStory: { ...state.currentStory, cards },
      };
    }

    case 'ADD_CARD': {
      const cs = state.currentStory;
      const cards = cs.cards.slice();
      // For enroll-camp, "Add card" appends a More-details card — the only
      // template that supports user-added cards in the source HTML.
      const next: StoryCard =
        cs.templateKey === 'enroll-camp'
          ? {
              kind: 'more-details',
              info_pill: 'MORE DETAILS',
              title: 'What to expect',
              subtitle: 'A few extra things worth knowing.',
              timeline_rows: [
                { number: 1, title: 'Main Title', time_more_info: 'Time. More info' },
                { number: 2, title: 'Main Title', time_more_info: 'Time. More info' },
                { number: 3, title: 'Main Title', time_more_info: 'Time. More info' },
                { number: 4, title: 'Main Title', time_more_info: 'Time. More info' },
                { number: 5, title: 'Main Title', time_more_info: 'Time. More info' },
              ],
              primary_cta_text: 'Enroll Now',
              primary_cta_url: '',
            }
          : {};
      cards.push(next);
      return {
        ...state,
        currentStory: { ...cs, cards },
      };
    }

    case 'REMOVE_CARD': {
      if (state.currentStory.cards.length <= 1) return state;
      const cards = state.currentStory.cards.slice();
      cards.splice(action.index, 1);
      return {
        ...state,
        currentStory: { ...state.currentStory, cards },
      };
    }

    case 'REORDER_CARDS': {
      const { from, to } = action;
      const cards = state.currentStory.cards.slice();
      if (from < 0 || from >= cards.length || to < 0 || to >= cards.length) return state;
      const [moved] = cards.splice(from, 1);
      if (moved === undefined) return state;
      cards.splice(to, 0, moved);
      return {
        ...state,
        currentStory: { ...state.currentStory, cards },
      };
    }

    case 'SET_SETTINGS': {
      return {
        ...state,
        currentStory: {
          ...state.currentStory,
          settings: { ...state.currentStory.settings, ...action.patch },
        },
      };
    }

    case 'SAVE_STORY': {
      const cs = state.currentStory;
      if (!cs.templateKey) return state;
      const saved: SavedStory = {
        id: makeId(),
        templateKey: cs.templateKey,
        paletteKey: cs.paletteKey,
        cards: cs.cards,
        settings: { ...cs.settings },
        updatedAt: Date.now(),
        ...(cs.variation !== undefined ? { variation: cs.variation } : {}),
      };
      return {
        ...state,
        stories: [saved, ...state.stories],
        view: 'stories-list',
        currentStory: { ...EMPTY_STORY, settings: { ...DEFAULT_SETTINGS } },
      };
    }

    case 'LOAD_STORY': {
      const found = state.stories.find((s) => s.id === action.id);
      if (!found) return state;
      const loaded: CurrentStory = {
        templateKey: found.templateKey,
        paletteKey: found.paletteKey,
        cards: found.cards.map((c) => ({ ...c })),
        settings: { ...found.settings },
        ...(found.variation !== undefined ? { variation: found.variation } : {}),
      };
      return { ...state, currentStory: loaded, view: 'editor' };
    }

    default:
      return state;
  }
}

/* ============================================================
   Context + hook
   ============================================================ */

type StoryContextValue = {
  state: StoryState;
  dispatch: Dispatch<StoryAction>;
};

const StoryContext = createContext<StoryContextValue | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const value = useMemo<StoryContextValue>(() => ({ state, dispatch }), [state]);
  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export function useStory(): StoryContextValue {
  const ctx = useContext(StoryContext);
  if (!ctx) {
    throw new Error('useStory must be used inside <StoryProvider>');
  }
  return ctx;
}
