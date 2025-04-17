import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#0059c7',
    height: 200,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'column',
    gap: 16,
  },

  title: {
    margin: 0,
    color: 'white',
    ...typography.titleM,
  },
  subTitle: {
    ...typography.subTitle1,
  },
  desc: {
    color: '#FFFFFF99',
    ...typography.body2,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
  },
  buttonTitle: {
    color: '#212121',
    ...typography.buttonSmall,
  },
});

export default styles;
