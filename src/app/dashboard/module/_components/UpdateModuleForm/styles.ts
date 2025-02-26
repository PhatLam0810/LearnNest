import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: '100%',
  },
  modal: {
    flex: 1,
    width: '50%',
    height: '50%',
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  libraryItemSelected: {
    borderWidth: 2,
    borderColor: '#FD2159',
  },
  btn: {
    backgroundColor: '#ef405c',
  },
  libraryItem: {
    padding: 12,
    width: '20%',
    aspectRatio: 4 / 3,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectContainer: {
    overflowY: 'scroll',
  },
});

export default styles;
