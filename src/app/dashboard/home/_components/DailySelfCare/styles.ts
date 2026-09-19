import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: 'var(--color-vhu-primary)',
    height: 200,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'column',
    gap: 16,
  },

  title: {
    margin: 0,
    color: 'var(--color-text-on-primary)',
    ...typography.titleM,
  },
  subTitle: {
    color: 'var(--color-text-on-primary)',
    ...typography.subTitle1,
  },
  desc: {
    color: 'var(--color-text-on-primary)',
    ...typography.body2,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: 'var(--color-surface)',
    padding: 16,
    borderRadius: 8,
  },
  buttonTitle: {
    color: 'var(--color-text-primary)',
    ...typography.buttonSmall,
  },
});

export default styles;
