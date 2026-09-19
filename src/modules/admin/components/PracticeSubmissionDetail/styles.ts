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
  section: {
    gap: 12,
  },
  sectionTitle: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  fileLink: {
    ...typography.buttonSmall,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-vhu-primary)',
    color: 'var(--color-vhu-primary)',
    textDecorationLine: 'none',
    backgroundColor: 'var(--color-surface)',
  },
  criterionText: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
  },
  criterionHint: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    marginTop: 4,
  },
  statusPass: {
    ...typography.caption,
    fontWeight: '500',
    color: 'var(--color-success)',
  },
  statusFail: {
    ...typography.caption,
    fontWeight: '500',
    color: 'var(--color-error)',
  },
  quoteBlock: {
    backgroundColor: 'var(--color-surface-subtle)',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  quoteText: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    lineHeight: 21,
  },
  overrideCard: {
    backgroundColor: 'var(--color-surface-subtle)',
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  fieldError: {
    ...typography.caption,
    color: 'var(--color-error)',
  },
  hint: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  overrideNote: {
    ...typography.body2,
    color: 'var(--color-info)',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});

export default styles;
