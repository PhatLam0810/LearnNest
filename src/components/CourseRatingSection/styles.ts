import { StyleSheet, typography } from '@styles';
import { lexend } from '@/styles/typography';

const font = lexend.style.fontFamily;

const CARD_BASE = {
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#eef0f5',
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
} as const;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 28,
    paddingBottom: 20,
    gap: 20,
  },
  // "Đánh giá của bạn" — tablet riêng, tách khỏi khối tổng kết/danh sách
  // nhận xét theo đúng yêu cầu, cho phép sửa lại đánh giá cũ (title đổi
  // thành "Sửa đánh giá của bạn" khi đã có myRating).
  formCard: {
    ...CARD_BASE,
    padding: 24,
    gap: 12,
  },
  formTitle: {
    fontFamily: font,
    fontSize: 20,
    fontWeight: '700',
    color: '#1c2536',
  },
  formHint: {
    fontFamily: font,
    fontSize: 14,
    color: '#8D8D8D',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starPick: {
    cursor: 'pointer',
  },
  starFilledIconLarge: {
    color: '#f0c356',
    fontSize: 30,
  },
  starOutlineIconLarge: {
    color: '#c7ccd6',
    fontSize: 30,
  },
  submitButton: {
    width: '100%',
    marginTop: 4,
    borderRadius: 999,
    height: 48,
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // "Đánh giá khóa học" — tổng kết điểm trung bình + phân bố theo sao,
  // cũng là 1 tablet riêng.
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
    fontSize: 22,
    fontWeight: '700',
  },
  countLabel: {
    fontFamily: font,
    fontSize: 14,
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
    gap: 6,
    minWidth: 140,
  },
  averageNumber: {
    fontFamily: font,
    fontSize: 44,
    fontWeight: '700',
    color: 'var(--color-vhu-primary)',
  },
  averageStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  starFilledIcon: {
    color: '#f0c356',
    fontSize: 18,
  },
  starOutlineIcon: {
    color: '#c7ccd6',
    fontSize: 18,
  },
  breakdownBlock: {
    flex: 1,
    minWidth: 260,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breakdownLabel: {
    fontFamily: font,
    fontSize: 13,
    color: '#8D8D8D',
    width: 30,
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
    fontSize: 13,
    color: '#8D8D8D',
    width: 38,
    textAlign: 'right' as const,
  },
  // Danh sách nhận xét - mỗi review 1 khung riêng (nền/viền/bo góc rõ ràng),
  // không còn chỉ ngăn cách bằng border-bottom mờ nhạt như trước.
  reviewList: {
    gap: 14,
  },
  reviewCard: {
    ...CARD_BASE,
    padding: 18,
    gap: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewName: {
    fontFamily: font,
    fontSize: 15,
    fontWeight: '600',
    color: '#1c2536',
  },
  reviewStarsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  reviewStarIcon: {
    color: '#f0c356',
    fontSize: 13,
  },
  reviewStarOutlineIcon: {
    color: '#c7ccd6',
    fontSize: 13,
  },
  reviewDate: {
    fontFamily: font,
    fontSize: 13,
    color: '#8D8D8D',
    flexShrink: 0,
  },
  reviewComment: {
    fontFamily: font,
    fontSize: 15,
    lineHeight: '22px',
    color: '#333',
  },
});

export default styles;
