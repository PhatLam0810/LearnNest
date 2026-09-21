import { StyleSheet, typography } from '@styles';

// Mọi style chữ spread ...typography.<preset> trước rồi ghi đè
// fontSize/fontWeight/color riêng - lấy đúng fontFamily Lexend từ preset
// chung của dự án thay vì chỉ set fontSize/color trần.
const styles = StyleSheet.create({
  listPanel: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e9f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    animationName: 'fadeInUp',
    animationDuration: '0.32s',
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    animationFillMode: 'both',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '0.16s',
    transitionTimingFunction: 'ease',
    paddingTop: 15,
    paddingRight: 18,
    paddingBottom: 15,
    paddingLeft: 18,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#f1f3f7',
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
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#f1f3f7',
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
