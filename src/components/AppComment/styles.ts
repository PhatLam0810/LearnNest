import { inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#0059c7',
    height: 200,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'column',
    gap: 16,
  },

  title: {
    margin: 0,
    color: 'white',
    ...typography.titleM,
  },
  subTitle: {
    fontFamily: inter.style.fontFamily,
    fontWeight: '400',
    fontSize: 22.25,
    letterSpacing: 0.01,
    color: '#000',
  },
  desc: {
    color: '#FFFFFF99',
    ...typography.body2,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
  },
  buttonTitle: {
    color: '#212121',
    ...typography.buttonSmall,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 8,
  },
  commentText: {
    marginTop: 8,
    fontSize: 14,
    flex: 1,
  },
});

export default styles;
