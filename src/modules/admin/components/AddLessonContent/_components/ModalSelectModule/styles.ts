import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
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
    alignSelf: 'flex-end',
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
  buttonAddNew: {
    alignSelf: 'flex-start',
    backgroundColor: '#FD2159',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    marginTop: 20,
  },
});

export default styles;
