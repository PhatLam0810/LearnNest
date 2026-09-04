import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 6,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.06)',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    ...typography.body2,
    color: '#8D8D8D',
  },
  value: {
    ...typography.titleM,
    fontSize: 24,
  },
  caption: {
    ...typography.body2,
    color: '#8D8D8D',
  },
});

export default styles;
