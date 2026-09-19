import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: 'var(--color-surface-subtle)',
    borderRadius: 12,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'var(--color-border)',
    boxShadow: '0 8px 20px rgba(29, 65, 138, 0.06)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    minWidth: 160,
  },
  statLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    textAlign: 'center',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  searchInput: {
    maxWidth: 320,
  },
  actionsRow: {
    display: 'flex',
    gap: 8,
  },
  learnerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  learnerCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'var(--color-border)',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    transition: 'box-shadow 0.2s',
  },
  learnerInfo: {
    flex: '1 1 220px',
    minWidth: 0,
  },
  learnerName: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
    marginBottom: 2,
  },
  learnerMeta: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  learnerProgressWrap: {
    flex: '1 1 200px',
    minWidth: 160,
  },
  learnerLastStudied: {
    flex: '0 0 160px',
    ...typography.caption,
    color: 'var(--color-text-muted)',
    textAlign: 'right',
  },
  learnerStatus: {
    flex: '0 0 120px',
    textAlign: 'right',
  },
  learnerReminder: {
    flex: '0 0 140px',
    textAlign: 'right',
  },
  reminderHint: {
    ...typography.caption,
    color: 'var(--color-text-disabled)',
  },
  paginationWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 12,
  },
  emptyState: {
    padding: 48,
    textAlign: 'center',
    color: 'var(--color-text-muted)',
  },
});

export default styles;
