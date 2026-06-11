# Habuild Comms CMS (React)

React + TypeScript + Vite port of the comms-in-app story CMS prototype.
Source HTML lives at `../10-comms-cms.html`.

## Setup

```bash
cd /Users/khushibagai/Documents/Habuild/prototypes/comms-in-app/cms-react
npm install
npm run dev
```

Opens at http://localhost:5173

## Scripts

- `npm run dev` — Vite dev server with HMR
- `npm run build` — Type-check and build to `dist/`
- `npm run preview` — Preview the production build locally
- `npm run typecheck` — TypeScript check only

## Project layout

```
src/
  components/   Shared UI primitives (Button, Input, Select, Dropzone, ...)
  templates/    One folder per story template (today/, program-announcement/, ...)
  layout/       Sidebar, Header, Breadcrumbs
  state/        Form state, story state, template registry, palettes
  lib/          Helpers (escapeHtml, formatDate, palette resolver, ...)
  styles/       Global CSS + design tokens
  App.tsx       Top-level shell
  main.tsx      React entry
```

## Conversion phases

- **Phase 1 (this scaffold)** — Vite + React + TS, design tokens, palette + template registry, empty layout shell.
- **Phase 2** — Sidebar, topbar, breadcrumbs, story state, template picker.
- **Phase 3+** — Port templates one by one from the source HTML.

## Rules

- React 18 (not 19) for stability.
- TypeScript strict mode.
- No em dashes, no emojis in UI.
- "Habuild" not "HaBuild", "members" not "users", "sessions" not "classes".
