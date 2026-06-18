import { dmSans, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minWidth: 0,
    padding: 0,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
  },
  content: {
    padding: 12,
  },
  cardThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    backgroundColor: 'gray',
    position: 'relative',
  },
  title: {
    color: '#212121',
    ...typography.subTitle1,
    marginBottom: 8,
    marginTop: 12,
  },
  desc: {
    color: '#8D8D8D',
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 0.01,
    lineHeight: 20,
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
