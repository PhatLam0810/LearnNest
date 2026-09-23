import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 32,
    paddingLeft: 24,
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
  section: {
    width: '100%',
    gap: 16,
    overflow: 'visible',
  },
  sectionSpacing: {
    marginTop: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    ...typography.titleS,
    color: 'var(--color-text-primary)',
    fontWeight: '600',
    lineHeight: 28,
  },
  seeAllBtn: {
    color: 'var(--color-vhu-primary)',
    fontWeight: '600',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    width: 120,
    height: 'auto',
  },
  mainRow: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'flex-start',
    width: '100%',
  },
  mainRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  continuingCol: {
    flex: 2,
    minWidth: 0,
    gap: 16,
  },
  roadmapCol: {
    flex: 1,
    minWidth: 280,
    gap: 16,
  },
});

export default styles;
