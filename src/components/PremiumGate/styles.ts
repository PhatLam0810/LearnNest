import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  dimmed: { opacity: 0.55 },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    cursor: 'pointer',
    alignItems: 'flex-end',
    padding: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
    backgroundColor: 'var(--color-vhu-secondary)',
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
    lineHeight: 16,
    color: 'var(--color-text-primary)',
  },
});

export default styles;
