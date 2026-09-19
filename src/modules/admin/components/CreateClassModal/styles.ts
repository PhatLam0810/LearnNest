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
  headerText: {
    gap: 4,
    minWidth: 0,
    flex: 1,
  },
  title: {
    ...typography.titleS,
    color: 'var(--color-text-on-primary)',
  },
  subline: {
    ...typography.body2,
    color: 'var(--color-text-on-primary-muted)',
  },
  body: {
    paddingTop: 24,
    paddingLeft: 28,
    paddingRight: 28,
    paddingBottom: 28,
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  required: {
    color: 'var(--color-error)',
  },
  hint: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  error: {
    ...typography.caption,
    color: 'var(--color-error)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 12,
  },
});

export default styles;
