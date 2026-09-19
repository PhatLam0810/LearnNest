import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    padding: 16,
    gap: 6,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.06)',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  value: {
    ...typography.titleM,
  },
  caption: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
});

export default styles;
