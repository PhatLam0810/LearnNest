import { StyleSheet, typography } from '@styles';

// Mọi style chữ spread ...typography.<preset> trước rồi ghi đè
// fontSize/fontWeight/color riêng - lấy đúng fontFamily Lexend từ preset
// chung của dự án thay vì chỉ set fontSize/color trần.
const styles = StyleSheet.create({
  listPanel: {
    backgroundColor: '#fff',
    border: '1px solid #e5e9f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    padding: '15px 18px',
    borderTop: '1px solid #f1f3f7',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    cursor: 'pointer',
  },
  listItemHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listItemName: {
    ...typography.buttonSmall,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  listItemTime: {
    ...typography.caption,
    fontSize: 11,
    whiteSpace: 'nowrap',
  },
  listItemText: {
    ...typography.body2,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  listItemFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listItemLesson: {
    ...typography.caption,
    fontSize: 11,
    color: '#6b7280',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emptyListText: {
    ...typography.body2,
    // padding dạng chuỗi rút gọn bị react-native-web <Text> bỏ qua - viết
    // riêng từng cạnh (đã xác minh qua DOM thật, xem QnaInboxDetail/styles.ts).
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    fontSize: 13,
    color: '#9ca3af',
  },
});

export default styles;
