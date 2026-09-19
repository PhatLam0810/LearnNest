import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  panel: {
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchRow: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-subtle)',
  },
  scroll: {
    maxHeight: 'calc(100vh - 320px)',
    minHeight: 120,
    overflowY: 'auto',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    minHeight: 64,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 20,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-subtle)',
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    backgroundColor: 'var(--color-surface)',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  rowSelected: {
    backgroundColor: 'var(--color-surface-selected)',
    borderLeftColor: 'var(--color-vhu-primary)',
  },
  rowIdle: {
    borderLeftColor: 'transparent',
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  name: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  overriddenTag: {
    ...typography.caption,
    color: 'var(--color-info)',
  },
  skeletonWrap: {
    padding: 16,
    gap: 16,
  },
  emptyWrap: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
    textAlign: 'center',
  },
  errorWrap: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: 'var(--color-error-bg)',
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
    textAlign: 'center',
  },
});

export default styles;
