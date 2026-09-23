'use client';

import React, { useState } from 'react';
import { MorphIcon, type MorphIconProps } from 'morphicons/react';
import type { IconNode } from 'lucide';
import * as LucideIcons from 'lucide';

export interface AppIconProps extends Omit<MorphIconProps, 'icon'> {
  icon: IconNode;
  hoverIcon?: IconNode;
  activeIcon?: IconNode;
  active?: boolean;
  activeColor?: string;
  hoverColor?: string;
  hoverMorph?: boolean;
  size?: number | string;
  strokeWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
  spin?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({
  icon,
  activeIcon,
  active = false,
  activeColor = 'var(--color-vhu-primary)',
  hoverColor,
  hoverMorph = false,
  size = 18,
  strokeWidth = 2,
  color,
  style,
  className = '',
  spin = false,
  onMouseEnter,
  onMouseLeave,
  spring = 'snappy',
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Giữ nguyên icon ổn định, không đổi sang icon khác khi hover
  const effectiveIcon = active && activeIcon ? activeIcon : icon;

  const baseColor = (style?.color as string) || color || 'currentColor';
  const effectiveColor = active
    ? activeColor
    : isHovered && hoverColor
      ? hoverColor
      : baseColor;

  const combinedStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    color: effectiveColor,
    animation: spin ? 'appIconSpin 1s linear infinite' : undefined,
    ...style,
  };

  return (
    <>
      <style jsx global>{`
        @keyframes appIconSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <MorphIcon
        icon={effectiveIcon}
        size={size}
        color={effectiveColor}
        strokeWidth={strokeWidth}
        spring={spring}
        style={combinedStyle}
        className={`app-icon ${active ? 'app-icon--active' : ''} ${className}`}
        onMouseEnter={e => {
          setIsHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={e => {
          setIsHovered(false);
          onMouseLeave?.(e);
        }}
        {...rest}
      />
    </>
  );
};

export type AppIconComponentProps = Omit<AppIconProps, 'icon'>;

const createIcon = (
  defaultIcon: IconNode,
  _defaultHover?: IconNode,
  defaultProps?: Partial<AppIconComponentProps>,
) => {
  const Component: React.FC<AppIconComponentProps> = props => (
    <AppIcon
      icon={defaultIcon}
      hoverMorph={false}
      {...defaultProps}
      {...props}
      style={{ ...defaultProps?.style, ...props.style }}
    />
  );
  Component.displayName = 'AppIconComponent';
  return Component;
};

// Map all 57 Ant Design icons with morphing pairs
export const ArrowDownOutlined = createIcon(
  LucideIcons.ArrowDown,
  LucideIcons.ArrowDownToLine,
);
export const ArrowLeftOutlined = createIcon(
  LucideIcons.ArrowLeft,
  LucideIcons.MoveLeft,
);
export const ArrowRightOutlined = createIcon(
  LucideIcons.ArrowRight,
  LucideIcons.MoveRight,
);
export const ArrowUpOutlined = createIcon(
  LucideIcons.ArrowUp,
  LucideIcons.ArrowUpToLine,
);
export const BookOutlined = createIcon(
  LucideIcons.BookOpen,
  LucideIcons.BookMarked,
);
export const CheckCircleFilled = createIcon(
  LucideIcons.CircleCheck,
  LucideIcons.Check,
  {
    color: 'var(--color-success, #16a34a)',
    activeColor: 'var(--color-success, #16a34a)',
  },
);
export const CheckCircleOutlined = createIcon(
  LucideIcons.CircleCheck,
  LucideIcons.CheckCheck,
  {
    color: 'var(--color-success, #16a34a)',
  },
);
export const CheckOutlined = createIcon(
  LucideIcons.Check,
  LucideIcons.CheckCheck,
);
export const ClockCircleOutlined = createIcon(
  LucideIcons.Clock,
  LucideIcons.Hourglass,
);
export const CloseCircleFilled = createIcon(
  LucideIcons.CircleX,
  LucideIcons.X,
  {
    color: 'var(--color-error, #dc2626)',
    activeColor: 'var(--color-error, #dc2626)',
  },
);
export const CloseCircleOutlined = createIcon(
  LucideIcons.CircleX,
  LucideIcons.X,
  {
    color: 'var(--color-error, #dc2626)',
  },
);
export const CloseOutlined = createIcon(LucideIcons.X, LucideIcons.RotateCcw);
export const CommentOutlined = createIcon(
  LucideIcons.MessageCircle,
  LucideIcons.MessageCircleMore,
);
export const ControlOutlined = createIcon(
  LucideIcons.Sliders,
  LucideIcons.SlidersHorizontal,
);
export const DeleteOutlined = createIcon(
  LucideIcons.Trash2,
  LucideIcons.Trash,
  {
    hoverColor: 'var(--color-error, #dc2626)',
  },
);
export const DollarOutlined = createIcon(
  LucideIcons.DollarSign,
  LucideIcons.Sparkles,
);
export const DownloadOutlined = createIcon(
  LucideIcons.Download,
  LucideIcons.ArrowDownToLine,
);
export const EditOutlined = createIcon(LucideIcons.Pencil, LucideIcons.PenTool);
export const ExperimentOutlined = createIcon(
  LucideIcons.FlaskConical,
  LucideIcons.Sparkles,
);
export const ExportOutlined = createIcon(
  LucideIcons.ExternalLink,
  LucideIcons.Share2,
);
export const EyeInvisibleOutlined = createIcon(
  LucideIcons.EyeOff,
  LucideIcons.Eye,
);
export const EyeOutlined = createIcon(LucideIcons.Eye, LucideIcons.EyeOff);
export const FilePdfOutlined = createIcon(
  LucideIcons.FileText,
  LucideIcons.Files,
);
export const FileTextOutlined = createIcon(
  LucideIcons.FileText,
  LucideIcons.Files,
);
export const FilterOutlined = createIcon(
  LucideIcons.Filter,
  LucideIcons.SlidersHorizontal,
);
export const FireOutlined = createIcon(
  LucideIcons.Flame,
  LucideIcons.Sparkles,
  {
    color: '#f97316',
  },
);
export const IdcardOutlined = createIcon(
  LucideIcons.Contact,
  LucideIcons.UserCheck,
);
export const InfoCircleOutlined = createIcon(
  LucideIcons.Info,
  LucideIcons.CircleHelp,
);
export const LeftOutlined = createIcon(
  LucideIcons.ChevronLeft,
  LucideIcons.ArrowLeft,
);
export const LikeFilled = createIcon(LucideIcons.ThumbsUp, LucideIcons.Heart, {
  color: 'var(--color-vhu-primary)',
});
export const LikeOutlined = createIcon(LucideIcons.ThumbsUp, LucideIcons.Heart);
export const LoadingOutlined = createIcon(LucideIcons.Loader2, undefined, {
  spin: true,
});
export const LockOutlined = createIcon(LucideIcons.Lock, LucideIcons.KeyRound);
export const LogoutOutlined = createIcon(
  LucideIcons.LogOut,
  LucideIcons.DoorOpen,
  {
    hoverColor: 'var(--color-error, #dc2626)',
  },
);
export const MailOutlined = createIcon(LucideIcons.Mail, LucideIcons.MailOpen);
export const MessageOutlined = createIcon(
  LucideIcons.MessageSquare,
  LucideIcons.MessageSquareText,
);
export const MinusCircleOutlined = createIcon(
  LucideIcons.CircleMinus,
  LucideIcons.Minus,
);
export const MoreOutlined = createIcon(
  LucideIcons.MoreHorizontal,
  LucideIcons.MoreVertical,
);
export const PictureOutlined = createIcon(
  LucideIcons.Image,
  LucideIcons.Sparkles,
);
export const PlayCircleOutlined = createIcon(
  LucideIcons.PlayCircle,
  LucideIcons.Play,
  {
    color: 'var(--color-vhu-primary)',
  },
);
export const PlusOutlined = createIcon(
  LucideIcons.Plus,
  LucideIcons.PlusCircle,
);
export const PrinterOutlined = createIcon(
  LucideIcons.Printer,
  LucideIcons.FileCheck,
);
export const QuestionCircleOutlined = createIcon(
  LucideIcons.CircleHelp,
  LucideIcons.Info,
);
export const ReloadOutlined = createIcon(
  LucideIcons.RotateCcw,
  LucideIcons.RefreshCw,
);
export const RightOutlined = createIcon(
  LucideIcons.ChevronRight,
  LucideIcons.ArrowRight,
);
export const RobotOutlined = createIcon(LucideIcons.Bot, LucideIcons.Sparkles, {
  color: 'var(--color-vhu-primary)',
});
export const RocketOutlined = createIcon(
  LucideIcons.Rocket,
  LucideIcons.Sparkles,
);
export const SearchOutlined = createIcon(
  LucideIcons.Search,
  LucideIcons.Sparkles,
);
export const SendOutlined = createIcon(
  LucideIcons.Send,
  LucideIcons.SendHorizontal,
);
export const SettingOutlined = createIcon(
  LucideIcons.Settings,
  LucideIcons.SlidersHorizontal,
);
export const StarFilled = createIcon(LucideIcons.Star, LucideIcons.Sparkle, {
  color: 'var(--color-vhu-accent, #f0c356)',
  fill: 'currentColor',
});
export const StarOutlined = createIcon(LucideIcons.Star, LucideIcons.Sparkle, {
  hoverColor: 'var(--color-vhu-accent, #f0c356)',
});
export const TeamOutlined = createIcon(
  LucideIcons.Users,
  LucideIcons.UserCheck,
);
export const UnorderedListOutlined = createIcon(
  LucideIcons.List,
  LucideIcons.CheckSquare,
);
export const UploadOutlined = createIcon(
  LucideIcons.Upload,
  LucideIcons.ArrowUpToLine,
);
export const BarChartOutlined = createIcon(
  LucideIcons.BarChart2,
  LucideIcons.LineChart,
);
export const BellOutlined = createIcon(LucideIcons.Bell, LucideIcons.BellRing);
export const CarryOutOutlined = createIcon(
  LucideIcons.CalendarCheck,
  LucideIcons.CheckCheck,
);
export const MenuOutlined = createIcon(LucideIcons.Menu, LucideIcons.X);
export const TrophyOutlined = createIcon(
  LucideIcons.Trophy,
  LucideIcons.Sparkles,
  {
    color: 'var(--color-vhu-accent, #f0c356)',
  },
);
export const UserOutlined = createIcon(LucideIcons.User, LucideIcons.UserCheck);
export const HomeOutlined = createIcon(
  LucideIcons.House,
  LucideIcons.Building2,
);
export const BookOpenOutlined = createIcon(
  LucideIcons.BookOpen,
  LucideIcons.GraduationCap,
);
export const LibraryOutlined = createIcon(
  LucideIcons.Library,
  LucideIcons.FolderArchive,
);
export const ZoomInOutlined = createIcon(
  LucideIcons.ZoomIn,
  LucideIcons.Maximize2,
);
export const ZoomOutOutlined = createIcon(
  LucideIcons.ZoomOut,
  LucideIcons.Minimize2,
);

export default AppIcon;
