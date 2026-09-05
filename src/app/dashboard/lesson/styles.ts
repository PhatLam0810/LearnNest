import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 0,
    gap: 16,
    overflow: 'visible',
  },
  header: {
    gap: 4,
  },
  pageTitle: {
    ...typography.titleM,
    fontSize: 28,
  },
  pageSubtitle: {
    ...typography.body1,
    color: '#8D8D8D',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterPill: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef0f5',
    cursor: 'pointer',
  },
  filterPillActive: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 999,
    backgroundColor: 'var(--color-vhu-primary)',
    borderWidth: 1,
    borderColor: 'var(--color-vhu-primary)',
    cursor: 'pointer',
  },
  filterPillText: {
    ...typography.body2,
    fontWeight: '500',
    color: '#212121',
  },
  filterPillTextActive: {
    ...typography.body2,
    fontWeight: '500',
    color: '#fff',
  },
  list: {
    overflow: 'visible',
    overflowY: 'visible',
    overflowX: 'visible',
  },
  listContent: {
    gap: 16,
    paddingBottom: 16,
    overflow: 'visible',
    overflowY: 'visible',
    overflowX: 'visible',
  },
  lessonItem: {
    width: '100%',
    maxWidth: '25%',
    minWidth: 0,
  },
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
});

export default styles;
