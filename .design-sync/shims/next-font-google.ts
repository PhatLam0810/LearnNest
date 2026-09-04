// Shim for `next/font/google` used ONLY by the /design-sync bundle build
// (see .design-sync/NOTES.md "next/font/google shim"). Next's real
// next/font/google is a build-time macro handled by the Next.js SWC/webpack
// compiler - plain esbuild resolves the package but gets no usable exports,
// so calling e.g. `Lexend({...})` at module scope (src/styles/typography)
// throws immediately and crashes the whole bundle on load. This shim
// mirrors the real return shape (`{className, style: {fontFamily}, variable}`)
// closely enough for static previews. Actual font FILES aren't bundled here;
// the matching family names are loaded via Google Fonts CSS instead (see
// .design-sync/shims/tokens.css, wired via cfg.cssEntry).
function fontLoader(family: string) {
  return (opts: { variable?: string } = {}) => ({
    className: '',
    style: {
      fontFamily: `'${family}', sans-serif`,
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
    variable: opts.variable ?? '',
  });
}

export const Lexend = fontLoader('Lexend');
export const Inter = fontLoader('Inter');
export const DM_Sans = fontLoader('DM Sans');
export const Plus_Jakarta_Sans = fontLoader('Plus Jakarta Sans');
