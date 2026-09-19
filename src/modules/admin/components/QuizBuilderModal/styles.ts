import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: 28,
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingRight: 4,
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  emptyQuestions: {
    paddingTop: 44,
    paddingBottom: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyQuestionsText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
  },
  questionCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'var(--color-vhu-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  indexBadgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: 'var(--color-text-on-primary)',
  },
  questionInput: {
    flex: 1,
    height: 44,
  },
  removeQuestionButton: {
    width: 42,
    height: 32,
    backgroundColor: 'var(--color-vhu-primary)',
    borderWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flexShrink: 0,
  },
  answersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingLeft: 40,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  answerInput: {
    flex: 1,
  },
  answerDeleteButton: {
    width: 32,
    height: 32,
    backgroundColor: 'var(--color-vhu-primary)',
    borderWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flexShrink: 0,
  },
  errorText: {
    ...typography.caption,
    color: 'var(--color-error)',
    paddingLeft: 40,
  },
  explanationInput: {
    marginLeft: 40,
    width: 'auto',
  },
  addQuestionButton: {
    height: 48,
  },
  settingsPanel: {
    position: 'sticky',
    top: 96,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  fullWidth: {
    width: '100%',
  },
  summaryBox: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  summaryValue: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  submitButton: {
    height: 48,
    marginTop: 20,
  },
});

export default styles;
