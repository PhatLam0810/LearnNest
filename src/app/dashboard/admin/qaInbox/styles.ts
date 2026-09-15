import { StyleSheet } from '@styles';

// Giá trị theo design (master-detail: danh sách bên trái 390px cố định +
// panel chi tiết bên phải) - xem trao đổi ngày 14/09. Style của danh sách và
// panel chi tiết nằm ở QnaInboxList/QnaInboxDetail
// (src/modules/admin/components/) - file này chỉ giữ phần khung trang.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    gap: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c2536',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    flexWrap: 'wrap',
  },
  statsGroup: {
    flexDirection: 'row',
    gap: 26,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  statBlock: {
    gap: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    height: 34,
    backgroundColor: '#e9edf4',
  },
  // Layout chính: danh sách 390px cố định + panel chi tiết chiếm phần còn lại.
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '390px 1fr',
    gap: 18,
    alignItems: 'flex-start',
  },
});

export default styles;
