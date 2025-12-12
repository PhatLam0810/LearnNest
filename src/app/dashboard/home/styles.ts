import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    scrollbarWidth: 'none',
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
  section: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    gap: 12,
    overflow: 'visible',
  },
  sectionSpacing: {
    marginTop: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: { ...typography.titleS },
  recommendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
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
