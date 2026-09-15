import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  detailPanel: {
    backgroundColor: '#fff',
    border: '1px solid #e5e9f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailHeader: {
    padding: '20px 24px',
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
    padding: '22px 24px',
    gap: 20,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
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
    padding: '16px 18px',
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
    padding: '14px 16px',
    backgroundColor: '#f7f9fc',
    borderRadius: 10,
  },
  skippedText: {
    fontSize: 13,
    color: '#6b7280',
  },
  detailEmpty: {
    padding: '64px 20px',
    textAlign: 'center',
    fontSize: 13,
    color: '#9ca3af',
  },
});

export default styles;
