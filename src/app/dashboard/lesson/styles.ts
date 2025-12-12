import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 0,
    backgroundColor: 'transparent',
    borderRadius: 0,
    gap: 16,
    overflow: 'visible',
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
    maxWidth: '24%',
    minWidth: 0,
  },
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
});

export default styles;
