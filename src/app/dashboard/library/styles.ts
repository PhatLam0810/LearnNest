import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 0,
    gap: 16,
    height: '90vh',
  },
  title: {
    ...typography.subTitle2,
  },
  sortColumn: {
    gap: 4,
    minWidth: 140,
  },
  header: {
    gap: 4,
  },
  pageTitle: {
    ...typography.titleM,
    fontSize: 28,
  },
  pageSubtitle: {
    ...typography.body1,
    color: 'var(--color-text-muted)',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterPill: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 999,
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderColor: 'var(--color-border-subtle)',
    cursor: 'pointer',
  },
  filterPillActive: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 999,
    backgroundColor: 'var(--color-vhu-primary)',
    borderWidth: 1,
    borderColor: 'var(--color-vhu-primary)',
    cursor: 'pointer',
  },
  filterPillText: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  filterPillTextActive: {
    ...typography.subTitle2,
    color: 'var(--color-text-on-primary)',
  },
  table: {
    flex: 1,
    backgroundColor: 'var(--color-surface)',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.04)',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: 'var(--color-vhu-primary)',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 20,
    paddingRight: 20,
  },
  tableHeaderCell: {
    ...typography.body2,
    fontWeight: '600',
    color: 'var(--color-table-header-text)',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--color-border-subtle)',
    cursor: 'pointer',
  },
  tableCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colDoc: {
    flex: 3,
    minWidth: 0,
    gap: 10,
  },
  colType: {
    flex: 1,
    minWidth: 0,
  },
  colDate: {
    flex: 1,
    minWidth: 0,
  },
  rowIcon: {
    color: 'var(--color-vhu-primary)',
    fontSize: 16,
    display: 'flex',
  },
  rowTitle: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
    flexShrink: 1,
  },
  typeBadge: {
    ...typography.caption,
    color: 'var(--color-vhu-primary)',
    backgroundColor: 'var(--color-info-bg)',
    borderRadius: 999,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
  },
  rowDate: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  loadMoreWrap: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default styles;
