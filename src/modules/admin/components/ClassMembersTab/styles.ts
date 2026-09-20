import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  wrap: {
    gap: 16,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  searchWrap: {
    flexGrow: 1,
    flexBasis: 240,
    maxWidth: 420,
  },
  hint: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  learnerName: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
  },
  caption: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  learnerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
  moveButton: {
    ...typography.buttonSmall,
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border-strong)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-vhu-primary)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  actionButton: {
    ...typography.buttonSmall,
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-error)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-error)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  centerState: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
  },
  skeletonWrap: {
    gap: 16,
    padding: 16,
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
  },
  errorState: {
    backgroundColor: 'var(--color-error-bg)',
    borderRadius: 12,
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
});

export default styles;
