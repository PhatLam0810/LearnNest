import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-subtle)',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minWidth: 0,
    flex: 1,
  },
  // RNW mặc định flexShrink:0 — phải ghi 1 tường minh để tên/mô tả dài co lại
  // thay vì đẩy tràn ngang ở mobile.
  identityText: {
    gap: 4,
    minWidth: 0,
    flexShrink: 1,
  },
  name: {
    ...typography.titleS,
    color: 'var(--color-text-primary)',
  },
  meta: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  scoreBlock: {
    alignItems: 'flex-end',
    gap: 8,
  },
  score: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
  },
});

export default styles;
