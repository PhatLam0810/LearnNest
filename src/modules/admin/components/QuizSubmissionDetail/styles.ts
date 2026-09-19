import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
    padding: 24,
    gap: 24,
  },
  centerState: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: 'var(--color-error-bg)',
    borderRadius: 12,
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
  },
  quoteBlock: {
    backgroundColor: 'var(--color-surface-subtle)',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  quoteLabel: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  quoteText: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    lineHeight: 21,
  },
  notice: {
    backgroundColor: 'var(--color-info-bg)',
    borderRadius: 8,
    padding: 16,
  },
  noticeText: {
    ...typography.body2,
    color: 'var(--color-info)',
    lineHeight: 21,
  },
});

export default styles;
