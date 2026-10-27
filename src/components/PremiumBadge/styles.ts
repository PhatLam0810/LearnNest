import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 36,
    paddingLeft: 12,
    paddingRight: 12,
    cursor: 'pointer',
    backgroundColor: 'var(--color-vhu-secondary)',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
    lineHeight: 16,
    color: 'var(--color-text-primary)',
  },
});

export default styles;
