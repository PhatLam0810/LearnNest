import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  text: {
    ...typography.body1,
    color: 'var(--color-text-muted)',
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 16 / 9,

    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'var(--color-overlay-subtle)',
  },
  comingSoonContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'var(--color-overlay-subtle)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  comingSoonText: {
    ...typography.body1,
    color: 'var(--color-text-muted)',
    textAlign: 'center',
  },
  shortContainer: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'var(--color-overlay-subtle)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  pdfContainer: {
    width: '100%',
    height: '80vh',
    backgroundColor: 'var(--color-overlay-subtle)',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  pdfFrame: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  fullscreenButton: {
    zIndex: 10,
    backgroundColor: 'var(--color-surface)',
    opacity: 0.95,
    paddingVertical: 6,
    paddingHorizontal: 12,
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    borderBottom: '1px solid var(--color-border-subtle)',
    backgroundColor: 'var(--color-surface-subtle)',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },

  modalSubTitle: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
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
    border: '1px solid var(--color-border-subtle)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'var(--color-surface)',
  },

  answerCardSelected: {
    border: '1px solid var(--color-vhu-primary)',
    backgroundColor: 'var(--color-info-bg)',
    transform: 'scale(1.01)',
    boxShadow: '0 6px 18px rgba(29,65,138,0.15)',
  },

  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'var(--color-surface-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },

  answerText: {
    fontSize: 14,
    color: 'var(--color-text-body)',
  },

  // FOOTER
  modalFooter: {
    padding: 16,
    borderTop: '1px solid var(--color-border-subtle)',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'var(--color-surface-subtle)',
  },

  submitButton: {
    color: 'var(--color-text-on-primary)',
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    height: 40,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  quizContainer: {
    height: '100%',
    width: '100%',
    padding: 24,
    backgroundColor: 'var(--color-surface-page)',
    scrollbarWidth: 'none',
  },

  quizContainerMobile: {
    padding: 12,
  },

  quizInfoCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },

  quizInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },

  quizInfoSubtitle: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    marginTop: 4,
  },

  quizProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  quizProgressLabel: {
    fontSize: 13,
    color: 'var(--color-text-body)',
    fontWeight: '500',
  },

  quizProgressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    backgroundColor: 'var(--color-border)',
    overflow: 'hidden',
    marginBottom: 16,
  },

  quizProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'var(--color-vhu-primary)',
  },

  quizNavButton: {
    height: 46,
    borderRadius: 14,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: '600',
    fontSize: 14,
  },

  quizNavGridCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },

  quizNavGridTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: 12,
  },

  quizNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  quizNavGridItem: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'var(--color-surface-subtle)',
    borderWidth: 1,
    borderColor: 'var(--color-border)',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  quizNavGridItemAnswered: {
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
  },

  quizNavGridItemCurrent: {
    borderColor: 'var(--color-vhu-secondary)',
    borderWidth: 2,
    backgroundColor: 'var(--color-warning-bg)',
  },

  quizNavGridItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },

  quizNavGridItemTextAnswered: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-text-on-primary)',
  },

  quizSubmitFromGridButton: {
    height: 42,
    borderRadius: 12,
    paddingLeft: 24,
    paddingRight: 24,
    fontWeight: '600',
    backgroundColor: 'var(--color-vhu-secondary)',
    border: 'none',
  },

  quizFlagButtonActive: {
    color: 'var(--color-warning)',
    borderColor: 'var(--color-vhu-secondary)',
    backgroundColor: 'var(--color-warning-bg)',
  },

  emptyQuizWrap: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-surface-page)',
    padding: 24,
  },

  emptyQuizText: {
    fontSize: 15,
    color: 'var(--color-text-muted)',
  },

  quizHeader: {
    marginBottom: 28,
    borderBottom: '1px solid var(--color-border-subtle)',
  },

  quizTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    marginBottom: 8,
  },

  quizDescription: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },

  quizContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },

  questionCard: {
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 20,
    padding: 22,
    backgroundColor: 'var(--color-surface)',
    transition: 'all 0.25s ease',
  },

  questionCardMobile: {
    borderRadius: 14,
    padding: 14,
  },

  questionCardInvalid: {
    border: '1px solid var(--color-error)',
  },

  questionTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 18,
  },

  questionTopMobile: {
    gap: 10,
    marginBottom: 12,
  },

  questionNumber: {
    minWidth: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'var(--color-vhu-primary)',
    color: 'var(--color-text-on-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: 15,
  },

  questionNumberMobile: {
    minWidth: 28,
    height: 28,
    borderRadius: 9,
    fontSize: 13,
  },

  questionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: '28px',
    flex: 1,
  },

  questionTextMobile: {
    fontSize: 14,
    lineHeight: '20px',
  },

  answerGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  answerOption: {
    border: '1px solid var(--color-border)',
    borderRadius: 16,
    padding: '4px 16px',
    backgroundColor: 'var(--color-surface)',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
  },

  answerOptionMobile: {
    borderRadius: 12,
    padding: '2px 10px',
  },

  answerOptionSelected: {
    border: '1px solid var(--color-vhu-primary)',
    backgroundColor: 'var(--color-info-bg)',
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

  answerContentMobile: {
    gap: 10,
    padding: '8px 0',
  },

  answerLetterBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'var(--color-surface-selected)',
    color: 'var(--color-text-body)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: '700',
  },

  answerLetterBoxMobile: {
    width: 24,
    height: 24,
    borderRadius: 8,
    fontSize: 12,
  },

  answerLetterBoxSelected: {
    backgroundColor: 'var(--color-vhu-primary)',
    color: 'var(--color-text-on-primary)',
  },

  answerLabel: {
    fontSize: 15,
    color: 'var(--color-text-body)',
    fontWeight: '500',
  },

  answerLabelMobile: {
    fontSize: 13,
    lineHeight: '18px',
  },

  quizFooter: {
    marginTop: 36,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 24,
  },

  quizFooterMobile: {
    marginTop: 20,
    paddingBottom: 12,
    flexWrap: 'wrap',
  },

  submitQuizButton: {
    height: 46,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 14,
    backgroundColor: 'var(--color-vhu-primary)',
    border: 'none',
    fontWeight: '600',
    fontSize: 14,
    boxShadow: '0 10px 25px rgba(22,119,255,0.25)',
  },

  submitQuizButtonMobile: {
    flex: 1,
    minWidth: 140,
    height: 42,
    paddingLeft: 16,
    paddingRight: 16,
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
