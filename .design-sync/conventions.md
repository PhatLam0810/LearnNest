LearnNest's UI is built on **react-native-web** primitives (`View`, `Text`) styled with
`StyleSheet.create({...})` objects, plus **antd** components for richer controls (buttons,
inputs, images, tables). There is no global theme/config provider wrapping the app — antd is
used with its own defaults, and brand color/spacing comes from CSS custom properties, not an
antd `ConfigProvider` theme object. No wrapper is required to use these components correctly.

## Styling idiom

Two idioms coexist, both real:

1. **react-native-web style objects** — most custom components (`AppButton`, `AppInput`,
   layout wrappers) hold their styling in a co-located `styles.ts` as
   `StyleSheet.create({ container: {...}, ... })`, applied via `style={styles.container}` (an
   array merges multiple: `style={[styles.base, condition && styles.active]}`). This is NOT
   Tailwind or CSS classes — there is no utility-class vocabulary to reach for. Build new
   layout/spacing the same way: plain JS style objects passed to `style`.
2. **Brand tokens as CSS custom properties**, defined in `styles.css` (synced from
   `src/styles/variables.css`) and referenced as literal strings inside style objects:
   `backgroundColor: 'var(--color-vhu-primary)'`. The three brand tokens:
   - `--color-vhu-primary` (`#1d418a`, deep blue — primary actions, headers, links)
   - `--color-vhu-secondary` (`#f0c356`, gold — accents, highlights)
   - `--color-vhu-accent` (`#88c1e9`, light blue — secondary accents)
     Use these `var(--...)` strings for brand color, not new hex literals.
3. **antd components** (`Button`, `Input`, `Image`, etc., and the `AppButton`/`AppInput`
   wrappers around them) carry their own built-in styling — pass antd props (`type="primary"`,
   `danger`, `size`, `status`) rather than overriding with custom CSS.

## Typography

Four Google Fonts families are used, referenced as `fontFamily: '<name>, sans-serif'` string
literals inside style objects (there's no typography-token system beyond this): **Lexend**
(the primary UI font — used almost everywhere for buttons, inputs, headings, body text),
**Inter**, **DM Sans**, and **Plus Jakarta Sans**. Default to Lexend for new text unless
composing alongside an existing block that already uses one of the others.

## Where the truth lives

- `styles.css` at the bundle root — the token `:root` block (brand CSS variables) and the
  Google Fonts `@import`.
- Per-component `.d.ts` files under `components/<group>/<Name>/` for each component's real
  prop API.
- `_ds_bundle.css` — antd's and react-native-web's compiled component CSS (imported by
  `styles.css`, don't read it directly for the idiom — it's generated, not authored).

## Example

The shipped components are react-native-web-based internally, but `View`/`Text` themselves
aren't part of this bundle's exports — for your own layout glue (containers, rows, spacing),
use plain HTML elements with inline styles in this same idiom (JS style objects, `var(--...)`
tokens, `fontFamily: 'Lexend, sans-serif'`), and reach for the real library components below
for controls:

```tsx
import { AppButton, AppInput } from 'webapp';

function ConfirmDialog() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 16,
      }}>
      <span
        style={{
          fontFamily: 'Lexend, sans-serif',
          fontSize: 16,
          fontWeight: 600,
        }}>
        Xác nhận thay đổi
      </span>
      <AppInput placeholder="Nhập lý do (không bắt buộc)" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 8,
          justifyContent: 'flex-end',
        }}>
        <AppButton>Hủy</AppButton>
        <AppButton
          type="primary"
          style={{ backgroundColor: 'var(--color-vhu-primary)' }}>
          Xác nhận
        </AppButton>
      </div>
    </div>
  );
}
```
