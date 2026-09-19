import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid var(--color-border-subtle)',
  },
  headerTitle: {
    ...typography.subTitle1,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  countTag: {
    ...typography.caption,
    fontWeight: 600,
    borderRadius: 999,
  },
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid var(--color-border-subtle)',
    backgroundColor: 'var(--color-surface)',
  },
  avatar: {
    width: 40,
    height: 40,
    fontSize: 15,
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    ...typography.body2,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meRow: {
    fontSize: 11,
    height: 20,
    lineHeight: '20px',
    margin: 0,
    borderRadius: 999,
  },
  doneTag: {
    fontSize: 11,
    height: 20,
    lineHeight: '20px',
    margin: 0,
    borderRadius: 999,
  },
  email: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    marginBottom: 6,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  progressRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarWrap: {
    flex: 1,
  },
  progressLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    minWidth: 34,
    textAlign: 'right',
  },
  metaRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  metaText: {
    fontSize: 11,
    color: 'var(--color-text-disabled)',
  },
  emptyWrap: {
    padding: '32px 0',
  },
  paginationRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTop: '1px solid var(--color-border-subtle)',
  },
  pageText: {
    ...typography.caption,
    color: 'var(--color-text-body)',
    minWidth: 60,
    textAlign: 'center',
  },
});

export default styles;
