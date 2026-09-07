import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c2536',
  },
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eef0f5',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
    padding: 20,
    gap: 14,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c2536',
  },
  metaText: {
    fontSize: 13,
    color: '#8D8D8D',
  },
  commentBox: {
    backgroundColor: '#f5f7fb',
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  answeredTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    backgroundColor: '#eafbee',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  dismissedTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5b6478',
    backgroundColor: '#eef0f5',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  replyBox: {
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#8D8D8D',
    textAlign: 'center',
    paddingVertical: 40,
  },
});

export default styles;
