import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eef0f5',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
    padding: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1c2536',
  },
  hint: {
    fontSize: 13,
    color: '#8D8D8D',
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
    color: '#5b6478',
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
    color: '#fff',
  },
});
export default styles;
