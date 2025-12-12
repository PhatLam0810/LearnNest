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
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
  sortColumn: {
    gap: 4,
    minWidth: 140,
  },
});

export default styles;
