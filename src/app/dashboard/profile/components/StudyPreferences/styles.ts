import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'var(--color-surface)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
    borderBottomColor: 'var(--color-border-subtle)',
    borderLeftColor: 'var(--color-border-subtle)',
    borderRightColor: 'var(--color-border-subtle)',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'var(--color-border-subtle)',
    marginTop: 14,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowTitle: {
    ...typography.subTitle2,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  rowSubtitle: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
    marginTop: 2,
  },
  notifList: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 12,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  dirtyHint: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  logoutLink: {
    ...typography.subTitle2,
    fontWeight: '600',
    color: 'var(--color-error)',
    cursor: 'pointer',
  },
});

export default styles;
