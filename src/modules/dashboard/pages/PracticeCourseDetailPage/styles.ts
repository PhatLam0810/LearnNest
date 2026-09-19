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
  container: {
    flex: 1,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
  },
  containerMobile: {
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
  },
  backBar: {
    ...BUTTON_RESET,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    minHeight: 44,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  backBarIcon: {
    fontSize: 12,
    color: 'var(--color-vhu-primary)',
  },
  backBarText: {
    ...typography.buttonSmall,
    color: 'var(--color-vhu-primary)',
  },
  titleRow: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  pageTitle: {
    ...typography.titleM,
    color: 'var(--color-text-primary)',
    lineHeight: 30,
  },
  layoutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  layoutRowMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  mainColumn: {
    flex: 1,
    minWidth: 0,
  },
  skeletonColumn: {
    gap: 24,
  },
  stateBox: {
    ...CARD,
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
  },
  errorBox: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 12,
    backgroundColor: 'var(--color-error-bg)',
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
    textAlign: 'center',
  },
});

export default styles;
