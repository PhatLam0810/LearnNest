import { StyleSheet } from '@styles';
import { lexend } from '@/styles/typography';

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eef0f5',
    paddingTop: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '600',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  replyingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eaf2ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  replyingText: {
    fontSize: 13,
    color: '#1d418a',
  },
  list: {
    gap: 4,
  },
  empty: {
    color: '#9aa5b8',
    fontSize: 14,
    paddingVertical: 12,
    textAlign: 'center',
  },
  commentRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
  },
  replyRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    marginTop: 8,
    marginLeft: 24,
    borderLeftWidth: 2,
    borderLeftColor: '#eef0f5',
    paddingLeft: 12,
  },
  commentBody: {
    flex: 1,
    gap: 2,
  },
  commentAuthor: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '600',
    fontSize: 13.5,
  },
  commentText: {
    fontSize: 14,
    color: '#1c2536',
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 4,
    alignItems: 'center',
  },
  commentTime: {
    fontSize: 12,
    color: '#9aa5b8',
  },
  actionLink: {
    fontSize: 12,
    color: '#5b6478',
    cursor: 'pointer',
    fontWeight: '500',
  },
  deleteLink: {
    color: '#c0392b',
  },
  editRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});

export default styles;
