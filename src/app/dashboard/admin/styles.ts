import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: 'var(--color-surface, #fff)',
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
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
  },
  headerWrapper: {
    marginBottom: 16,
  },
  pageTitle: {
    margin: 0,
    ...typography.titleL,
    color: 'var(--color-text-primary)',
  },
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
  subTitle: {
    ...typography.body1,
  },
});

export default styles;
