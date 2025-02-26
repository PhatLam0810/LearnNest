'use client';
import React from 'react';
import AwesomeIcon from './AwesomeIcon';
import GoogleIcon from './GoogleIcon';
import LiveTVIcon from './LiveTVIcon';
import VideoPlayIcon from './VideoPlayIcon';
import HomeIcon from './HomeIcon';
import LessonIcon from './LessonIcon';
import LibraryIcon from './LibraryIcon';
import SaveIcon from './SaveIcon';
import NotificationIcon from './NotificationIcon';
import SettingSuggestIcon from './SettingSuggestIcon';
import AppleIcon from './AppleIcon';

const icons = {
  awesome: AwesomeIcon,
  video: VideoPlayIcon,
  liveTV: LiveTVIcon,
  google: GoogleIcon,
  apple: AppleIcon,
  home: HomeIcon,
  lesson: LessonIcon,
  library: LibraryIcon,
  save: SaveIcon,
  notification: NotificationIcon,
  settingSuggest: SettingSuggestIcon,
};

interface Props {
  name: keyof typeof icons;
  size?: number;
  onClick?: () => void;
}
type IconProps = Props & React.SVGProps<SVGSVGElement>;

const Icon: React.FC<IconProps> = ({ name, onClick, ...props }) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon ${name} not found.`);
    return null;
  }

  return <IconComponent {...props} onClick={onClick} />;
};

export default Icon;
