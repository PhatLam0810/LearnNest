import { inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    ...typography.body1,
    height: 48,
    backgroundColor: '#ef405c',
    color: '#FFF',
  },
  buttonGroup: {
    flexDirection: 'column',
    gap: 16,
  },
});

export default styles;
