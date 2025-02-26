export function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  return match
    ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
    : null;
}
