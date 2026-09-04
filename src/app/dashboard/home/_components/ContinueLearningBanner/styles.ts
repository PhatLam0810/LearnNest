import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    backgroundColor: 'var(--color-vhu-primary)',
    backgroundImage:
      'linear-gradient(120deg, var(--color-vhu-primary), #2a5bb8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
  },
  bannerSkeleton: {
    width: '100%',
    height: 148,
    borderRadius: 16,
    backgroundColor: '#eef1f6',
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
    fontSize: 22,
    color: '#fff',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  thumbWrap: {
    width: 120,
    height: 68,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressText: {
    color: '#fff',
    fontWeight: '700',
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
    color: '#1a1a1a',
  },
  secondaryButton: {
    width: 'auto',
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.6)',
    color: '#fff',
  },
});

export default styles;
