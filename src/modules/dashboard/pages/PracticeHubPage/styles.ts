import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    paddingTop: 20,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 8,
  },
  title: { ...typography.titleL, color: 'var(--color-text-primary)' },
  quizWrap: {
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    paddingTop: 16,
    paddingBottom: 48,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 12,
  },
  hint: { ...typography.body2, color: 'var(--color-text-muted)' },
});

export default styles;
