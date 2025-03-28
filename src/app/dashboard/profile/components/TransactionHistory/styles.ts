import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  button: {
    backgroundColor: '#ef405c',
    padding: 4,
    minWidth: 70,
    borderColor: '#ef405c',
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    color: '#FFF',
  },
  subTitle: {
    ...typography.body1,
  },
  status: {
    padding: 4,
    width: 80,
    borderRadius: 8,
  },
});

export default styles;
