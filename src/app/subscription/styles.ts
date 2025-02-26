import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.subTitle1,
    fontSize: 30,
    color: '#FD2159',
  },
  subWrap: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subItem: {
    height: 500,
    width: 300,
    borderRadius: 12,
    borderWidth: 3,
    padding: 20,
    borderColor: '#FD2159',
  },
  itemTitle: {
    ...typography.subTitle1,
    fontSize: 20,
  },
  amountWrap: {
    width: '100%',
    padding: 12,
  },
  amount: {
    ...typography.subTitle1,
    fontSize: 24,
    color: 'white',
  },
  button: {
    width: '100%',
    alignSelf: 'flex-end',
  },
  buyNow: {
    ...typography.button,
    color: 'white',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  paypalButton: {
    backgroundColor: 'white',
    minWidth: 500,
    maxHeight: 800,
    padding: 12,
    borderRadius: 8,
    overflow: 'scroll',
  },
});

export default styles;
