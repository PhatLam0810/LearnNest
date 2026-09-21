import { StyleSheet, typography } from '@styles';

// LƯU Ý: react-native-web's <View>/<Text> ÂM THẦM BỎ QUA `padding` dạng
// chuỗi rút gọn CSS (VD '22px 24px') - RN chỉ hiểu padding là số hoặc
// paddingTop/Right/Bottom/Left riêng lẻ. Dùng chuỗi rút gọn khiến toàn bộ
// padding biến mất (đã xác minh qua DOM thật). `replyTextarea` là ngoại lệ
// duy nhất được để nguyên chuỗi rút gọn vì áp trực tiếp vào <textarea> gốc
// (antd Input.TextArea), không qua View/Text nên không bị ảnh hưởng.
//
// Mọi style chữ khác spread ...typography.<preset> trước rồi ghi đè
// fontSize/fontWeight/color riêng - lấy đúng fontFamily Lexend từ preset
// chung của dự án thay vì chỉ set fontSize/color trần.
const styles = StyleSheet.create({
  detailPanel: {
    animationName: 'fadeInUp',
    animationDuration: '0.32s',
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    animationFillMode: 'both',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e9f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailHeader: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 24,
    paddingRight: 24,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#f1f3f7',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 20,
  },
  detailHeaderLeft: {
    flexDirection: 'row',
    gap: 14,
    minWidth: 0,
  },
  detailName: {
    ...typography.subTitle1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  detailMeta: {
    ...typography.caption,
    fontSize: 12,
    color: '#6b7280',
  },
  detailBody: {
    paddingTop: 22,
    paddingBottom: 22,
    paddingLeft: 24,
    paddingRight: 24,
    gap: 20,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#f7f9fc',
    borderRadius: 10,
  },
  lessonIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#eef3fb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  lessonTitle: {
    ...typography.buttonSmall,
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  sectionLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: '#9ca3af',
  },
  questionText: {
    ...typography.body1,
    fontSize: 15,
    lineHeight: 26,
    color: '#111827',
  },
  answerBox: {
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    borderLeftColor: 'var(--color-vhu-primary)',
    backgroundColor: '#f7f9fc',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 18,
    paddingRight: 18,
    gap: 8,
  },
  answerByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  answerByName: {
    ...typography.buttonSmall,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  answerByTime: {
    ...typography.caption,
    fontSize: 11,
    color: '#6b7280',
  },
  answerText: {
    ...typography.body2,
    fontSize: 14,
    lineHeight: 24,
    color: '#374151',
  },
  replyTextarea: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e9f0',
    borderRadius: 10,
    paddingTop: 14,
    paddingRight: 16,
    paddingBottom: 14,
    paddingLeft: 16,
    fontSize: 14,
    // Áp trực tiếp vào <textarea> gốc, không qua react-native-web Text - số
    // trần bị CSS coi là hệ số nhân chứ không tự thành px. Xem
    // qaInbox cũ / auditLogManage/styles.ts.modalCloseIcon cho cùng vấn đề.
    lineHeight: '24px',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
  },
  skippedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#f7f9fc',
    borderRadius: 10,
  },
  skippedText: {
    ...typography.body2,
    fontSize: 13,
    color: '#6b7280',
  },
  detailEmpty: {
    ...typography.body2,
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    fontSize: 13,
    color: '#9ca3af',
  },
});

export default styles;
