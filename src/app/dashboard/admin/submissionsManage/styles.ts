import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  page: {
    width: '100%',
    gap: 24,
  },
  headerBlock: {
    gap: 4,
  },
  title: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
  },
  subtitle: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  pickerWrap: {
    flexGrow: 1,
    flexBasis: 320,
    maxWidth: 560,
  },
  bulkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  grid: {
    display: 'grid',
    gap: 24,
    alignItems: 'start',
  },
  idleCard: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
  },
  idleText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
    textAlign: 'center',
  },
  errorPanel: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: 'var(--color-error-bg)',
    borderRadius: 12,
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
  },
});

export default styles;
