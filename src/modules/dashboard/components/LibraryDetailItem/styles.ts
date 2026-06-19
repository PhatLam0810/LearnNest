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
    backgroundColor: 'var(--color-vhu-primary)',
    alignSelf: 'flex-end',
    color: 'white',
    borderRadius: 8,
  },
  layoutTitleContainer: {
    width: '100%',
    display: 'flex',
    gap: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  layoutTitle: {
    ...typography.titleM,
    fontSize: 28,
  },
  modalWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },

  // HEADER
  modalHeader: {
    padding: 20,
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  modalSubTitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  // BODY
  modalBody: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  answerCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    border: '1px solid #eee',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
  },

  answerCardSelected: {
    border: '1px solid #1677ff',
    backgroundColor: '#e6f4ff',
    transform: 'scale(1.01)',
    boxShadow: '0 6px 18px rgba(22,119,255,0.15)',
  },

  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },

  answerText: {
    fontSize: 14,
    color: '#333',
  },

  // FOOTER
  modalFooter: {
    padding: 16,
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#fafafa',
  },

  submitButton: {
    color: '#f0f0f0',
    height: 40,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  quizContainer: {
    height: '100%',
    width: '100%',
    padding: 24,
    backgroundColor: '#f5f7fb',
    scrollbarWidth: 'none',
  },

  quizHeader: {
    marginBottom: 28,
    borderBottom: '1px solid #f3f4f6',
  },

  quizTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  quizDescription: {
    fontSize: 14,
    color: '#6b7280',
  },

  quizContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },

  questionCard: {
    border: '1px solid #edf2f7',
    borderRadius: 20,
    padding: 22,
    backgroundColor: '#ffffff',
    transition: 'all 0.25s ease',
  },

  questionCardInvalid: {
    border: '1px solid #fecaca',
  },

  questionTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 18,
  },

  questionNumber: {
    minWidth: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1d418a',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: 15,
  },

  questionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: '28px',
    flex: 1,
  },

  answerGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  answerOption: {
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: '4px 16px',
    backgroundColor: '#ffffff',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
  },

  answerOptionSelected: {
    border: '1px solid #1d418a',
    backgroundColor: '#e6f4ff',
    boxShadow: '0 6px 18px rgba(22,119,255,0.12)',
  },

  radioButton: {
    width: '100%',
  },

  answerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 0',
  },

  answerLetterBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: '700',
  },

  answerLetterBoxSelected: {
    backgroundColor: '#1d418a',
    color: '#ffffff',
  },

  answerLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },

  quizFooter: {
    marginTop: 36,
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: 24,
  },

  submitQuizButton: {
    height: 46,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 14,
    backgroundColor: '#1d418a',
    border: 'none',
    fontWeight: '600',
    fontSize: 14,
    boxShadow: '0 10px 25px rgba(22,119,255,0.25)',
  },

  // YouTube Player Container
  youtubeWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%', // 16:9 aspect ratio
  },

  youtubePlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default styles;
