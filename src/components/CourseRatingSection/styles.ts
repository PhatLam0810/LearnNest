import { StyleSheet, typography } from '@styles';
import { lexend } from '@/styles/typography';

const font = lexend.style.fontFamily;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginTop: 24,
    gap: 20,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)',
  },
  title: {
    ...typography.titleS,
    fontSize: 20,
  },
  countLabel: {
    fontFamily: font,
    fontSize: 13,
    color: '#8D8D8D',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
    alignItems: 'center',
  },
  averageBlock: {
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 140,
  },
  averageNumber: {
    fontFamily: font,
    fontSize: 40,
    fontWeight: '700',
    color: 'var(--color-vhu-primary)',
  },
  averageStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  starFilledIcon: {
    color: '#f0c356',
    fontSize: 16,
  },
  starOutlineIcon: {
    color: '#c7ccd6',
    fontSize: 16,
  },
  breakdownBlock: {
    flex: 1,
    minWidth: 260,
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breakdownLabel: {
    fontFamily: font,
    fontSize: 12,
    color: '#8D8D8D',
    width: 28,
  },
  breakdownTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#f0c356',
  },
  breakdownPct: {
    fontFamily: font,
    fontSize: 12,
    color: '#8D8D8D',
    width: 36,
    textAlign: 'right' as const,
  },
  formBlock: {
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  formTitle: {
    fontFamily: font,
    fontSize: 15,
    fontWeight: '600',
    color: '#1c2536',
  },
  formHint: {
    fontFamily: font,
    fontSize: 13,
    color: '#8D8D8D',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  starPick: {
    cursor: 'pointer',
  },
  starFilledIconLarge: {
    color: '#f0c356',
    fontSize: 26,
  },
  starOutlineIconLarge: {
    color: '#c7ccd6',
    fontSize: 26,
  },
  reviewList: {
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reviewCard: {
    gap: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewName: {
    fontFamily: font,
    fontSize: 14,
    fontWeight: '600',
    color: '#1c2536',
  },
  reviewStarsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewStarIcon: {
    color: '#f0c356',
    fontSize: 12,
  },
  reviewStarOutlineIcon: {
    color: '#c7ccd6',
    fontSize: 12,
  },
  reviewDate: {
    fontFamily: font,
    fontSize: 12,
    color: '#8D8D8D',
    flexShrink: 0,
  },
  reviewComment: {
    fontFamily: font,
    fontSize: 14,
    lineHeight: '20px',
    color: '#333',
  },
});

export default styles;
