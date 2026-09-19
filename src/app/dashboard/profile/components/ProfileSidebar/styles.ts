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
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    marginTop: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    marginTop: 4,
    textAlign: 'center',
  },
  changeAvatarBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'var(--color-border-strong)',
    cursor: 'pointer',
  },
  changeAvatarText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'var(--color-border-subtle)',
    marginTop: 20,
    marginBottom: 16,
  },
  joinedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  joinedLabel: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
  },
  joinedValue: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
});

export default styles;
