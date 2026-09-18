# LearnNest FE — orientation

Next.js frontend for LearnNest. Read this before making changes — it
captures real gotchas found the hard way in this project, not theory.

## Stack

- **Next.js 15, App Router.**
- **State/data**: Redux Toolkit + **RTK Query** (`src/redux/RTKQuery` +
  per-module `redux/RTKQuery` — `adminQuery` / `dashboardQuery` /
  `authQuery`). This is the _only_ API-calling layer — no raw `axios`/
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
  even a named re-export) that includes a file with a _side-effect
  import_ (`import './styles.css'`, Firebase init code, etc.) drags that
  side effect into every route that imports _anything_ from the barrel —
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
  - **CSS shorthand _strings_ (`padding: '0 28px'`, `border: '1px solid
#hex'`, `borderBottom: '...'`) are silently dropped by
    react-native-web's production style extraction — but work fine in
    `next dev`.** This is the most dangerous of the four: it passes
    `tsc`, passes `next build`, and looks correct when you test it with
    `next dev` in the browser. It only breaks in the actual deployed
    build (confirmed by reproducing locally with `next build && next
start` — same style, `padding: '0 28px'` computes to `0px` in the
    real production bundle, `paddingRight: 28, paddingLeft: 28` computes
    correctly). **Always use the longhand numeric properties**
    (`paddingTop`/`paddingRight`/`paddingBottom`/`paddingLeft`,
    `borderTopWidth`/`borderTopStyle`/`borderTopColor`, etc.), never a
    combined shorthand string, in any `styles.ts` in this repo. ~35
    existing `styles.ts` files use the shorthand-string form and have not
    been individually re-verified against a real production build — don't
    assume a screen is fine just because it looks right in `next dev`.
  - All four of the above shipped as real, visually broken (or silently
    broken) bugs in this project before being caught — always visually
    verify a new screen **against a real `next build && next start`, not
    just `next dev`**, before calling a UI change done.
- **Phantom dependencies happen here too.** `lucide-react` and `redux`
  were both used at runtime (one directly, one by a dependency's own
  source) without being declared in `package.json` — only "worked" via
  yarn's flat-hoisting from an unrelated package. Removing that unrelated
  package breaks the phantom dependency with no warning until runtime.
  Before removing a dependency, grep the codebase for direct imports of
  it _and_ check whether anything else's `node_modules` requires it
  internally (the second case only shows up by actually running the app).
- **Next.js dev server (Turbopack) + `.next` cache from a `next build`
  run collide.** Running `next build` (production) then starting `next
dev` against the same `.next` directory produces stale/corrupted
  behavior (a page that should render correctly instead silently
  redirects or 404s). Fix: stop the dev server, `rm -rf .next`, restart.

## Verify-before-done standard

**Run `yarn build` — not a manual `next build`.** The `build` script in
`package.json` is `yarn type-check && yarn format:check && next build`;
running `next build` alone skips the format check, which is exactly what
production's own build runs (Vercel calls `yarn build`, not `next build`).
A commit that passes a bare `next build` locally can still fail Vercel's
real build — this happened for real: `UI-UX.md` wasn't Prettier-formatted,
`next build` alone didn't catch it, and the Vercel deploy failed on
`format:check` while local testing looked fine. Before pushing:

```bash
yarn format   # prettier --write . — fixes formatting, run this first
yarn build    # type-check && format:check && next build — must be clean
```

And **always visually verify in the browser against a real `next build &&
next start`** (desktop _and_ mobile width) before calling a UI change
done — `yarn build` passing proves the code compiles, it does not prove
the layout is correct, and **`next dev` is not a reliable stand-in for
production** (see the shorthand-string gotcha above — it only breaks in
the real production build).

## See also

- [UI-UX.md](UI-UX.md) — mandatory UI conventions (typography, color,
  spacing, components, accessibility).
- [SECURITY.md](SECURITY.md) — auth flow, what's already protected, known
  gaps.
