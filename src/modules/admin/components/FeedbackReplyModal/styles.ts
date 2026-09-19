import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  shell: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 28,
    paddingRight: 28,
    backgroundColor: 'var(--color-vhu-primary)',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minWidth: 0,
    flex: 1,
  },
  identityText: {
    gap: 4,
    minWidth: 0,
  },
  title: {
    ...typography.titleS,
    color: 'var(--color-text-on-primary)',
  },
  subline: {
    ...typography.body2,
    color: 'var(--color-text-on-primary-muted)',
  },
  closeButton: {
    ...typography.buttonSmall,
    height: 36,
    minWidth: 36,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-text-on-primary-muted)',
    backgroundColor: 'transparent',
    color: 'var(--color-text-on-primary)',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  body: {
    paddingTop: 24,
    paddingLeft: 28,
    paddingRight: 28,
    paddingBottom: 28,
    gap: 24,
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
  field: {
    gap: 8,
  },
  label: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  hint: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 12,
  },
});

export default styles;
