import { dmSans, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minWidth: 0,
    padding: 0,
    backgroundColor: '#F9F9F9',
  },
  content: {
    padding: 12,
  },
  title: {
    color: '#212121',
    ...typography.subTitle1,
    marginBottom: 8,
    marginTop: 12,
    lineHeight: 22,
    minHeight: 44, // keep 2 lines height to align cards
  },
  desc: {
    color: '#8D8D8D',
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 0.01,
    lineHeight: 20,
    minHeight: 60, // keep 3 lines height to align cards
  },
  price: {
    ...typography.titleS,
    color: '#f05123',
  },
  time: {
    ...typography.body2,
    fontSize: 12,
    color: '#8D8D8D',
  },
  premium: {
    position: 'absolute',
    top: 8,
    zIndex: 2,
    left: 8,
    height: 32,
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
