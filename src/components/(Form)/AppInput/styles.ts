import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    ...typography.body1,
    width: '100%',
    height: 56,
    backgroundColor: '#F9F9F9',
    borderWidth: 0,
  },
  filled: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },
});

export default styles;
