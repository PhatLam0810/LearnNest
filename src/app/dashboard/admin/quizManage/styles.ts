import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  tabBody: { paddingTop: 20, flex: 1 },
  // Khung chứa toolbar + bảng/trạng thái của mỗi tab.
  tabContent: { gap: 16 },
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
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
    textAlign: 'center',
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
    textAlign: 'center',
  },
});

export default styles;
