import { StyleSheet, typography } from '@styles';

const BORDER = {
  borderTopWidth: 1,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderTopStyle: 'solid',
  borderRightStyle: 'solid',
  borderBottomStyle: 'solid',
  borderLeftStyle: 'solid',
} as const;

const borderColor = (c: string) => ({
  borderTopColor: c,
  borderRightColor: c,
  borderBottomColor: c,
  borderLeftColor: c,
});

const styles = StyleSheet.create({
  card: {
    ...BORDER,
    ...borderColor('var(--color-border)'),
    backgroundColor: 'var(--color-surface)',
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  label: { ...typography.caption, color: 'var(--color-text-muted)' },
  time: {
    ...typography.titleM,
    color: 'var(--color-vhu-primary)',
  },
  timeWarn: { color: 'var(--color-error)' },
  submit: { width: '100%', height: 44 },
  hint: { ...typography.caption, color: 'var(--color-text-body)' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Không giãn các hàng khi lưới ít câu (minHeight lớn hơn nội dung).
    alignContent: 'flex-start',
    gap: 6,
    maxHeight: 'calc(100vh - 380px)',
    minHeight: 120,
    overflowY: 'auto',
    paddingTop: 2,
    paddingBottom: 2,
  },
  item: {
    width: 34,
    height: 34,
    borderRadius: 8,
    ...BORDER,
    ...borderColor('var(--color-border-strong)'),
    backgroundColor: 'var(--color-surface-subtle)',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  itemAnswered: {
    ...borderColor('var(--color-vhu-primary)'),
    backgroundColor: 'var(--color-vhu-primary)',
  },
  itemCurrent: {
    ...borderColor('var(--color-vhu-secondary)'),
    backgroundColor: 'var(--color-warning-bg)',
  },
  itemCorrect: {
    ...borderColor('var(--color-success)'),
    backgroundColor: 'var(--color-success-bg)',
  },
  itemWrong: {
    ...borderColor('var(--color-error)'),
    backgroundColor: 'var(--color-error-bg)',
  },
  itemText: {
    ...typography.caption,
    fontWeight: '600',
    color: 'var(--color-text-body)',
  },
  itemTextAnswered: { color: 'var(--color-text-on-primary)' },
});

export default styles;
