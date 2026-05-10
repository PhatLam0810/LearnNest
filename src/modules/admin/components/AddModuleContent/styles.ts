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
  libraryItemSelected: {
    borderWidth: 2,
    borderColor: 'var(--color-vhu-primary)',
  },
  button: {
    backgroundColor: 'var(--color-vhu-primary)',
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
  libraryItem: {
    padding: 12,
    width: '20%',
    aspectRatio: 4 / 3,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
