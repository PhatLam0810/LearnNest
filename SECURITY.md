# LearnNest FE — security notes

What's actually implemented, what's already been fixed, and what to check
before touching auth or user-generated content. Grounded in what's been
read/verified in this codebase.

## Auth

- Login/signup/OAuth all go through RTK Query (`authQuery`), which uses a
  shared `baseQuery` that attaches the `Authorization: Bearer <token>`
  header automatically. **This is the reason every API call must go
  through RTK Query and never a standalone `axios`/`fetch` call** — a raw
  call silently skips auth and either fails with 401 or (worse, for a
  route that shouldn't be public) succeeds without it. A raw
  `axios.post()` missing this exact header was a real bug found and fixed
  this project (in a component later found to be dead code and removed).
- Token/session state is held in Redux and persisted via `redux-persist`
  (`authReducer.tokenInfo`), which by default persists to the browser's
  `localStorage`. That means a successful XSS on this app can read the
  JWT — the standard tradeoff of client-side token storage. Sanitizing
  any HTML rendered from user input (see tiptap note below) is the actual
  mitigation, not the storage mechanism.

## Fixed vulnerabilities

- **`@tiptap/*` v2 → v3 upgrade** (prototype-pollution CVE via `__proto__`
  in `mergeAttributes()`). Found via `yarn audit`, confirmed patched by
  re-running `yarn audit` after the upgrade. If a new rich-text feature is
  added, keep `@tiptap/*` on a version past this fix.
- **YouTube API key removed from the client bundle.** The duration lookup
  used to call the YouTube API directly from the browser with a
  `NEXT_PUBLIC_` key; it's now proxied through the BE
  (`library.service.ts`'s `getYoutubeDuration`) so the key never ships to
  the client. Don't reintroduce a `NEXT_PUBLIC_*_API_KEY` for a
  third-party service that has a quota/cost attached — proxy it
  server-side instead.

## Headers (`next.config.ts`)

Applied to every route: `X-Frame-Options: SAMEORIGIN` +
`Content-Security-Policy: frame-ancestors 'self'` (clickjacking),
`X-Content-Type-Options: nosniff`, `Referrer-Policy:
strict-origin-when-cross-origin`, and a `Permissions-Policy` disabling
camera/microphone/geolocation (none of which this app uses). HSTS is
handled by Vercel at the edge, not set here.

## Firebase

Firebase client config (`apiKey` etc., via `NEXT_PUBLIC_*`) is expected to
be public — Firebase's security model restricts access via
project/console rules, not by keeping the key secret. Don't treat a
Firebase client key as a secret that needs server-side proxying (unlike
the YouTube key above, which _was_ quota/cost-sensitive).

## User-generated content

Rich text (lesson content, comments) goes through `tiptap`. If you add a
new place that renders stored HTML (as opposed to tiptap's own editor
output), verify it's sanitized before rendering — don't assume content
already in the database is safe just because it came from an authenticated
user.

## Before adding a new API call or auth-adjacent feature

1. Go through RTK Query (`adminQuery`/`dashboardQuery`/`authQuery`), never
   a standalone `axios`/`fetch` — this is what gets you the auth header
   for free and keeps request caching consistent (see
   [CLAUDE.md](CLAUDE.md)).
2. Never add a `NEXT_PUBLIC_*` env var for a key that has cost or quota
   attached to it — proxy through the BE instead.
3. If it renders HTML from user input, sanitize it — don't assume it's
   safe because tiptap produced it originally.
