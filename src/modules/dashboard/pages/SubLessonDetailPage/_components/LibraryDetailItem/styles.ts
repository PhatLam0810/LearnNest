import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  text: {
    ...typography.body1,
    color: '#8D8D8D',
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#00000010',
  },
  shortContainer: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#00000010',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  pdfContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000010',
    borderRadius: 12,
    position: 'relative',
  },
  fullscreenButton: {
    zIndex: 10,
    backgroundColor: '#BABABA',
    opacity: 0.8,
    padding: 12,
    position: 'absolute',
    bottom: 16,
    left: 16,
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    opacity: 0.8,
  },
  questionTitle: {
    ...typography.titleM,
    marginBottom: 8,
  },
  answerTitle: {
    ...typography.subTitle2,
    fontSize: 16,
  },
  button: {
    ...typography.subTitle2,
    backgroundColor: '#ef405c',
    alignSelf: 'flex-end',
    color: 'white',
    borderRadius: 8,
  },
});

export default styles;
