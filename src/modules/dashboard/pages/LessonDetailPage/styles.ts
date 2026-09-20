import { StyleSheet, typography } from '@styles';

const CARD = {
  backgroundColor: 'var(--color-surface)',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'var(--color-border)',
  borderRadius: 12,
  padding: 24,
  gap: 16,
} as const;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 24,
    paddingBottom: 48,
    paddingLeft: 24,
    paddingRight: 24,
  },
  containerMobile: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  grid: {
    display: 'grid',
    alignItems: 'start',
    gap: 24,
  },
  column: {
    gap: 24,
    minWidth: 0,
  },
  rail: {
    gap: 24,
    minWidth: 0,
  },
  railSticky: {
    position: 'sticky',
    top: 88,
    maxHeight: 'calc(100vh - 104px)',
    overflowY: 'auto',
  },
  cover: {
    position: 'relative',
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface-subtle)',
  },
  headerBlock: {
    gap: 12,
  },
  title: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
    lineHeight: 30,
  },
  titleMobile: {
    ...typography.titleMMobile,
    color: 'var(--color-text-primary)',
    lineHeight: 24,
  },
  metaLine: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingStars: {
    color: 'var(--color-vhu-secondary)',
  },
  ratingText: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  description: {
    ...typography.body1,
    color: 'var(--color-text-body)',
    lineHeight: 28,
  },
  card: {
    ...CARD,
  },
  cardTitle: {
    ...typography.titleS,
    color: 'var(--color-text-primary)',
  },
  cardSubTitle: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  progressLabel: {
    ...typography.body2,
    color: 'var(--color-text-body)',
  },
  progressPercent: {
    ...typography.subTitle2,
    color: 'var(--color-vhu-primary)',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'var(--color-border-subtle)',
    overflow: 'hidden',
  },
  progressFill: {
    transitionProperty: 'width',
    transitionDuration: '0.7s',
    transitionTimingFunction: 'cubic-bezier(0.22, 0.9, 0.28, 1)',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'var(--color-vhu-primary)',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  skillIcon: {
    color: 'var(--color-success)',
    marginTop: 4,
  },
  skillText: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    flex: 1,
    lineHeight: 21,
  },
  curriculum: {
    ...CARD,
    padding: 0,
    gap: 0,
    overflow: 'hidden',
  },
  curriculumHeader: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'var(--color-surface-subtle)',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
  },
  moduleTitle: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
    flex: 1,
    minWidth: 0,
  },
  moduleCount: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    whiteSpace: 'nowrap',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  rowMainLocked: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  chip: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: 'var(--color-surface-selected)',
  },
  chipDone: {
    backgroundColor: 'var(--color-success-bg)',
  },
  chipCurrent: {
    backgroundColor: 'var(--color-vhu-primary)',
  },
  chipText: {
    ...typography.caption,
    fontWeight: '500',
    color: 'var(--color-text-body)',
  },
  chipTextCurrent: {
    color: 'var(--color-text-on-primary)',
  },
  chipTextDone: {
    color: 'var(--color-success)',
  },
  rowText: {
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
  },
  rowMeta: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  stateText: {
    ...typography.caption,
    fontWeight: '500',
    whiteSpace: 'nowrap',
    minWidth: 56,
    textAlign: 'right',
  },
  stateDone: {
    color: 'var(--color-success)',
  },
  stateCurrent: {
    color: 'var(--color-vhu-primary)',
  },
  stateIdle: {
    color: 'var(--color-text-muted)',
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
    textAlign: 'center',
  },
  errorBox: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: 'var(--color-error-bg)',
    borderRadius: 12,
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
    textAlign: 'center',
  },
});

export default styles;
