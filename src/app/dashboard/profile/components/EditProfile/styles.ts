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
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 20,
  },
  fieldItem: {
    flex: 1,
    minWidth: 220,
    margin: 0,
    marginBottom: 16,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  cancelButton: {
    width: 'auto',
    backgroundColor: 'var(--color-surface)',
    borderColor: 'var(--color-border-strong)',
    color: 'var(--color-text-primary)',
  },
  saveButton: {
    width: 'auto',
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    color: 'var(--color-text-on-primary)',
  },
});
export default styles;
