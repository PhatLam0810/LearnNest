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
    ...typography.body2,
    fontWeight: '500',
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
    color: '#8D8D8D',
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef0f5',
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
    ...typography.body2,
    fontWeight: '500',
    color: '#212121',
  },
  filterPillTextActive: {
    ...typography.body2,
    fontWeight: '500',
    color: '#fff',
  },
  table: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    color: '#212121',
    flexShrink: 1,
  },
  typeBadge: {
    ...typography.body2,
    fontSize: 12,
    color: 'var(--color-vhu-primary)',
    backgroundColor: '#eff6ff',
    borderRadius: 999,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
  },
  rowDate: {
    ...typography.body2,
    color: '#8D8D8D',
  },
  loadMoreWrap: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default styles;
