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
    ...typography.body2,
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
