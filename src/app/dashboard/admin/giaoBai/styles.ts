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
    lineHeight: 21,
  },
  field: {
    gap: 8,
    flexGrow: 1,
    flexBasis: 240,
    minWidth: 0,
  },
  lessonField: {
    gap: 8,
    maxWidth: 480,
  },
  label: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  formCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 16,
    padding: 24,
    backgroundColor: 'var(--color-surface-subtle)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
  },
  listHeading: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  section: {
    gap: 12,
  },
  cellStrong: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
  },
  subjectTag: {
    ...typography.caption,
    fontWeight: '500',
    alignSelf: 'flex-start',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 6,
  },
  subjectExcel: {
    color: 'var(--color-success)',
    backgroundColor: 'var(--color-success-bg)',
  },
  subjectWord: {
    color: 'var(--color-info)',
    backgroundColor: 'var(--color-info-bg)',
  },
  taskCell: {
    gap: 4,
  },
  deleteButton: {
    ...typography.buttonSmall,
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-error)',
    backgroundColor: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  // Nút "Giao bài" khi form chưa đủ: thay màu disabled mặc định của antd.
  assignDisabled: {
    color: 'var(--color-text-disabled)',
    backgroundColor: 'var(--color-surface-selected)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
  },
  stateWrap: {
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
  errorWrap: {
    backgroundColor: 'var(--color-error-bg)',
    borderWidth: 0,
  },
  stateText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
    textAlign: 'center',
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
    textAlign: 'center',
  },
  skeletonWrap: {
    gap: 16,
    padding: 16,
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
  },
});

export default styles;
