import { StyleSheet, typography } from '@styles';

const ACCENT = {
  success: 'var(--color-vhu-primary)',
  warn: 'var(--color-warning)',
  error: 'var(--color-error)',
  info: 'var(--color-vhu-primary)',
} as const;

const styles = StyleSheet.create({
  stack: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 3000,
    gap: 10,
    width: 360,
    maxWidth: 'calc(100vw - 32px)',
    // Chồng toast không chặn thao tác phía sau, chỉ chính toast nhận chuột.
    pointerEvents: 'none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 12,
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftStyle: 'solid',
    boxShadow: '0 10px 26px rgba(17, 24, 39, 0.14)',
    pointerEvents: 'auto',
  },
  glyph: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  glyphText: {
    ...typography.caption,
    fontWeight: '700',
    color: 'var(--color-text-on-primary)',
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  message: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  close: {
    width: 28,
    height: 28,
    flexShrink: 0,
    borderWidth: 0,
    borderRadius: 6,
    backgroundColor: 'transparent',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 14,
  },
});

export const toastAccent = (kind: keyof typeof ACCENT) => ACCENT[kind];
export default styles;
