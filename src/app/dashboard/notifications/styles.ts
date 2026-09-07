import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    ...typography.titleM,
    fontSize: 28,
    fontWeight: '700',
    color: '#1c2536',
    marginBottom: 20,
  },
});

export default styles;
