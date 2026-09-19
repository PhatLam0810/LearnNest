import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'var(--color-info-bg)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  title: {
    ...typography.subTitle1,
    color: 'var(--color-vhu-primary)',
  },
  summary: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    lineHeight: 20,
  },
  link: {
    ...typography.body2,
    color: 'var(--color-vhu-primary)',
    fontWeight: '600',
    cursor: 'pointer',
  },
});

export default styles;
