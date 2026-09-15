import { StyleSheet } from '@styles';

// Giá trị lấy đúng theo design (modal "Chi tiết thao tác") - xem trao đổi
// ngày 14/09. --color-vhu-primary là biến CSS thương hiệu đã dùng sẵn trong
// dự án (khớp header bảng + header modal).
const styles = StyleSheet.create({
  modalHeader: {
    background: 'var(--color-vhu-primary)',
    padding: '22px 28px',
  },
  modalHeaderTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#fff',
  },
  modalCloseIcon: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    // Áp trực tiếp vào <span> gốc (không qua react-native-web Text) - số
    // trần ở đây được CSS hiểu đúng nghĩa là hệ số nhân (1 = bằng
    // font-size), không tự thành px. Khác với lineHeight số trần trong các
    // component <Text>/<View> khác của react-native-web (nơi số trần lại bị
    // coi là px tuyệt đối) - xem QnaInboxDetail/styles.ts.replyTextarea.
    lineHeight: 1,
  },
  modalTimestamp: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
  },
  modalBody: {
    padding: '26px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 26,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: '#9ca3af',
  },
  actionHeadline: {
    fontSize: 17,
    fontWeight: 500,
    color: '#111827',
    lineHeight: 25,
  },
  // Đường phân cách giữa 2 card KHÔNG phải border riêng - là nền xám lộ ra
  // qua khe gap: 1px giữa 2 ô nền trắng, đúng cách design dựng (xem
  // modal-block trích từ file design).
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 1,
    background: '#eef1f6',
    border: '1px solid #eef1f6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  card: {
    background: '#fff',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  cardLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#111827',
  },
  cardEmail: {
    fontSize: 12,
    color: 'var(--color-vhu-primary)',
  },
  errorBox: {
    backgroundColor: '#fff1f0',
    border: '1px solid #ffccc7',
    borderRadius: 8,
    padding: '8px 12px',
  },
  detailTable: {
    border: '1px solid #eef1f6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  // KHÔNG có borderTop - footer là mục cuối cùng trong cùng cột gap:26 của
  // modalBody, không phải 1 dải riêng có viền như bản cũ.
  modalFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  userAgentText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  secondaryBtnStyle: {
    width: 'auto',
    height: 38,
  },
  primaryBtnStyle: {
    width: 'auto',
    height: 38,
    background: 'var(--color-vhu-primary)',
  },
});

export default styles;
