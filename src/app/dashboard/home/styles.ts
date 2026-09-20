import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    padding: 20,
    overflow: 'visible',
  },
  content: {
    scrollbarWidth: 'none',
    gap: 24,
    overflow: 'visible',
  },
  contentContainer: {
    flexGrow: 1,
    gap: 24,
    overflow: 'visible',
  },
  scrollView: { gap: 16 },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  // Banner nhắc "bài cần làm lại" - đứng ngay dưới banner "tiếp tục học".
  retryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    backgroundColor: 'var(--color-warning-bg)',
    borderWidth: 1,
    borderColor: 'var(--color-warning-bg)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    cursor: 'pointer',
  },
  retryBannerText: {
    ...typography.body2,
    fontSize: 14,
    color: 'var(--color-warning)',
    flexShrink: 1,
  },
  retryBannerCta: {
    ...typography.body2,
    fontSize: 13,
    fontWeight: '700',
    color: 'var(--color-warning)',
    flexShrink: 0,
  },
  miniRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  miniCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'var(--color-border-subtle)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'var(--color-surface)',
    cursor: 'pointer',
  },
  miniIcon: {
    fontSize: 20,
  },
  miniLabel: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
    flex: 1,
  },
  miniValue: {
    ...typography.body2,
    fontSize: 16,
    fontWeight: '800',
    color: 'var(--color-text-primary)',
  },
  statIcon: {
    color: 'var(--color-vhu-primary)',
    fontSize: 16,
  },
  seeAllBtn: {
    color: 'var(--color-vhu-primary)',
    fontWeight: '600',
    padding: 0,
    width: 120,
    height: 'auto',
  },
  section: {
    width: '100%',
    alignSelf: 'center',
    gap: 12,
    overflow: 'visible',
  },
  sectionSpacing: {
    marginTop: 24,
  },
  mainRow: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'flex-start',
    marginTop: 24,
  },
  mainRowMobile: {
    flexDirection: 'column',
  },
  continuingCol: {
    flex: 2,
    minWidth: 0,
    gap: 12,
  },
  roadmapCol: {
    flex: 1,
    minWidth: 260,
    gap: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  title: { ...typography.titleS },
  recommendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    columnGap: 16,
    rowGap: 20,
    width: '100%',
    overflow: 'visible',
  },
  profileContainer: {
    padding: 8,
    alignItems: 'center',
  },
  nameContainer: {
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  name: {
    ...typography.subTitle1,
  },
  email: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
});

export default styles;
