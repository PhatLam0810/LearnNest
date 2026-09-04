import { LibraryIcon } from 'webapp';

// The component reads `props.color` unconditionally (no default) - without
// it, the preview renders with an invalid stroke and shows nothing.
export const Default = () => <LibraryIcon color="#1d418a" />;
export const Large = () => <LibraryIcon color="#1d418a" width={32} height={34} />;
