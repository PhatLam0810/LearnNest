import { StyleSheet, typography } from '@styles';

const CARD_BASE = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: 'var(--color-border-subtle)',
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
} as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  pageTitle: {
    ...typography.titleM,
    fontSize: 28,
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  pageSubtitle: {
    ...typography.body1,
    color: 'var(--color-text-muted)',
    marginTop: 4,
  },
  topRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    alignItems: 'stretch',
  },
  chartCard: {
    ...CARD_BASE,
    flex: 2,
    minWidth: 320,
    padding: 24,
    gap: 20,
  },
  resultsCard: {
    ...CARD_BASE,
    flex: 1,
    minWidth: 280,
    padding: 24,
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  cardMeta: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
    gap: 12,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    gap: 10,
  },
  barTrack: {
    width: 40,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'var(--color-border-strong)',
    minHeight: 4,
  },
  barFillActive: {
    backgroundColor: 'var(--color-vhu-primary)',
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--color-border-subtle)',
  },
  resultNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  resultTypeTag: {
    fontSize: 11,
    fontWeight: '600',
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  resultTypeTagQuiz: {
    color: 'var(--color-info)',
    backgroundColor: 'var(--color-info-bg)',
  },
  resultTypeTagPractice: {
    color: 'var(--color-warning)',
    backgroundColor: 'var(--color-warning-bg)',
  },
  resultTypeTagMockExam: {
    color: 'var(--color-success)',
    backgroundColor: 'var(--color-success-bg)',
  },
  resultDate: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    marginTop: 2,
  },
  resultScore: {
    fontSize: 17,
    fontWeight: '700',
  },
  scoreGood: {
    color: 'var(--color-success)',
  },
  scoreOk: {
    color: 'var(--color-warning)',
  },
  scoreBad: {
    color: 'var(--color-error)',
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
    paddingVertical: 8,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-vhu-primary)',
    marginTop: 4,
    cursor: 'pointer',
  },
  aiSuggestionBox: {
    backgroundColor: 'var(--color-info-bg)',
    borderRadius: 14,
    padding: 20,
    gap: 10,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'var(--color-vhu-primary)',
  },
  aiText: {
    ...typography.body2,
    color: 'var(--color-info)',
    lineHeight: 20,
  },
  aiButton: {
    width: 'auto',
    alignSelf: 'flex-start',
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    color: 'var(--color-text-on-primary)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  tableCard: {
    ...CARD_BASE,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: 'var(--color-vhu-primary)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 20,
  },
  tableHeaderCell: {
    fontSize: 13,
    fontWeight: '700',
    color: 'var(--color-table-header-text)',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--color-border-subtle)',
    cursor: 'pointer',
    gap: 20,
  },
  colCourse: {
    flex: 2,
    minWidth: 0,
  },
  colCompleted: {
    flex: 1,
  },
  colProgress: {
    flex: 2,
  },
  colLastStudied: {
    flex: 1,
  },
  courseNameCell: {
    fontSize: 14,
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  completedCell: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  progressCellRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
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
  progressFillDone: {
    backgroundColor: 'var(--color-success)',
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    width: 60,
    textAlign: 'right' as const,
  },
  progressPctDone: {
    color: 'var(--color-success)',
  },
  lastStudiedCell: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  emptyState: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
