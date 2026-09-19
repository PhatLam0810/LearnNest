import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
    ...typography.body1,
    color: 'var(--color-text-primary)',
  },
  subTitle: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  deleteButton: {
    width: 42,
    height: 32,
    backgroundColor: 'var(--color-vhu-primary)',
    borderWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flexShrink: 0,
  },
});

export default styles;
