import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'var(--color-border-subtle)',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
    padding: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
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
    fontSize: 14,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  rowSubtitle: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    marginTop: 2,
  },
  notifList: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 12,
  },
  logoutLink: {
    fontSize: 14,
    fontWeight: '600',
    color: 'var(--color-error)',
    cursor: 'pointer',
  },
});

export default styles;
