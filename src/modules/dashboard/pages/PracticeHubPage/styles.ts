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
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 4 },
  tab: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 999,
    cursor: 'pointer',
  },
  tabActive: { backgroundColor: 'var(--color-info-bg)' },
  tabText: { ...typography.body2, color: 'var(--color-text-body)' },
  tabTextActive: { color: 'var(--color-vhu-primary)', fontWeight: '600' },
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
