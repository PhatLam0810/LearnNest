import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  body: { gap: 20 },
  name: { ...typography.titleS, color: 'var(--color-text-primary)' },
  meta: { ...typography.body2, color: 'var(--color-text-muted)' },
  sectionTitle: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  empty: { ...typography.body2, color: 'var(--color-text-muted)' },
  course: {
    gap: 6,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-subtle)',
  },
  courseHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 12,
  },
  courseTitle: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
    flex: 1,
    minWidth: 0,
  },
  courseMeta: { ...typography.caption, color: 'var(--color-text-muted)' },
  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 4,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-subtle)',
  },
  activityTitle: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
    flex: 1,
    minWidth: 160,
  },
  date: { ...typography.caption, color: 'var(--color-text-muted)' },
  scoreGood: { ...typography.subTitle2, color: 'var(--color-success)' },
  scoreOk: { ...typography.subTitle2, color: 'var(--color-warning)' },
  scoreBad: { ...typography.subTitle2, color: 'var(--color-error)' },
  scoreNone: { ...typography.subTitle2, color: 'var(--color-text-muted)' },
});

export default styles;
