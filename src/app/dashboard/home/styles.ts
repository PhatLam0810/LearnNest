import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    scrollbarWidth: 'none',
    padding: 20,
  },

  content: {
    scrollbarWidth: 'none',
  },
  scrollView: { gap: 16 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  title: { ...typography.titleS },
  titleWrap: {},
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
