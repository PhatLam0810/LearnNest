import { inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    ...typography.titleS,
  },
  subTitle: {
    ...typography.titleM,
  },
  row: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    ...typography.body1,
  },
  rowSubTitle: {
    ...typography.subTitle2,
  },
  buttonContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 8,
  },
  cancelButton: {
    ...typography.button,
    backgroundColor: 'transparent',
    width: '100%',
  },
  verifyButton: {
    ...typography.button,
    width: '100%',
    backgroundColor: '#ef405c',
    color: '#FFF',
  },
});

export default styles;
