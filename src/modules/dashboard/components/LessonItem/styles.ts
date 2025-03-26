import { dmSans, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: 325,
    padding: 12,
    backgroundColor: '#F9F9F9',
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
  },
  time: {
    ...typography.body2,
    fontSize: 12,
    color: '#8D8D8D',
  },
  btn: {
    position: 'absolute',
    top: 20,
    zIndex: 2,
    right: 16,
    height: 24,
    ...typography.body2,
    backgroundColor: '#FFFFFFFF',
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default styles;
