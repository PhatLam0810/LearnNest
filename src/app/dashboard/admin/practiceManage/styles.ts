import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: 'pointer',
  },
  actionButtonText: {
    ...typography.buttonSmall,
    color: 'var(--color-text-on-primary)',
  },
});

export default styles;
