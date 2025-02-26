import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    padding: 12,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    ...typography.body1,
    color: '#212121',
  },
  subTitle: {
    ...typography.body2,
    color: '#8D8D8D',
  },
});

export default styles;
