import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  moduleCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'var(--color-border)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  moduleHeader: {
    // react-native-web KHÔNG hiểu shorthand CSS dạng chuỗi ('14px 18px') —
    // style system của nó chỉ nhận paddingVertical/paddingHorizontal (hoặc
    // paddingTop/Right/Bottom/Left) là số. Dùng chuỗi shorthand bị ÂM THẦM
    // BỎ QUA hoàn toàn (không lỗi, không warning) — đây là nguyên nhân thật
    // khiến cả khối "Theo nội dung khóa học" không có padding nào cả, đã
    // xác nhận bằng getComputedStyle thực tế (padding: 0px mọi cấp).
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: 'var(--color-surface-subtle)',
    borderBottomWidth: 1,
    borderBottomColor: 'var(--color-border)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleTitle: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemRow: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    display: 'flex',
    // react-native-web View mặc định flexDirection:'column' (khác CSS web
    // mặc định 'row') — thiếu dòng này là nguyên nhân thật khiến icon/tiêu
    // đề/tag/progress bar bị xếp chồng dọc thay vì nằm ngang 1 hàng.
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--color-border-subtle)',
    cursor: 'pointer',
    transitionProperty: 'background',
    transitionDuration: '0.15s',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemCountWrap: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 200,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemCountText: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    minWidth: 56,
    textAlign: 'right',
  },
  emptyModule: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    ...typography.caption,
    color: 'var(--color-text-disabled)',
  },
});

export default styles;
