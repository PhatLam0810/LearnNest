import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    boxShadow: '0 8px 20px rgba(29, 65, 138, 0.06)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    minWidth: 160,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  searchInput: {
    maxWidth: 320,
  },
  actionsRow: {
    display: 'flex',
    gap: 8,
  },
  learnerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  learnerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    transition: 'box-shadow 0.2s',
  },
  learnerInfo: {
    flex: '1 1 220px',
    minWidth: 0,
  },
  learnerName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 2,
  },
  learnerMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  learnerProgressWrap: {
    flex: '1 1 200px',
    minWidth: 160,
  },
  learnerLastStudied: {
    flex: '0 0 160px',
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'right',
  },
  learnerStatus: {
    flex: '0 0 120px',
    textAlign: 'right',
  },
  paginationWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 12,
  },
  emptyState: {
    padding: 48,
    textAlign: 'center',
    color: '#6b7280',
  },
});

export default styles;
