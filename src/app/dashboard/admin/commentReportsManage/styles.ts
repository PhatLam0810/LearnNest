import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    padding: 24,
    gap: 16,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  reasonTag: {
    ...typography.caption,
    fontWeight: '500',
    color: 'var(--color-warning)',
    backgroundColor: 'var(--color-warning-bg)',
    borderRadius: 6,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  metaText: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  quoteBlock: {
    backgroundColor: 'var(--color-surface-subtle)',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  quoteLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  quoteText: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    lineHeight: 21,
  },
  imagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  noteText: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    lineHeight: 21,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  hideButton: {
    ...typography.buttonSmall,
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-error)',
    backgroundColor: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  warnedText: {
    ...typography.caption,
    color: 'var(--color-success)',
  },
  stateWrap: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
  },
  errorWrap: {
    backgroundColor: 'var(--color-error-bg)',
    borderWidth: 0,
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
    textAlign: 'center',
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
    textAlign: 'center',
  },
  skeletonCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    padding: 24,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default styles;
