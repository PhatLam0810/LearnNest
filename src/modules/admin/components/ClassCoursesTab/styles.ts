import { StyleSheet, typography } from '@styles';

const BUTTON = {
  ...typography.buttonSmall,
  height: 32,
  paddingLeft: 12,
  paddingRight: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderStyle: 'solid',
  backgroundColor: 'var(--color-surface)',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  fontFamily: 'inherit',
} as const;

const styles = StyleSheet.create({
  wrap: {
    gap: 16,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  hint: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    flex: 1,
    minWidth: 200,
  },
  courseTitle: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
  },
  caption: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  rowActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  linkButton: {
    ...BUTTON,
    borderColor: 'var(--color-border-strong)',
    color: 'var(--color-vhu-primary)',
  },
  dangerButton: {
    ...BUTTON,
    borderColor: 'var(--color-error)',
    color: 'var(--color-error)',
  },
  centerState: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
  },
  errorState: {
    backgroundColor: 'var(--color-error-bg)',
    borderRadius: 12,
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
    textAlign: 'center',
  },
  skeletonWrap: {
    gap: 16,
    padding: 16,
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 8,
  },
  progressCell: {
    gap: 4,
    minWidth: 140,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
});

export default styles;
