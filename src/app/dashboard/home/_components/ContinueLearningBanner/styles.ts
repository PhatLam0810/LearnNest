import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  banner: {
    animationName: 'fadeInUp',
    animationDuration: '0.32s',
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    animationFillMode: 'both',
    width: '100%',
    borderRadius: 16,
    padding: 24,
    backgroundColor: 'var(--color-vhu-primary)',
    backgroundImage:
      'linear-gradient(120deg, var(--color-vhu-primary), var(--color-vhu-primary-light))',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
  },
  bannerSkeleton: {
    backgroundImage:
      'linear-gradient(90deg, var(--color-border-subtle) 0%, var(--color-surface) 50%, var(--color-border-subtle) 100%)',
    backgroundSize: '600px 100%',
    backgroundRepeat: 'no-repeat',
    animationName: 'shimmer',
    animationDuration: '1.4s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    width: '100%',
    height: 148,
    borderRadius: 16,
    backgroundColor: 'var(--color-border-subtle)',
  },
  textCol: {
    gap: 8,
    flex: 1,
    minWidth: 240,
  },
  greeting: {
    ...typography.body1,
    color: 'rgba(255,255,255,0.85)',
  },
  headline: {
    ...typography.titleM,
    color: 'var(--color-text-on-primary)',
  },
  subtitle: {
    ...typography.body2,
    color: 'rgba(255,255,255,0.75)',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 8,
    minWidth: 160,
  },
  progressPercent: {
    fontSize: 32,
    fontWeight: '700',
    color: 'var(--color-vhu-secondary)',
  },
  progressTrack: {
    width: 160,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    transitionProperty: 'width',
    transitionDuration: '0.7s',
    transitionTimingFunction: 'cubic-bezier(0.22, 0.9, 0.28, 1)',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'var(--color-vhu-secondary)',
  },
  progressCaption: {
    ...typography.body2,
    color: 'rgba(255,255,255,0.75)',
  },
  // AppButton mặc định width:100% (styles.container trong AppButton), hợp
  // cho nút submit form nhưng không hợp ở đây - 2 nút cần đứng cạnh nhau,
  // không xếp chồng full-width. Ghi đè width lại "auto" cho cả 2 nút.
  // Nút CTA chính trên nền xanh VHU - dùng màu vàng phụ (secondary) để nổi
  // bật thay vì xanh-trên-xanh (type="primary" mặc định trùng màu banner).
  ctaButton: {
    width: 'auto',
    backgroundColor: 'var(--color-vhu-secondary)',
    borderColor: 'var(--color-vhu-secondary)',
    color: 'var(--color-text-primary)',
  },
  secondaryButton: {
    width: 'auto',
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.6)',
    color: 'var(--color-text-on-primary)',
  },
});

export default styles;
