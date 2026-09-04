import { AppImage } from 'webapp';

// A self-contained data-URI SVG so the preview never depends on network
// access (the real component's own placeholder fallback points at
// placehold.it, which a sandboxed render can't reach).
const SAMPLE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">' +
      '<rect width="320" height="200" fill="#1d418a"/>' +
      '<text x="50%" y="50%" fill="#ffffff" font-size="20" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">LearnNest</text>' +
      '</svg>',
  );

export const Default = () => <AppImage source={SAMPLE} width={320} height={200} />;
export const Rounded = () => (
  <AppImage source={SAMPLE} width={200} height={200} style={{ borderRadius: 12, overflow: 'hidden' }} />
);
export const Thumbnail = () => <AppImage source={SAMPLE} width={96} height={96} style={{ borderRadius: 8 }} />;
