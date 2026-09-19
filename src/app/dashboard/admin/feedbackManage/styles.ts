import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
  },
  list: {
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: 'var(--color-surface)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'var(--color-border)',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
    padding: 20,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  name: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  time: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  tag: {
    ...typography.caption,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  content: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    lineHeight: 20,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  replyBox: {
    backgroundColor: 'var(--color-surface-page)',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    gap: 4,
  },
  replyLabel: {
    ...typography.caption,
    color: 'var(--color-vhu-primary)',
  },
  replyText: {
    ...typography.body2,
    color: 'var(--color-text-body)',
  },
  actionsCol: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    paddingVertical: 40,
  },
});

export default styles;
