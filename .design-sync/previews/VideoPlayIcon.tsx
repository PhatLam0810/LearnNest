import { VideoPlayIcon } from 'webapp';

// The component reads `props.color` directly (no default) - without it,
// the fill is undefined and the icon paints nothing.
export const Default = () => <VideoPlayIcon color="#1d418a" />;
export const Large = () => (
  <VideoPlayIcon color="#1d418a" width={40} height={40} />
);
