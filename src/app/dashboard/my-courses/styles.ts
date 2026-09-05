import { StyleSheet, typography } from '@styles';

const CARD_BASE = {
  backgroundColor: '#fff',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#eef0f5',
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
    color: '#1c2536',
  },
  pageSubtitle: {
    ...typography.body1,
    color: '#8D8D8D',
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
    color: '#1c2536',
  },
  cardMeta: {
    fontSize: 13,
    color: '#8D8D8D',
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
    backgroundColor: '#dfe4ee',
    minHeight: 4,
  },
  barFillActive: {
    backgroundColor: 'var(--color-vhu-primary)',
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5b6478',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f3f6',
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c2536',
  },
  resultDate: {
    fontSize: 12,
    color: '#8D8D8D',
    marginTop: 2,
  },
  resultScore: {
    fontSize: 17,
    fontWeight: '700',
  },
  scoreGood: {
    color: '#16a34a',
  },
  scoreOk: {
    color: '#d97706',
  },
  scoreBad: {
    color: '#dc2626',
  },
  emptyText: {
    fontSize: 13,
    color: '#8D8D8D',
    paddingVertical: 8,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: 'var(--color-vhu-primary)',
    marginTop: 4,
  },
  aiSuggestionBox: {
    backgroundColor: '#eaf2ff',
    borderRadius: 14,
    padding: 20,
    gap: 10,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1d418a',
  },
  aiText: {
    fontSize: 14,
    color: '#28406e',
    lineHeight: 20,
  },
  aiButton: {
    width: 'auto',
    alignSelf: 'flex-start',
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c2536',
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
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f3f6',
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
    color: '#1c2536',
  },
  completedCell: {
    fontSize: 14,
    color: '#5b6478',
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
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'var(--color-vhu-primary)',
  },
  progressFillDone: {
    backgroundColor: '#16a34a',
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5b6478',
    width: 60,
    textAlign: 'right' as const,
  },
  progressPctDone: {
    color: '#16a34a',
  },
  lastStudiedCell: {
    fontSize: 13,
    color: '#8D8D8D',
  },
  emptyState: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
