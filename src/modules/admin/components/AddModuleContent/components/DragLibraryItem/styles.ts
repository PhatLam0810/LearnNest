import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#8D8D8D',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    ...typography.body1,
    color: '#212121',
  },
  subTitle: {
    ...typography.body2,
    color: '#8D8D8D',
  },
});

export default styles;
