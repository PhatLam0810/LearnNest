import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  body: { gap: 16 },
  hint: { ...typography.body2, color: 'var(--color-text-body)' },
  dropText: { ...typography.body2, color: 'var(--color-text-body)' },
  button: { width: 'auto', height: 44, alignSelf: 'flex-start' },
  list: { gap: 12, maxHeight: 420, overflowY: 'auto' },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border-subtle)',
    backgroundColor: 'var(--color-surface)',
  },
  itemBody: { flex: 1, minWidth: 0, gap: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  question: {
    ...typography.body2,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  answer: { ...typography.caption, color: 'var(--color-text-body)' },
  correct: {
    ...typography.caption,
    fontWeight: '600',
    color: 'var(--color-success)',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export default styles;
