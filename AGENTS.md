# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

ChravelApp (TripSync) is a collaborative group travel planning SPA built with React 18, TypeScript, Vite 5, shadcn/ui, and Tailwind CSS. The app has three tiers: My Trips (consumer), Pro (professional/organizational), and Events (large-scale event management).

**Branch differences:** The `main` branch has the full product with real Supabase auth, a marketing landing page, and a rich demo mode. Feature branches (e.g. `a9nd0i-codex/...`) may have simplified mock auth that auto-logs in. Always check which branch you're on.

### Running services

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on port **8080** |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | ESLint (flat config, `eslint.config.js`) |
| `npx vitest run` | Unit tests with Vitest + jsdom |

### Demo mode (main branch)

On `main`, the app starts with a marketing landing page. To enter the full app-preview demo mode without Supabase credentials:

1. Open browser DevTools console.
2. Run: `localStorage.setItem('TRIPS_DEMO_VIEW', 'app-preview')`
3. Refresh the page.

This bypasses auth and loads a "Demo User" with access to all three tiers (My Trips, Pro, Events). An "Exit Demo" button appears in the top-right corner to return to the marketing/auth flow.

Some tabs (Calendar, Concierge, Places, Media) will show loading spinners because they attempt to fetch from Supabase, which is not available without a connected project. Chat and Agenda tabs work with mock data.

### Gotchas

- **`npm install` requires `--legacy-peer-deps`** because `react-leaflet@5` declares a peer dependency on React 19, while the project uses React 18. Without this flag, `npm install` fails with `ERESOLVE`.
- **`jsdom` is an implicit test dependency** — it is required by vitest's `environment: 'jsdom'` setting in `vitest.config.ts` but is not listed in `package.json`. Install it with `npm install --save-dev jsdom --legacy-peer-deps` if tests fail with "Cannot find dependency 'jsdom'".
- **Vitest tests currently fail** on the base feature branch due to a missing path alias — `vitest.config.ts` does not include the `resolve.alias` for `@` → `./src` that `vite.config.ts` has. This is a pre-existing repo issue on that branch, not an environment problem.
- **ESLint reports pre-existing errors** (mostly `@typescript-eslint/no-explicit-any`). These are not caused by environment setup.
- **Auth differs by branch** — on `main`, real Supabase auth is used (use demo mode above). On feature branches, `useAuth.tsx` may auto-log in with a mock user.
- **Supabase edge functions** exist under `supabase/functions/` but are optional. They require API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`) if you want to run them.
- **`emoji-mart` is a missing dependency on `main`** — if `npm run build` fails with a rollup resolve error for `emoji-mart`, install it: `npm install emoji-mart --legacy-peer-deps`.
