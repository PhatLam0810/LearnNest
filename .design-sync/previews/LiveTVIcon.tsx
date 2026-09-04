import { LiveTVIcon } from 'webapp';

// The component's path is hardcoded fill="white" (ignores props) - it's
// meant to sit on a colored badge/background in the app, so compose it on
// one here rather than a plain white card where it would be invisible.
export const Default = () => (
  <div
    style={{
      background: '#1d418a',
      padding: 16,
      borderRadius: 8,
      display: 'inline-flex',
    }}>
    <LiveTVIcon />
  </div>
);
