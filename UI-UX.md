# LearnNest UI/UX Conventions

Mandatory reference for any UI change in this repo. If a rule here conflicts
with what's already on screen, the existing screen is legacy — follow this
doc for new/changed code, don't copy the old pattern forward.

## 0. Stack

- **Next.js App Router.**
- **Styling:** `react-native-web` primitives (`View`, `Text`, `Image`, ...)
  styled via `StyleSheet.create({...})` in a co-located `styles.ts`, applied
  with `style={styles.x}`. **No Tailwind. No new CSS Modules. No new rules
  in `src/app/global.scss`** (see §11 for why `global.scss` is legacy and
  must not be extended).
- **Controls:** prefer `antd` wrapped by this repo's own components —
  `AppButton`, `AppInput` (both exported from `@components`) — over raw
  `antd` or a new custom control.
- **Brand color:** always through the CSS vars in
  `src/styles/variables.css` (`var(--color-vhu-primary)` etc.), never a
  literal hex for a brand color.

## 1. Typography — 100% mandatory

Import from `@styles` and spread a token; never write `fontSize` /
`fontWeight` / `fontFamily` literals in a component's `styles.ts`.

```ts
import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  title: { ...typography.titleM, color: 'var(--color-text-primary)' },
});
```

If no existing token fits, **add a new token to
`src/styles/typography/index.ts` first**, then use it — don't hardcode.

### Desktop tokens (`typography.*`)

| Token         | Size (px) | Weight | Use for                              |
| ------------- | --------- | ------ | ------------------------------------ |
| `titleM`      | 22.78     | 500    | Page / section main heading          |
| `titleS`      | 20.25     | 400    | Sub-heading, card title              |
| `titleSM`     | 14        | 400    | Small heading, compact card title    |
| `subTitle1`   | 16.4      | 500    | Emphasized label, list item title    |
| `subTitle2`   | 14        | 500    | Table header text, secondary label   |
| `body1`       | 16        | 400    | Primary paragraph / description text |
| `body2`       | 14        | 400    | Secondary text, table cell text      |
| `caption`     | 12        | 400    | Meta text, timestamps, tag text      |
| `button`      | 16        | 500    | Primary button label                 |
| `buttonSmall` | 14        | 500    | Compact button label                 |

### Mobile tokens — only inside an `isMobile` branch

| Token          | Size (px) | Weight |
| -------------- | --------- | ------ |
| `titleMMobile` | 18        | 500    |
| `body1Mobile`  | 14        | 400    |
| `body2Mobile`  | 12        | 400    |
| `buttonMobile` | 14        | 500    |

### Line-height (not part of the token — set explicitly, as absolute px)

`react-native-web` treats `lineHeight` as an **absolute pixel number**
(React Native semantics), _not_ a CSS multiplier. Writing `lineHeight: 1.5`
renders as `line-height: 1.5px` and collapses the text box — this is a real
bug that shipped once (see §11). Always compute it: `fontSize × ratio`,
rounded.

| Content type              | Ratio | Example (fontSize 16) |
| ------------------------- | ----- | --------------------- |
| Heading                   | 1.3   | `lineHeight: 21`      |
| UI text (labels, buttons) | 1.5   | `lineHeight: 24`      |
| Long-form paragraph       | 1.75  | `lineHeight: 28`      |

### Fonts

- **Lexend** — all UI text (body, labels, buttons, headings). Loaded via
  `next/font/google` in `src/styles/typography/index.ts`; use
  `lexend.style.fontFamily` through the `typography.*` tokens, don't
  reference the font name as a raw string.
- **Ground Zero** — display/marketing use only (landing page hero, not
  dashboard UI). Declared in `global.scss` only.
- Do not add another font family.

## 2. Color — tokens only

All tokens live in `src/styles/variables.css` (already extended with this
doc). Reference them as CSS var strings: `color: 'var(--color-text-primary)'`.

```css
:root {
  /* Brand */
  --color-vhu-primary: #1d418a;
  --color-vhu-primary-hover: #15316b;
  --color-vhu-secondary: #f0c356;
  --color-vhu-accent: #88c1e9;

  /* Text */
  --color-text-primary: #111827;
  --color-text-body: #374151;
  --color-text-muted: #6b7280;
  --color-text-disabled: #9ca3af;
  --color-text-on-primary: #fff;

  /* Surface */
  --color-surface: #fff;
  --color-surface-page: #f5f7fb;
  --color-surface-subtle: #f7f9fc;
  --color-surface-selected: #f1f5fb;

  /* Border */
  --color-border: #e5e9f0;
  --color-border-strong: #d9e2ef;
  --color-border-subtle: #f1f3f7;
  --color-border-focus: #88c1e9;

  /* Table */
  --color-table-header-bg: var(--color-vhu-primary);
  --color-table-header-text: #fff;
  --color-table-row-hover: #f7f9fc;
  --color-table-row-border: #f1f3f7;

  /* State */
  --color-success: #16a34a;
  --color-success-bg: #e9f9ef;
  --color-warning: #b45309;
  --color-warning-bg: #fef3e2;
  --color-error: #dc2626;
  --color-error-bg: #fdecec;
  --color-info: #1d418a;
  --color-info-bg: #eef3fb;
}
```

Rules:

- **Zero hex literals in any `styles.ts`.** Need a new shade → add a token
  to `variables.css`, don't inline `rgba()`/hex.
- `--color-vhu-secondary` (gold, `#f0c356`) is an **accent**, never body
  text color on a white surface (fails contrast — see §10).
- `global.scss` defines its _own_, older `:root` block (`--color-primary`,
  `--color-text-dark`, ...) with **different values** from the tokens
  above. That block is legacy — do not read from it or extend it; use only
  the `--color-vhu-*` / `--color-text-*` / `--color-surface-*` /
  `--color-border-*` / `--color-table-*` / state tokens in this section.

## 3. Spacing — 4px scale

Only these values are allowed: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64**.
Anything else (13, 14, 15, 18, 22, 26, 28, ...) is a bug.

| Context                     | Value            |
| --------------------------- | ---------------- |
| Page padding                | 24 / 32 / 48     |
| Card padding                | 24 (compact: 16) |
| Gap inside a card           | 16               |
| Gap between sections        | 20               |
| Gap at page level           | 24               |
| Label → input gap           | 8                |
| Form grid gap               | 16               |
| Button row gap              | 12               |
| Chip / tag internal padding | 8                |
| Table cell padding          | 16 / 20          |
| Modal header padding        | 24 / 28          |
| Modal body padding          | 24 / 28 / 28     |
| List row padding            | 16 / 20          |

- Use `display: flex` or `grid` + `gap` for spacing between siblings.
  `margin` is only for pulling something out of normal flow (e.g.
  `marginTop: 'auto'` to push a footer down) — not for spacing a list.
- **Never write `padding`/`border`/`borderTop`/etc. as a combined
  shorthand string** (`padding: '0 28px'`, `border: '1px solid #hex'`).
  react-native-web's production build silently drops these — they render
  fine in `next dev` and pass `tsc`/`next build`, then compute to `0` (no
  padding/border at all) in the real deployed app. This shipped as a real
  bug. Always use the longhand numeric/single-value properties:
  `paddingTop`/`paddingRight`/`paddingBottom`/`paddingLeft`,
  `borderTopWidth`/`borderTopStyle`/`borderTopColor`, etc.

### Radius

| Element                | Radius |
| ---------------------- | ------ |
| Tag                    | 6      |
| Control (input/button) | 8      |
| Card                   | 12     |
| Modal                  | 14     |
| Pill                   | 999    |

### Shadow — exactly 2 allowed values

```
0 6px 18px rgba(17, 24, 39, 0.08)   /* resting elevation: card, dropdown */
0 10px 26px rgba(17, 24, 39, 0.10)  /* raised elevation: modal, popover */
```

## 4. Responsive

Use `useResponsive()` from `src/styles/responsive.ts`. **Never**
`window.innerWidth` directly (SSR-unsafe, and duplicates this hook).

```ts
import { useResponsive } from '@/styles/responsive';
const { isMobile, isTablet, isDesktop } = useResponsive();
```

Fixed breakpoints: `isMobile` < 600px, `isTablet` 600–1023px, `isDesktop`
≥ 1024px.

| Aspect        | Desktop        | Tablet                  | Mobile            |
| ------------- | -------------- | ----------------------- | ----------------- |
| Page padding  | 48             | 32                      | 16–24             |
| Grid columns  | 3              | 2                       | 1                 |
| 2-pane layout | side-by-side   | side-by-side (narrower) | stacked           |
| Sidebar       | fixed, visible | collapsible             | drawer            |
| Table         | full table     | full table (scrolls)    | card list per row |
| Typography    | desktop tokens | desktop tokens          | `*Mobile` tokens  |
| Tap target    | ≥ 36px         | ≥ 40px                  | ≥ 44px            |

Never hide meaningfully content on mobile — stack it or collapse it into a
disclosure (accordion/drawer), don't drop it.

## 5. Component folder structure

```
<ComponentName>/
  index.tsx     # default export, React.FC
  styles.ts     # StyleSheet.create, co-located
  types.ts      # component-local prop/data types, no `any`
```

One component per folder. Always re-export the default from the module's
top-level `index.ts` barrel:

```ts
// src/modules/<module>/components/index.ts
export { default as ComponentName } from './ComponentName';
```

Data fetching (RTK Query hooks, etc.) belongs in `redux/RTKQuery`, not
inside the presentational component. Type every prop explicitly; `any` is
not allowed.

## 6. Tables

- Header: **always** `backgroundColor: 'var(--color-table-header-bg)'`,
  text white, `...typography.subTitle2` at `fontWeight: '600'`. This
  applies to every table — no gray/default antd headers.
- Container: `borderRadius: 12`, `border: '1px solid var(--color-border)'`.
- Row: padding 16/20; hover → `var(--color-table-row-hover)`.
- Cell text: `...typography.body2`. Numeric columns right-aligned. Long
  text: `ellipsis` + a `title` attribute holding the full value.
- Status tag: `...typography.caption` at weight 500, padding `4px 10px`,
  `borderRadius: 6`, color pair from the matching state token
  (`--color-success`/`--color-success-bg`, etc.).
- Action column: right-aligned, button `height: 32`.
- Empty table: replace the row area with an empty state (§9) — never leave
  a table showing only its header with nothing below.

## 7. Modal

```tsx
<Modal footer={null} closable={false} styles={{ body: { padding: 0 } }} ...>
```

| Purpose | Width |
| ------- | ----- |
| Confirm | 520   |
| Detail  | 720   |
| Editor  | 1120  |

- Shell: `borderRadius: 14`, `overflow: 'hidden'`, `display: 'flex',
flexDirection: 'column'`.
- Header: padding `24/28`, row, `justifyContent: 'space-between'`,
  `gap: 20`. If the header background is brand color, title is
  `...typography.titleS` in white, subline in `rgba(255,255,255,0.72)`.
- Body: padding `24/28/28`, column, `gap: 24`.
- Header and body are **sibling blocks in normal flow** — never
  `position: 'absolute'` one over the other.
- Destructive confirm (delete, etc.): use `--color-error`, and state the
  consequence in the body text (what exactly gets deleted, is it
  reversible).

## 8. Forms

- Label always visible (`...typography.subTitle2`, `gap: 8` to the
  control) — no placeholder-as-label.
- Control height: `48` (dense: `44`), `borderRadius: 8`.
- Required field: red `*` next to the label.
- Focus: border → `var(--color-border-focus)`. Never remove the focus
  ring/outline.
- Validation error: shown under the field, `...typography.caption` in
  `var(--color-error)`. **Never `alert()`.** `message`/toast is for success
  confirmations only, not field-level errors.
- Validate on blur _and_ on submit.
- Submit button: `disabled` + `loading` while the request is in flight.
- Bulk-entry tables (many rows of inputs): every row needs a **stable
  `key`** (a real id, not array index) or inputs lose focus while typing.

## 9. Empty / loading / error states

Every screen that renders fetched data needs all four states covered:
loading, populated, empty, error.

- **Loading:** a skeleton matching the real layout — not a spinner
  centered in an otherwise blank page.
- **Empty:** padding `44/20`, centered, `...typography.body2` in
  `var(--color-text-disabled)`, plus the primary action to resolve it
  (e.g. "Tạo khóa học mới").
- **Filtered-empty** (a search/filter returned nothing): distinct copy
  naming the active filter, with a "Xóa bộ lọc" action — don't reuse the
  generic empty copy.
- **Error:** a panel on `var(--color-error-bg)` with a "Thử lại" retry
  action.
- Never ship a bare "Không có dữ liệu." with no context or action.

## 10. Accessibility

- Contrast ≥ 4.5:1 for normal text, ≥ 3:1 for text ≥ 20px. Never use
  `--color-text-disabled` for primary content.
- Every clickable element is ≥ 36px (desktop) / ≥ 44px (mobile) **and is a
  real `button` or `a`** — a bare `div`/`View` with `onClick` is a bug (see
  §11; this pattern already exists in ~60 files in this repo and is a known
  gap, don't add more of it).
- Icon-only controls need `aria-label`; purely decorative icons need
  `aria-hidden`.
- Modals: move focus into the modal on open, `Esc` closes it, focus
  returns to the trigger element on close.
- Never convey state (error, selected, disabled) by color alone — pair it
  with an icon, label, or text change.

## 11. Right vs wrong

```tsx
// ❌ Wrong
<View style={{ padding: 18, backgroundColor: '#ffffff', borderRadius: 10 }}>
  <Text style={{ fontSize: 13, color: '#8D8D8D' }}>Khóa học Word</Text>
</View>

// ✅ Right
<View style={styles.card}>
  <Text style={styles.cardLabel}>Khóa học Word</Text>
</View>

// styles.ts
const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
  },
  cardLabel: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
});
```

Common mistakes found by scanning all 89 `styles.ts` files in this repo —
fix pattern for each, don't repeat it in new code:

| Mistake                                                                                 | Found (count) | Fix                                                                                                            |
| --------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------- |
| `fontSize: 13` hardcoded (not a token size at all)                                      | 71            | Use `caption` (12) or `subTitle2` (14)                                                                         |
| `#fff` / `#ffffff` / `#FFF` — same color, 3 spellings                                   | 89 + 23 + 12  | `var(--color-surface)`                                                                                         |
| `#8D8D8D` — an un-tokenized gray                                                        | 56            | `var(--color-text-muted)` (#6b7280) if it's meant as muted text — otherwise add a token, don't keep hardcoding |
| Padding `10` (not on the 4px scale)                                                     | 30            | `8` or `12`                                                                                                    |
| Padding `14` (not on the 4px scale)                                                     | 22            | `12` or `16`                                                                                                   |
| `fontSize: 22.78` written out literally instead of spreading `titleM`                   | 4             | `...typography.titleM`                                                                                         |
| `#1677ff` (antd's default blue leaking through un-themed controls)                      | 7             | Theme the control or use `var(--color-vhu-primary)`                                                            |
| `div`/`View` with `onClick` instead of a real button                                    | ~60 files     | `AppButton`, or a real `<button>`/`Link`                                                                       |
| `margin` used to space list items instead of parent `gap`                               | common        | `gap` on the flex/grid parent                                                                                  |
| `window.innerWidth` instead of `useResponsive()`                                        | —             | `useResponsive()`                                                                                              |
| `alert()` for a form error                                                              | —             | Inline error under the field (§8)                                                                              |
| Gray/default table header                                                               | —             | `var(--color-table-header-bg)` (§6)                                                                            |
| `padding`/`border` shorthand string (works in `next dev`, drops silently in production) | —             | `paddingTop`/`Right`/`Bottom`/`Left`, `borderTopWidth`/`Style`/`Color`, etc. (§3)                              |

## 12. Pre-commit checklist

- [ ] No literal `fontSize`/`fontFamily`/`fontWeight` — all via `typography.*`
- [ ] No hex color literal — all via `var(--color-*)`
- [ ] All spacing on the 4px scale (§3)
- [ ] No `padding`/`border` shorthand strings — longhand only (§3)
- [ ] Layout spacing uses `gap`, not per-child `margin`
- [ ] Table header uses `var(--color-table-header-bg)` + white text
- [ ] Modal padding matches §7
- [ ] Screen has all 4 data states: loading / populated / empty / error
- [ ] Keyboard-navigable, visible focus state
- [ ] Contrast checked (§10)
- [ ] Verified at 1440 / 1024 / 768 / 375px **against `next build && next
start`, not just `next dev`**
- [ ] Vietnamese copy in sentence case
- [ ] No `any` in props/types
- [ ] Didn't touch an unrelated screen

## 13. Tooling

```bash
# Playwright MCP — open pages, screenshot, read the a11y tree, check each breakpoint
claude mcp add playwright npx '@playwright/mcp@latest'

# Chrome DevTools MCP — read computed styles to catch hardcoded values, check box model, run Lighthouse
claude mcp add chrome-devtools npx 'chrome-devtools-mcp@latest'

# Storybook — one story per shared component: default / loading / empty / error / mobile
npx storybook@latest init
# + @storybook/addon-a11y

# ESLint guardrails (add to eslint config):
# - no-restricted-syntax: block literal fontSize/fontFamily inside styles.ts
# - a regex rule blocking #hex literals inside styles.ts
# - eslint-plugin-jsx-a11y
```

Also see [anthropics/skills](https://github.com/anthropics/skills) —
reusable Claude Skills (folders of instructions/scripts) for repeatable
tasks; worth checking before hand-rolling a new UI workflow.

## 14. Working process for any UI change

1. Read this doc.
2. Find the closest existing screen and follow its pattern.
3. Check whether the tokens you need already exist (typography, color,
   spacing). If not, add them to `typography/index.ts` /
   `variables.css` **first**, then use them.
4. Write the code.
5. Open it with Playwright MCP (or the Browser pane), screenshot desktop
   _and_ mobile.
6. Run the checklist in §12.
7. Report what changed and which tokens (if any) were added.
