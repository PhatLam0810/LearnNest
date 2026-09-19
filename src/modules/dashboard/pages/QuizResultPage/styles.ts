import { StyleSheet, typography } from '@styles';

const CARD = {
  backgroundColor: 'var(--color-surface)',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'var(--color-border)',
  borderRadius: 12,
} as const;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 880,
    // Cha không phải flex nên alignSelf vô tác dụng — căn giữa bằng margin auto.
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 24,
    paddingBottom: 48,
    paddingLeft: 20,
    paddingRight: 20,
  },
  containerMobile: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  card: {
    ...CARD,
    padding: 24,
    gap: 24,
  },
  cardMobile: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-subtle)',
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  scoreBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 96,
    height: 96,
    borderRadius: 999,
    borderWidth: 4,
    borderStyle: 'solid',
  },
  scoreBadgePass: {
    borderColor: 'var(--color-success)',
    backgroundColor: 'var(--color-success-bg)',
  },
  scoreBadgeFail: {
    borderColor: 'var(--color-error)',
    backgroundColor: 'var(--color-error-bg)',
  },
  scoreValue: {
    ...typography.titleM,
    lineHeight: 30,
  },
  scoreMax: {
    ...typography.caption,
    lineHeight: 18,
    color: 'var(--color-text-muted)',
  },
  scorePass: {
    color: 'var(--color-success)',
  },
  scoreFail: {
    color: 'var(--color-error)',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    ...typography.titleM,
    lineHeight: 30,
  },
  titleMobile: {
    ...typography.titleMMobile,
    lineHeight: 24,
  },
  quizTitle: {
    ...typography.subTitle1,
    lineHeight: 24,
    color: 'var(--color-text-primary)',
  },
  meta: {
    ...typography.body2,
    lineHeight: 21,
    color: 'var(--color-text-muted)',
  },
  quoteBlock: {
    backgroundColor: 'var(--color-surface-subtle)',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  quoteLabel: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  quoteText: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    lineHeight: 21,
  },
  notice: {
    backgroundColor: 'var(--color-info-bg)',
    borderRadius: 8,
    padding: 16,
  },
  noticeText: {
    ...typography.body2,
    color: 'var(--color-info)',
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
  },
  actionsMobile: {
    flexDirection: 'column',
  },
  errorPanel: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: 'var(--color-error-bg)',
    borderRadius: 12,
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
    textAlign: 'center',
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  skeletonText: {
    flex: 1,
    minWidth: 0,
  },
  skeletonQuestion: {
    gap: 12,
  },
});

export default styles;
