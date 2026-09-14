import { StyleSheet } from '@styles';

const NAVY = '#1d3a6e';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  modalHeader: {
    backgroundColor: NAVY,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: '16px 20px',
  },
  modalHeaderTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
  },
  modalTimestamp: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  modalBody: {
    padding: '20px',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: '#9ca3af',
    marginBottom: 6,
  },
  actionHeadline: {
    fontSize: 16,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 16,
  },
  cardsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: '10px 14px',
    backgroundColor: '#fafafa',
  },
  cardLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
  },
  cardEmail: {
    fontSize: 12,
    color: '#2563eb',
  },
  errorBox: {
    backgroundColor: '#fff1f0',
    border: '1px solid #ffccc7',
    borderRadius: 8,
    padding: '8px 12px',
    marginBottom: 12,
  },
  detailTable: {
    border: '1px solid #f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    borderTop: '1px solid #f0f0f0',
  },
  userAgentText: {
    fontSize: 12,
    color: '#9ca3af',
    maxWidth: 260,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export default styles;
