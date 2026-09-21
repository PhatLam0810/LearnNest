import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  card: {
    background: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e9f0',
    borderRadius: 12,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});

export default styles;
