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
    backgroundColor: 'var(--color-vhu-primary)',
    color: '#FFF',
  },
  // Inline style consolidations
  containerFlex: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
  },
  centerAlignGap8: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
  },
  iconSize64: {
    width: 64,
    height: 64,
    fontSize: 24,
  },
  transactionBox: {
    width: '100%',
    gap: 8,
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  successText: {
    color: '#47B881',
  },
  errorText: {
    color: '#f95f5b',
  },
});

export default styles;
