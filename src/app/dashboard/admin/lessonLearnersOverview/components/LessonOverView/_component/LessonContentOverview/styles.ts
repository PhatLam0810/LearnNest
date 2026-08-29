import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  moduleHeader: {
    padding: '14px 18px',
    backgroundColor: '#f7f9fc',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemRow: {
    padding: '10px 18px',
    display: 'flex',
    // react-native-web View mặc định flexDirection:'column' (khác CSS web
    // mặc định 'row') — thiếu dòng này là nguyên nhân thật khiến icon/tiêu
    // đề/tag/progress bar bị xếp chồng dọc thay vì nằm ngang 1 hàng.
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
    transition: 'background 0.15s',
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
    fontSize: 14,
    color: '#111827',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemCountWrap: {
    flex: '0 0 200px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemCountText: {
    fontSize: 13,
    color: '#6b7280',
    minWidth: 56,
    textAlign: 'right',
  },
  emptyModule: {
    padding: '10px 18px',
    color: '#9ca3af',
    fontSize: 13,
  },
});

export default styles;
