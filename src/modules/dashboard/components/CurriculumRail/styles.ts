import { StyleSheet, typography } from '@styles';

const CARD = {
  backgroundColor: 'var(--color-surface)',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'var(--color-border)',
  borderRadius: 12,
} as const;

const BUTTON_RESET = {
  display: 'flex',
  fontFamily: 'inherit',
  cursor: 'pointer',
  textAlign: 'left',
} as const;

const styles = StyleSheet.create({
  // Rail "Nội dung khóa học": cố định 340 trên desktop, full width khi xếp dọc.
  rail: {
    ...CARD,
    width: 340,
    flexShrink: 0,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  railMobile: {
    width: '100%',
  },
  railHeader: {
    gap: 8,
    paddingTop: 20,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
  },
  railTitle: {
    ...typography.titleS,
    color: 'var(--color-text-primary)',
  },
  railProgressLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'var(--color-border-subtle)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'var(--color-vhu-primary)',
  },
  railScroll: {
    flex: 1,
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
  },
  lessonRow: {
    ...BUTTON_RESET,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    minHeight: 56,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 17,
    paddingRight: 20,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
    backgroundColor: 'transparent',
  },
  lessonRowActive: {
    backgroundColor: 'var(--color-secondary-tint)',
    borderLeftColor: 'var(--color-vhu-secondary)',
  },
  lessonRowLocked: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  lessonIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    flexShrink: 0,
    fontSize: 16,
    color: 'var(--color-text-muted)',
  },
  lessonIconDone: {
    color: 'var(--color-success)',
  },
  lessonText: {
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  lessonTitle: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
  },
  lessonMeta: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  lessonState: {
    ...typography.caption,
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    flexShrink: 0,
  },
  lessonStateDone: {
    color: 'var(--color-success)',
  },
  lessonStateCurrent: {
    color: 'var(--color-vhu-primary)',
  },
});

export default styles;
