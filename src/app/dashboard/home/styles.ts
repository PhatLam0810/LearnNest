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
    backgroundColor: '#fff8f0',
    borderWidth: 1,
    borderColor: '#ffe0b2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    cursor: 'pointer',
  },
  retryBannerText: {
    ...typography.body2,
    fontSize: 14,
    color: '#7a5a2e',
    flexShrink: 1,
  },
  retryBannerCta: {
    ...typography.body2,
    fontSize: 13,
    fontWeight: '700',
    color: '#b26a00',
    flexShrink: 0,
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
    color: '#8D8D8D',
  },
});

export default styles;
