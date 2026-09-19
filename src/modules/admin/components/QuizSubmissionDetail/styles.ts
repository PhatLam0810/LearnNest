import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
    padding: 24,
    gap: 24,
  },
  centerState: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: 'var(--color-error-bg)',
    borderRadius: 12,
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
  },
  quoteBlock: {
    backgroundColor: 'var(--color-surface-subtle)',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  quoteLabel: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  quoteText: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    lineHeight: 21,
  },
  notice: {
    backgroundColor: 'var(--color-info-bg)',
    borderRadius: 8,
    padding: 16,
  },
  noticeText: {
    ...typography.body2,
    color: 'var(--color-info)',
    lineHeight: 21,
  },
  questions: {
    gap: 20,
  },
  question: {
    gap: 12,
  },
  questionTitle: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
    lineHeight: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
  },
  optionCorrect: {
    borderColor: 'var(--color-success)',
    backgroundColor: 'var(--color-success-bg)',
  },
  optionWrong: {
    borderColor: 'var(--color-error)',
    backgroundColor: 'var(--color-error-bg)',
  },
  optionLetter: {
    ...typography.subTitle2,
    color: 'var(--color-text-muted)',
    width: 24,
  },
  optionText: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
    flex: 1,
  },
  optionTag: {
    ...typography.caption,
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  tagCorrect: {
    color: 'var(--color-success)',
  },
  tagWrong: {
    color: 'var(--color-error)',
  },
  unanswered: {
    ...typography.caption,
    color: 'var(--color-warning)',
  },
});

export default styles;
