import { dmSans, inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 22.78,
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
    backgroundColor: '#FFF',
  },
  categoryItemName: {
    ...typography.subTitle2,
    color: '#212121',
  },
  title: {
    fontFamily: inter.style.fontFamily,
    fontWeight: '600',
    fontSize: 22.78,
    letterSpacing: 0.01,
    color: '#000',
  },
  description: {
    ...typography.body1,
    color: '#8D8D8D',
    paddingBottom: 12,
  },
  whatLearnTitle: {
    ...typography.subTitle1,
    color: '#FFA726',
  },
  learnedSkillText: {
    ...typography.subTitle2,
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
    color: '#21212199',
  },
  premium: {
    position: 'absolute',
    top: 8,
    zIndex: 2,
    left: 8,
    height: 34,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    ...typography.body2,
    backgroundColor: '#f05123',
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: 1,
    borderColor: '#f05123',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  totalLibrary: {
    ...typography.subTitle2,
    marginTop: 16,
    textAlign: 'center',
  },
  lessonContent: {
    marginTop: 30,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 12,
  },
  lessonContentTitle: {
    fontFamily: inter.style.fontFamily,
    fontWeight: '400',
    fontSize: 22.25,
    letterSpacing: 0.01,
    color: '#000',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonModule: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'white',
    gap: 16,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow
  },
  moduleItemTitle: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: 0.01,
    color: '#212121',
  },
  moduleItemTime: {
    ...typography.body2,
    color: '#8D8D8D',
  },
});

export default styles;
