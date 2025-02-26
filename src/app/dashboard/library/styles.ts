import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
});

export default styles;
