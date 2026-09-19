import { lexend, inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  title: {
    ...typography.titleM,
  },
  subTitle: {
    ...typography.body1,
    color: 'var(--color-text-muted)',
  },
  headerTitle: {
    ...typography.titleM,
    fontWeight: '600',
  },
  chip: {
    ...typography.titleS,
  },
  categoryItem: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    backgroundColor: 'var(--color-surface)',
  },
  categoryItemName: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  description: {
    ...typography.body1,
    color: 'var(--color-text-muted)',
    paddingBottom: 12,
  },
  whatLearnTitle: {
    ...typography.subTitle1,
    color: 'var(--color-vhu-secondary)',
  },
  learnedSkillText: {
    ...typography.subTitle1,
    margin: 0,
  },
  moduleContentHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillLearnedItem: {
    ...typography.body2,
    color: 'var(--color-text-scrim)',
  },
  lessonContent: {
    flex: 1,
  },
  lessonContentTitle: {
    ...typography.titleS,
  },
  button: {
    backgroundColor: 'var(--color-vhu-primary)',
    alignSelf: 'flex-start',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
  },
  buttonModule: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'white',
    gap: 16,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow
  },
  moduleItemTitle: {
    ...typography.body1,
    fontFamily: lexend.style.fontFamily,
    letterSpacing: 0.01,
    color: 'var(--color-text-primary)',
  },
  moduleItemTime: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  layoutTitleContainer: {
    width: '100%',
    display: 'flex',
    gap: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  layoutTitle: {
    ...typography.titleM,
    fontSize: 28,
  },
});

export default styles;
