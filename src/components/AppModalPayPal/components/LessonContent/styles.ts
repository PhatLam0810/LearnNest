import { inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    alignItems: 'center',
    flexDirection: 'row',
  },
  priceTitle: {
    marginTop: 8,
    fontFamily: inter.style.fontFamily,
    fontWeight: '600',
    fontSize: 24,
    letterSpacing: 0.01,
    color: '#f05123',
  },
  title: {
    fontFamily: inter.style.fontFamily,
    fontWeight: '600',
    fontSize: 20,
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
});

export default styles;
