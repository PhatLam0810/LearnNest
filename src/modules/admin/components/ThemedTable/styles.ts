import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    overflow: 'hidden',
  },
  headerCell: {
    ...typography.subTitle2,
    fontWeight: '600',
    backgroundColor: 'var(--color-table-header-bg)',
    color: 'var(--color-table-header-text)',
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
    paddingTop: 44,
    paddingBottom: 44,
    textAlign: 'center',
  },
  mobileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  mobileCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  mobileField: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  mobileLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  mobileValue: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
    textAlign: 'right',
  },
  mobileActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
  },
  mobilePagination: {
    alignSelf: 'center',
    marginTop: 8,
  },
});

export default styles;
