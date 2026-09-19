import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: 250,
    aspectRatio: 16 / 9,
    padding: 12,
    backgroundColor: 'var(--color-surface-subtle)',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: 'var(--color-text-muted)',
  },
  chip: {
    ...typography.subTitle1,
    position: 'absolute',
    bottom: 24,
    left: 24,
    backgroundColor: 'var(--color-surface)',
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 12,
    paddingLeft: 12,
    textAlign: 'center',
    borderRadius: 8,
  },
  desc: {
    ...typography.caption,
    fontWeight: '300',
    color: 'var(--color-text-muted)',
  },
  icon: {
    backgroundColor: 'var(--color-surface-subtle)',
    width: 25,
    height: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
