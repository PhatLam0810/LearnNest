import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
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
    backgroundColor: 'var(--color-vhu-primary)',
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
  flex1: {
    flex: 1,
  },
  flex4: {
    flex: 4,
  },
  flex1_5: {
    flex: 1.5,
  },
  containerColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    scrollbarWidth: 'none',
  },
  rowLayout: {
    flexDirection: 'row',
    gap: 12,
  },
  fullWidth: {
    width: '100%',
  },
  buttonGap: {
    display: 'flex',
    gap: 8,
  },
  dropAreaLabel: {
    marginTop: 12,
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default styles;
