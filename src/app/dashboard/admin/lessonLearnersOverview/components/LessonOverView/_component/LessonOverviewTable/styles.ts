import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  searchInput: {
    width: '100%',
  },
  searchInputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  searchInputStyle: {
    minWidth: 240,
  },
  courseTitleCell: {
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  learnerCountCell: {
    color: 'var(--color-vhu-primary)',
    fontWeight: 500,
  },
  modalContentWrap: {
    width: '100%',
  },
  modalToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
  },
  exportButtonStyle: {
    borderWidth: 0,
    backgroundColor: 'var(--color-vhu-primary)',
    color: 'var(--color-text-on-primary)',
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    borderRadius: 6,
    cursor: 'pointer',
  },
  modalSummaryText: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  panel: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'var(--color-border-subtle)',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  sectionSubtitle: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    marginTop: 4,
  },
  sectionBadge: {
    ...typography.caption,
    backgroundColor: 'var(--color-info-bg)',
    color: 'var(--color-info)',
    paddingTop: 4,
    paddingRight: 10,
    paddingBottom: 4,
    paddingLeft: 10,
    borderRadius: 999,
  },
  practiceSectionWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    backgroundColor: 'var(--color-surface-page)',
    borderWidth: 1,
    borderColor: 'var(--color-border)',
    borderRadius: 12,
    padding: 16,
  },
  practiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  practiceHeaderTitle: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  practiceHeaderSubtitle: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    marginTop: 4,
  },
  tableCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'var(--color-border)',
    overflow: 'hidden',
  },
});

export default styles;
