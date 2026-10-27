import { StyleSheet, typography } from '@styles';

const radius = (r: number) => ({
  borderTopLeftRadius: r,
  borderTopRightRadius: r,
  borderBottomLeftRadius: r,
  borderBottomRightRadius: r,
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: 16,
    padding: 24,
    backgroundColor: 'var(--color-surface)',
    ...radius(12),
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: 'var(--color-border)',
    borderRightColor: 'var(--color-border)',
    borderBottomColor: 'var(--color-border)',
    borderLeftColor: 'var(--color-border)',
  },
  skeleton: { minHeight: 96, backgroundColor: 'var(--color-surface-subtle)' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-surface-selected)',
    color: 'var(--color-text-muted)',
    ...radius(999),
  },
  iconActive: {
    backgroundColor: 'var(--color-vhu-secondary)',
    color: 'var(--color-text-primary)',
  },
  text: { flex: 1, flexBasis: 240, gap: 4 },
  title: {
    ...typography.subTitle1,
    lineHeight: 22,
    color: 'var(--color-text-primary)',
  },
  detail: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-body)',
  },
  warning: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'var(--color-warning-bg)',
    ...radius(8),
  },
  warningText: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-warning)',
  },
});

export default styles;
