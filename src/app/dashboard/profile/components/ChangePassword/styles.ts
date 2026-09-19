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
  hint: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    marginTop: 4,
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
  },
  fullField: {
    width: '100%',
    margin: 0,
    marginBottom: 16,
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
    marginBottom: 8,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  saveButton: {
    width: 'auto',
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    color: 'var(--color-text-on-primary)',
  },
});
export default styles;
