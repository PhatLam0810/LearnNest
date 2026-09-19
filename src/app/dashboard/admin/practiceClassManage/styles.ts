import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  page: {
    width: '100%',
    gap: 24,
  },
  headerBlock: {
    gap: 4,
  },
  title: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
  },
  subtitle: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  cellStrong: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
  },
  cellMuted: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  actionButton: {
    ...typography.buttonSmall,
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-vhu-primary)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-vhu-primary)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontFamily: 'inherit',
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
  skeletonWrap: {
    gap: 16,
    padding: 16,
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
  },
});

export default styles;
