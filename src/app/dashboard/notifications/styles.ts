import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    ...typography.titleL,
    color: 'var(--color-text-primary)',
    marginBottom: 20,
  },
});

export default styles;
