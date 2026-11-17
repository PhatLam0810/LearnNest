import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  wrap: { gap: 12, marginTop: 16, marginBottom: 16 },
  heading: { ...typography.titleS, color: 'var(--color-text-primary)' },
  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 14,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
    borderRightColor: 'var(--color-border-subtle)',
    borderBottomColor: 'var(--color-border-subtle)',
    borderLeftColor: 'var(--color-border-subtle)',
    backgroundColor: 'var(--color-surface)',
  },
  info: { flex: 1, minWidth: 200, gap: 2 },
  title: {
    ...typography.body2,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  meta: { ...typography.caption, color: 'var(--color-text-muted)' },
  button: { width: 'auto', height: 40 },
});

export default styles;
