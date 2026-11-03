import { StyleSheet, typography } from '@styles';

// Chỉ dùng property CSS tách riêng (paddingTop/Right/Bottom/Left,
// borderXWidth/Style/Color...), không dùng shorthand string nhiều giá trị -
// shorthand bị react-native-web âm thầm bỏ qua trong bản `next build` thật
// (xem giải thích chi tiết ở NotFoundPage/styles.ts).
const styles = StyleSheet.create({
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7fb',
  },
  header: {
    height: 72,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#f0f0f0',
    paddingTop: 0,
    paddingRight: 24,
    paddingBottom: 0,
    paddingLeft: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerMobile: {
    paddingRight: 16,
    paddingLeft: 16,
  },
  logoLink: { textDecoration: 'none' },
  logoText: {
    ...typography.titleM,
    fontSize: 24,
    color: 'var(--color-vhu-primary)',
  },
  homeLink: { textDecoration: 'none' },
  homeLinkText: {
    ...typography.body2,
    color: '#374151',
  },

  body: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    paddingTop: 48,
    paddingRight: 24,
    paddingBottom: 64,
    paddingLeft: 24,
  },
  container: {
    width: '100%',
    maxWidth: 760,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  h1: {
    ...typography.titleL,
    lineHeight: 36,
    color: '#111827',
  },
  h1Mobile: {
    fontSize: 24,
    lineHeight: 30,
  },
  updatedAt: {
    ...typography.caption,
    lineHeight: 18,
    color: '#9ca3af',
    marginBottom: 16,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  h2: {
    ...typography.subTitle1,
    lineHeight: 24,
    color: 'var(--color-vhu-primary)',
  },
  p: {
    ...typography.body1,
    lineHeight: 26,
    color: '#374151',
  },
  liRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 4,
  },
  liBullet: {
    ...typography.body1,
    lineHeight: 26,
    color: 'var(--color-vhu-primary)',
  },
  liText: {
    ...typography.body1,
    lineHeight: 26,
    color: '#374151',
    flex: 1,
  },

  footer: {
    paddingTop: 20,
    paddingRight: 24,
    paddingBottom: 20,
    paddingLeft: 24,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#e9edf4',
    textAlign: 'center',
  },
  footerText: {
    ...typography.caption,
    lineHeight: 18,
    color: '#6b7280',
  },
});

export default styles;
