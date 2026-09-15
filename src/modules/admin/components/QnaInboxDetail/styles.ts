import { StyleSheet } from '@styles';

// LƯU Ý: react-native-web's <View>/<Text> ÂM THẦM BỎ QUA `padding` dạng
// chuỗi rút gọn CSS (VD '22px 24px') - RN chỉ hiểu padding là số hoặc
// paddingTop/Right/Bottom/Left riêng lẻ. Dùng chuỗi rút gọn khiến toàn bộ
// padding biến mất (đã xác minh qua DOM thật). `replyTextarea` là ngoại lệ
// duy nhất được để nguyên chuỗi rút gọn vì áp trực tiếp vào <textarea> gốc
// (antd Input.TextArea), không qua View/Text nên không bị ảnh hưởng.
const styles = StyleSheet.create({
  detailPanel: {
    backgroundColor: '#fff',
    border: '1px solid #e5e9f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailHeader: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 24,
    paddingRight: 24,
    borderBottom: '1px solid #f1f3f7',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  detailMeta: {
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
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: '#9ca3af',
  },
  questionText: {
    fontSize: 15,
    lineHeight: 26,
    color: '#111827',
  },
  answerBox: {
    borderLeft: '3px solid var(--color-vhu-primary)',
    backgroundColor: '#f7f9fc',
    borderRadius: '0 10px 10px 0',
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
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  answerByTime: {
    fontSize: 11,
    color: '#6b7280',
  },
  answerText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#374151',
  },
  replyTextarea: {
    width: '100%',
    border: '1px solid #e5e9f0',
    borderRadius: 10,
    padding: '14px 16px',
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
    fontSize: 13,
    color: '#6b7280',
  },
  detailEmpty: {
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
