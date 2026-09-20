import { useState } from 'react';
import { StyleSheet } from '@styles';

// Style fragment cho chuyển động (react-native-web idiom): spread vào style của
// View/Text. Dùng thuộc tính longhand (animationName/transitionProperty...)
// vì shorthand string bị bỏ qua khi build production (xem CLAUDE.md).
// Keyframes nằm ở src/styles/animations.css. Mọi thời lượng 150-700ms.
const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const SHADOW_REST = '0 1px 3px rgba(17, 24, 39, 0.06)';
const SHADOW_HOVER = '0 10px 26px rgba(17, 24, 39, 0.10)';

const anim = (name: string, duration: string, easing: string) =>
  ({
    animationName: name,
    animationDuration: duration,
    animationTimingFunction: easing,
    animationFillMode: 'both',
  }) as Record<string, string>;

const motion = StyleSheet.create({
  // Màn/khối vừa hiện: mờ dần + trượt lên.
  routeEnter: anim('fadeInUp', '0.32s', EASE_OUT),
  modalBackdrop: anim('fadeIn', '0.18s', 'ease'),
  modalPanel: anim('scaleIn', '0.2s', 'ease'),
  toastEnter: anim('slideInRight', '0.28s', EASE_OUT),
  // Nền cho ô tải (skeleton): dải sáng chạy ngang.
  skeleton: {
    backgroundColor: 'var(--color-surface-selected)',
    backgroundImage:
      'linear-gradient(90deg, var(--color-surface-selected) 0%, var(--color-surface) 50%, var(--color-surface-selected) 100%)',
    backgroundSize: '600px 100%',
    backgroundRepeat: 'no-repeat',
    animationName: 'shimmer',
    animationDuration: '1.4s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  } as Record<string, string>,
  // Bề mặt bấm được: chuyển màu/viền/đổ bóng mượt thay vì nhảy bậc.
  interactive: {
    transitionProperty: 'background-color, border-color, transform, box-shadow',
    transitionDuration: '0.16s, 0.16s, 0.16s, 0.18s',
    transitionTimingFunction: 'ease',
  } as Record<string, string>,
  // Thẻ (card): bóng nghỉ + transition; trạng thái hover ở cardHoverOn.
  cardHover: {
    boxShadow: SHADOW_REST,
    transitionProperty: 'background-color, border-color, transform, box-shadow',
    transitionDuration: '0.16s, 0.16s, 0.16s, 0.18s',
    transitionTimingFunction: 'ease',
  } as Record<string, string>,
  cardHoverOn: {
    transform: 'translateY(-2px)',
    boxShadow: SHADOW_HOVER,
  } as Record<string, string>,
  // Thanh tiến độ: độ rộng chạy mượt.
  progressFill: {
    transitionProperty: 'width',
    transitionDuration: '0.7s',
    transitionTimingFunction: 'cubic-bezier(0.22, 0.9, 0.28, 1)',
  } as Record<string, string>,
  // Nền đổi màu ngắn (tô đúng/sai ở quiz).
  colorFade: {
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
  } as Record<string, string>,
});

export const SHADOWS = {
  rest: SHADOW_REST,
  hover: SHADOW_HOVER,
  modal: '0 20px 44px rgba(17, 24, 39, 0.16)',
} as const;

// Hover cho View của react-native-web (không có :hover): trả handler + style
// nâng thẻ. Dùng: const { hoverProps, hoverStyle } = useHoverLift(); <View
// {...hoverProps} style={[styles.card, motion.cardHover, hoverStyle]} />
export const useHoverLift = (disabled = false) => {
  const [hovered, setHovered] = useState(false);
  return {
    hoverProps: disabled
      ? {}
      : {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        },
    hoverStyle: hovered && !disabled ? motion.cardHoverOn : undefined,
  };
};

export default motion;
