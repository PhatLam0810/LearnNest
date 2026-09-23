import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  metaCell: {
    ...typography.body2,
    color: 'var(--color-text-body)',
  },
  actionButton: {
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: 'pointer',
    flexShrink: 0,
  },
  actionGroup: {
    flexWrap: 'nowrap',
  },
  actionButtonText: {
    ...typography.buttonSmall,
    color: 'var(--color-text-on-primary)',
    whiteSpace: 'nowrap',
  },
  // Style cũ (trước khi retrofit) — vẫn dùng cho bảng "Các phần" bên trong
  // Drawer quản lý nội dung, nằm ngoài phạm vi shell swap của task này nên
  // giữ nguyên y hệt, không đổi sang actionButton/actionButtonText.
  button: {
    backgroundColor: 'var(--color-vhu-primary)',
    padding: 4,
    minWidth: 70,
    borderColor: 'var(--color-vhu-primary)',
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    color: 'var(--color-text-on-primary)',
  },
});

export default styles;
