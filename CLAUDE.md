# LearnNest FE — orientation

Next.js frontend for LearnNest. Read this before making changes — it
captures real gotchas found the hard way in this project, not theory.

## Stack

- **Next.js 15, App Router.**
- **State/data**: Redux Toolkit + **RTK Query** (`src/redux/RTKQuery` +
  per-module `redux/RTKQuery` — `adminQuery` / `dashboardQuery` /
  `authQuery`). This is the *only* API-calling layer — no raw `axios`/
  `fetch` in components, no `useEffect` + `useState` data fetching. If you
  find one, it's leftover from before the RTK Query migration; move it
  over rather than adding a new instance of the old pattern.
- **Styling**: see [UI-UX.md](UI-UX.md) — `react-native-web` +
  `StyleSheet.create` in co-located `styles.ts`, typography/color/spacing
  tokens, no Tailwind. That doc is the source of truth for anything
  visual; don't duplicate its rules here.
- **Error tracking**: Sentry (`@sentry/nextjs`), initialized in
  `src/instrumentation.ts` (server) and `src/instrumentation-client.ts`
  (client) — the current App Router convention, not the older
  `sentry.*.config.ts` files.
- **Deploy**: Vercel, auto-deploys on push to `main` — no custom pipeline
  like the BE repo has. Nothing to run manually.

## Gotchas that have caused real bugs here

- **Barrel-file tree-shaking trap.** A barrel (`export * from './x'` or
  even a named re-export) that includes a file with a *side-effect
  import* (`import './styles.css'`, Firebase init code, etc.) drags that
  side effect into every route that imports *anything* from the barrel —
  the bundler can't prove the side effect is safe to skip. This shipped
  twice: `@utils` re-exporting `./firebase` pulled the Firebase Auth SDK
  into unrelated lesson-viewing pages; `components/(Form)/index.ts`
  re-exporting `AppRichTextInput` (which imports a CSS file) pulled
  `@tiptap/*` + `@floating-ui` into every page using the much more common
  `AppInput` from the same barrel. **Fix pattern**: import the
  side-effecting file directly from its own path
  (`@components/(Form)/AppRichTextInput`), not through the barrel, and
  remove it from the barrel's exports with a comment explaining why.
- **react-native-web is not CSS** — it mirrors React Native semantics,
  which differ from web CSS defaults in ways that silently break layout:
  - `lineHeight` is an **absolute pixel number**, not a multiplier.
    `lineHeight: 1.5` renders as `1.5px` and collapses the text box. See
    [UI-UX.md §1](UI-UX.md#1-typography--100-mandatory) for the
    conversion table.
  - `flexDirection` defaults to **`'column'`**, not CSS's `'row'`. Any
    `display: 'flex'` container with 2+ children laid out side-by-side
    needs `flexDirection: 'row'` stated explicitly, or they silently
    stack.
  - Mixing the `border: '1px solid #hex'` shorthand as a base style with
    a separate `borderColor` override (e.g. for a hover state) can leave
    the border color stuck on the browser's default (black) after the
    override stops applying. Declare `borderWidth`/`borderStyle`/
    `borderColor` as three separate properties if any of them varies
    conditionally.
  - All three of the above shipped as real, visually broken bugs in this
    project before being caught — always visually verify a new screen in
    the browser, don't trust a clean `tsc`/build alone.
- **Phantom dependencies happen here too.** `lucide-react` and `redux`
  were both used at runtime (one directly, one by a dependency's own
  source) without being declared in `package.json` — only "worked" via
  yarn's flat-hoisting from an unrelated package. Removing that unrelated
  package breaks the phantom dependency with no warning until runtime.
  Before removing a dependency, grep the codebase for direct imports of
  it *and* check whether anything else's `node_modules` requires it
  internally (the second case only shows up by actually running the app).
- **Next.js dev server (Turbopack) + `.next` cache from a `next build`
  run collide.** Running `next build` (production) then starting `next
  dev` against the same `.next` directory produces stale/corrupted
  behavior (a page that should render correctly instead silently
  redirects or 404s). Fix: stop the dev server, `rm -rf .next`, restart.

## Verify-before-done standard

`npx tsc --noEmit` clean + `npx prettier --check .` clean + `npx next
build` clean, **and** an actual look in the browser (desktop *and*
mobile width) before calling a UI change done. A clean build does not
catch a layout bug, a stale-cache artifact, or a runtime-only crash.

## See also

- [UI-UX.md](UI-UX.md) — mandatory UI conventions (typography, color,
  spacing, components, accessibility).
- [SECURITY.md](SECURITY.md) — auth flow, what's already protected, known
  gaps.
