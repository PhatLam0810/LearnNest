import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
  youtubeWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
  },
  shortWrap: {
    height: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default styles;
