import { HomeIcon } from 'webapp';

// The component reads `props.color` unconditionally (no default) - without
// it, the preview renders with an invalid stroke and shows nothing.
export const Default = () => <HomeIcon color="#1d418a" />;
export const Large = () => <HomeIcon color="#1d418a" width={32} height={34} />;
