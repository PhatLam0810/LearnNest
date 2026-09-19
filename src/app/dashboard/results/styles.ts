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
    color: 'var(--color-text-primary)',
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
    color: 'var(--color-success)',
  },
  scoreOk: {
    color: 'var(--color-warning)',
  },
  scoreBad: {
    color: 'var(--color-error)',
  },
});

export default styles;
