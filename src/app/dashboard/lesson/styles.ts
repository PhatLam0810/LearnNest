import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,

    borderRadius: 8,
  },
  lessonItem: {
    width: '100%',
    maxWidth: '19.6%',
    aspectRatio: 1,
  },
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
});

export default styles;
