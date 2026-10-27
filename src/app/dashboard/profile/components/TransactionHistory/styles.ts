import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  // Thẻ cùng kiểu với "Đổi mật khẩu" / "Học tập và thông báo".
  container: {
    width: '100%',
    gap: 16,
    backgroundColor: 'var(--color-surface)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
    borderBottomColor: 'var(--color-border-subtle)',
    borderLeftColor: 'var(--color-border-subtle)',
    borderRightColor: 'var(--color-border-subtle)',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
  },
  subTitle: {
    ...typography.body2,
    color: 'var(--color-text-body)',
  },
  status: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  errorPanel: {
    gap: 12,
    padding: 20,
    alignItems: 'flex-start',
    backgroundColor: 'var(--color-error-bg)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default styles;
