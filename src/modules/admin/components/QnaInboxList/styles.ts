import { StyleSheet } from '@styles';

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
    fontSize: 11,
    whiteSpace: 'nowrap',
  },
  listItemText: {
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
    fontSize: 11,
    color: '#6b7280',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emptyListText: {
    padding: '44px 20px',
    textAlign: 'center',
    fontSize: 13,
    color: '#9ca3af',
  },
});

export default styles;
