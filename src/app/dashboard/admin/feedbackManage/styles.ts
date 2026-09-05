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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eef0f5',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
    padding: 20,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c2536',
  },
  time: {
    fontSize: 13,
    color: '#8D8D8D',
  },
  tag: {
    fontSize: 12,
    fontWeight: '600',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  content: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  replyBox: {
    backgroundColor: '#f5f7fb',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    gap: 4,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d418a',
  },
  replyText: {
    fontSize: 13,
    color: '#333',
  },
  actionsCol: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
  },
  emptyText: {
    fontSize: 14,
    color: '#8D8D8D',
    textAlign: 'center',
    paddingVertical: 40,
  },
});

export default styles;
