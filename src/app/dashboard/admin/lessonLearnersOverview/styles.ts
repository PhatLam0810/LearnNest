import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  searchInput: {
    width: '100%',
  },
  searchInputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  searchInputStyle: {
    minWidth: 240,
  },
  badgeSuccessStyle: {
    backgroundColor: '#52c41a',
    fontSize: '14px',
  },
  modalContentWrap: {
    width: '100%',
  },
  modalToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
  },
  exportButtonStyle: {
    border: 'none',
    backgroundColor: '#1677ff',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  modalSummaryText: {
    fontSize: 14,
    color: '#666',
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    border: '1px solid #f0f0f0',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  sectionBadge: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },
  practiceSectionWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 16,
  },
  practiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  practiceHeaderTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#0f172a',
  },
  practiceHeaderSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
});

export default styles;
