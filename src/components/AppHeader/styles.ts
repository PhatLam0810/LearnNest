import { inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
  },
  middleContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: inter.style.fontFamily,
    fontWeight: '600',
    fontSize: 22.78,
    letterSpacing: 0.01,
  },
  subTitle: {
    ...typography.body1,
    color: '#8D8D8D',
  },
  rightContainer: {
    flex: 1,
  },
});

export default styles;
