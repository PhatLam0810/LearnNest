import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
  },
  clear: {
    ...typography.body2,
    color: 'var(--color-vhu-primary)',
    cursor: 'pointer',
  },
});

export default styles;
