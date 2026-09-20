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
  wrap: {
    width: '100%',
    gap: 24,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    ...CARD,
    flexGrow: 1,
    flexBasis: 220,
    gap: 8,
  },
  statLabel: {
    ...typography.body2,
    color: 'var(--color-text-body)',
  },
  statValue: {
    ...typography.titleM,
    lineHeight: 30,
    color: 'var(--color-vhu-primary)',
  },
  toneDanger: {
    color: 'var(--color-error)',
  },
  toneSuccess: {
    color: 'var(--color-success)',
  },
  statCaption: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  card: {
    ...CARD,
  },
  cardHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    ...typography.titleS,
    color: 'var(--color-text-primary)',
  },
  caption: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  strong: {
    ...typography.body2,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  dangerText: {
    ...typography.body2,
    color: 'var(--color-error)',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 200,
  },
  chartCol: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    gap: 4,
  },
  chartBarWrap: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartBar: {
    width: '60%',
    minHeight: 2,
    maxWidth: 56,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  barStudent: {
    backgroundColor: 'var(--color-vhu-primary)',
  },
  barGuest: {
    backgroundColor: 'var(--color-vhu-accent)',
  },
  chartValue: {
    ...typography.caption,
    color: 'var(--color-text-body)',
  },
  chartLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  twoCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    alignItems: 'flex-start',
  },
  colWide: {
    flexGrow: 2,
    flexBasis: 320,
    minWidth: 0,
  },
  colNarrow: {
    flexGrow: 1,
    flexBasis: 280,
    minWidth: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  summaryLabel: {
    ...typography.body2,
    color: 'var(--color-text-body)',
  },
  linkButton: {
    ...typography.buttonSmall,
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border-strong)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-vhu-primary)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  centerState: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
  },
  errorState: {
    backgroundColor: 'var(--color-error-bg)',
    borderRadius: 12,
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
    paddingTop: 24,
    paddingBottom: 24,
  },
});

export default styles;
