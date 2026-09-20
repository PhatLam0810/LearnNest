import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  title: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
    paddingBottom: 4,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    minHeight: 44,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  taskTitle: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    flex: 1,
    minWidth: 0,
  },
  due: {
    ...typography.body2,
    fontWeight: '600',
    color: 'var(--color-warning)',
    flexShrink: 0,
  },
  dueOverdue: {
    ...typography.body2,
    fontWeight: '600',
    color: 'var(--color-error)',
    flexShrink: 0,
  },
});

export default styles;
