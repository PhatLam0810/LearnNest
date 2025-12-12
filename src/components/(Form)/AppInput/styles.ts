import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    ...typography.body1,
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filled: {
    backgroundColor: '#FFFFFF',
  },
});

export default styles;
