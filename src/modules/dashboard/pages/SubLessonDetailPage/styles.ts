import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    gap: 20,
  },
  header: { flexDirection: 'row', gap: 12, paddingTop: 8, paddingBottom: 8 },
  title: {
    ...typography.titleM,
  },
  subTitle: {
    ...typography.body1,
    color: '#8D8D8D',
  },
  content: { gap: 12, paddingTop: 12, paddingBottom: 12 },
  buttonSubLesson: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 24,
    gap: 16,
  },
  buttonSubLessonSelected: {
    backgroundColor: '#0059C7',
  },
  buttonSubLessonTitle: {
    ...typography.body1,
    color: '#212121',
  },
  buttonSubLessonTime: {
    ...typography.body2,
    color: '#8D8D8D',
  },
  buttonSubLessonTextSelected: {
    color: 'white',
  },

  currentSubLessonTitle: {
    ...typography.titleS,
    color: '#000',
  },
  divider: {
    width: '40%',
    height: 1,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#E3E3E3',
  },
  currentSubLessonDesc: {
    ...typography.body1,
    color: '#8D8D8D',
    paddingTop: 20,
  },
  currentSubLessonNote: {
    ...typography.body2,
    color: '#21212199',
  },
});

export default styles;
