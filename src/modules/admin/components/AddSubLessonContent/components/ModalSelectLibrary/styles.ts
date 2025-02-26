import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  modalContainer: {
    height: '90vh',
    width: '90vw',
    margin: 0,
    top: 0,
  },
  modal: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
  content: {
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  itemSelected: {
    borderWidth: 2,
    borderColor: '#FD2159',
  },
  button: {
    backgroundColor: '#FD2159',
    alignSelf: 'flex-start',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonAddNew: {
    alignSelf: 'flex-start',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
  },
});

export default styles;
