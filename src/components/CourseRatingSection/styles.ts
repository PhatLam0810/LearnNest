import { StyleSheet, typography } from '@styles';

const CARD_BASE = {
  width: '100%',
  backgroundColor: 'var(--color-surface)',
  borderRadius: 12,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'var(--color-border)',
} as const;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 24,
  },
  // "Đánh giá của bạn" — tablet riêng, tách khỏi khối tổng kết/danh sách
  // nhận xét, cho phép sửa lại đánh giá cũ (title đổi thành "Sửa đánh giá
  // của bạn" khi đã có myRating).
  formCard: {
    ...CARD_BASE,
    padding: 24,
    gap: 16,
  },
  formTitle: {
    ...typography.titleS,
    color: 'var(--color-text-primary)',
  },
  formHint: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starPick: {
    cursor: 'pointer',
  },
  starFilledIconLarge: {
    color: 'var(--color-vhu-secondary)',
    fontSize: 32,
  },
  starOutlineIconLarge: {
    color: 'var(--color-text-disabled)',
    fontSize: 32,
  },
  submitButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
  },
  // "Đánh giá khóa học" — tổng kết điểm trung bình + phân bố theo sao.
  summaryCard: {
    ...CARD_BASE,
    padding: 24,
    gap: 20,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    ...typography.titleS,
    color: 'var(--color-text-primary)',
  },
  countLabel: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    alignItems: 'center',
  },
  averageBlock: {
    alignItems: 'flex-start',
    gap: 8,
    minWidth: 120,
  },
  averageNumber: {
    ...typography.titleM,
    color: 'var(--color-vhu-primary)',
  },
  averageStarsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  starFilledIcon: {
    color: 'var(--color-vhu-secondary)',
    fontSize: 16,
  },
  starOutlineIcon: {
    color: 'var(--color-text-disabled)',
    fontSize: 16,
  },
  breakdownBlock: {
    flex: 1,
    minWidth: 200,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    width: 32,
  },
  breakdownTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'var(--color-border-subtle)',
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'var(--color-vhu-secondary)',
  },
  breakdownPct: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    width: 40,
    textAlign: 'right',
  },
  // Danh sách nhận xét - mỗi review 1 khung riêng.
  reviewList: {
    gap: 16,
  },
  reviewCard: {
    ...CARD_BASE,
    padding: 16,
    gap: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewName: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  reviewStarsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  reviewStarIcon: {
    color: 'var(--color-vhu-secondary)',
    fontSize: 12,
  },
  reviewStarOutlineIcon: {
    color: 'var(--color-text-disabled)',
    fontSize: 12,
  },
  reviewDate: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
    flexShrink: 0,
  },
  reviewComment: {
    ...typography.body2,
    color: 'var(--color-text-body)',
    lineHeight: 21,
  },
  stateBox: {
    ...CARD_BASE,
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
  },
  errorBox: {
    backgroundColor: 'var(--color-error-bg)',
    borderWidth: 0,
  },
  emptyText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
    textAlign: 'center',
  },
  errorText: {
    ...typography.body2,
    color: 'var(--color-error)',
    textAlign: 'center',
  },
});

export default styles;
