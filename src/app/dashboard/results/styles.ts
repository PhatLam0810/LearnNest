import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    ...typography.titleM,
    fontSize: 28,
    fontWeight: '700',
    color: '#1c2536',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 4,
  },
  scoreCell: {
    fontSize: 15,
    fontWeight: '700',
  },
  scoreGood: {
    color: '#16a34a',
  },
  scoreOk: {
    color: '#d97706',
  },
  scoreBad: {
    color: '#dc2626',
  },
});

export default styles;
