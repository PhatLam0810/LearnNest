import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  headerWrapper: {
    marginBottom: 12,
  },
  pageTitle: {
    margin: 0,
    ...typography.titleM,
  },
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
});

export default styles;
