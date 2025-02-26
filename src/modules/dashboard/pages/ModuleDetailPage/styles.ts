import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  title: {
    ...typography.titleM,
  },
  subTitle: {
    ...typography.body1,
    color: '#8D8D8D',
  },
});

export default styles;
