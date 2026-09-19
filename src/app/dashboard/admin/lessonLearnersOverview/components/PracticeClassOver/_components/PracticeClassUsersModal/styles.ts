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
  badgeSuccessStyle: {
    ...typography.buttonSmall,
    backgroundColor: 'var(--color-vhu-primary)',
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
    border: 'none',
    backgroundColor: 'var(--color-vhu-primary)',
    color: 'var(--color-text-on-primary)',
    padding: '8px 12px',
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
    padding: '4px 10px',
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
  assignSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'var(--color-border-subtle)',
  },
  assignForm: {
    display: 'flex',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  assignRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '8px 12px',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'var(--color-border)',
    marginBottom: 8,
  },
});

export default styles;
