import { StyleSheet, typography } from '@styles';

const radius = (r: number) => ({
  borderTopLeftRadius: r,
  borderTopRightRadius: r,
  borderBottomLeftRadius: r,
  borderBottomRightRadius: r,
});

const styles = StyleSheet.create({
  shell: { ...radius(14), overflow: 'hidden', flexDirection: 'column' },
  header: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 28,
    paddingRight: 28,
    backgroundColor: 'var(--color-vhu-primary)',
  },
  title: {
    ...typography.titleS,
    lineHeight: 26,
    color: 'var(--color-text-on-primary)',
  },
  body: {
    flexDirection: 'column',
    gap: 20,
    paddingTop: 24,
    paddingBottom: 28,
    paddingLeft: 28,
    paddingRight: 28,
  },
  summary: {
    gap: 12,
    padding: 16,
    backgroundColor: 'var(--color-surface-subtle)',
    ...radius(12),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    ...typography.subTitle2,
    lineHeight: 20,
    color: 'var(--color-text-primary)',
  },
  value: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-body)',
  },
  amount: {
    ...typography.subTitle1,
    lineHeight: 22,
    color: 'var(--color-vhu-primary)',
  },
  field: { gap: 8 },
  error: { ...typography.caption, lineHeight: 16, color: 'var(--color-error)' },
  note: {
    ...typography.caption,
    lineHeight: 16,
    color: 'var(--color-text-muted)',
  },
  actions: { flexDirection: 'column', gap: 12 },
  qrWrap: { alignItems: 'center' },
  waiting: {
    gap: 4,
    padding: 16,
    backgroundColor: 'var(--color-info-bg)',
    ...radius(12),
  },
});

export default styles;
