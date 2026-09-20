import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
    width: '100%',
  },
  title: {
    ...typography.titleS,
    color: 'var(--color-text-primary)',
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    borderRadius: 12,
  },
  info: {
    flexGrow: 1,
    flexBasis: 240,
    minWidth: 0,
    gap: 4,
  },
  classCode: {
    ...typography.caption,
    fontWeight: '600',
    color: 'var(--color-vhu-primary)',
  },
  courseTitle: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  deadline: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  deadlineEnded: {
    ...typography.caption,
    color: 'var(--color-error)',
  },
  progressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexGrow: 1,
    flexBasis: 200,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'var(--color-border-subtle)',
    overflow: 'hidden',
  },
  fill: {
    transitionProperty: 'width',
    transitionDuration: '0.7s',
    transitionTimingFunction: 'cubic-bezier(0.22, 0.9, 0.28, 1)',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'var(--color-vhu-primary)',
  },
  percent: {
    ...typography.subTitle2,
    color: 'var(--color-vhu-primary)',
    minWidth: 40,
    textAlign: 'right',
  },
  cta: {
    ...typography.buttonSmall,
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    borderWidth: 0,
    backgroundColor: 'var(--color-vhu-primary)',
    color: 'var(--color-text-on-primary)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  },
});

export default styles;
