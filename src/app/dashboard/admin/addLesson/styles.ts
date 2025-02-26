import { dmSans, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 20,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  formItemTitle: {
    ...typography.titleM,
  },
  btnContainerUpload: {
    display: 'flex',
    border: 0,
    background: 'none',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardItemContainer: {
    padding: 12,
    width: '24.5%',
    aspectRatio: 4 / 3,
    marginBottom: 6,
  },
  btn: {
    backgroundColor: '#ef405c',
  },
  libraryItem: {
    padding: 12,
    display: 'flex',
    width: '20%',
    aspectRatio: 4 / 3,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadCrop: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  draggableList: {
    paddingTop: 12,
  },
});

export default styles;
