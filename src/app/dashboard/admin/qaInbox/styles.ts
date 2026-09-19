import { StyleSheet, typography } from '@styles';

// Giá trị theo design (master-detail: danh sách bên trái 390px cố định +
// panel chi tiết bên phải) - xem trao đổi ngày 14/09. Style của danh sách và
// panel chi tiết nằm ở QnaInboxList/QnaInboxDetail
// (src/modules/admin/components/) - file này chỉ giữ phần khung trang.
//
// Mọi style chữ đều spread ...typography.<preset> trước rồi mới ghi đè
// fontSize/fontWeight/color riêng - lấy đúng fontFamily Lexend (+
// letterSpacing) từ preset chung của dự án thay vì chỉ set fontSize/color
// trần (không đủ đảm bảo font family).
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    gap: 18,
  },
  title: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
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
    ...typography.titleM,
    color: 'var(--color-text-primary)',
  },
  statLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  statDivider: {
    width: 1,
    height: 34,
    backgroundColor: 'var(--color-border)',
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
