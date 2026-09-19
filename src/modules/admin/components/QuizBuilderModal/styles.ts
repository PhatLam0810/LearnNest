import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  shell: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 28,
    paddingRight: 28,
    backgroundColor: 'var(--color-vhu-primary)',
  },
  // Mobile: thu lề ngang để vùng nhập không bị bóp hẹp ở 375px.
  headerMobile: {
    gap: 12,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerText: {
    gap: 4,
    minWidth: 0,
    flex: 1,
  },
  title: {
    ...typography.titleS,
    color: 'var(--color-text-on-primary)',
  },
  subline: {
    ...typography.body2,
    color: 'var(--color-text-on-primary-muted)',
  },
  closeButton: {
    ...typography.buttonSmall,
    height: 36,
    minWidth: 36,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-text-on-primary-muted)',
    backgroundColor: 'transparent',
    color: 'var(--color-text-on-primary)',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  body: {
    paddingTop: 24,
    paddingLeft: 28,
    paddingRight: 28,
    paddingBottom: 28,
  },
  bodyMobile: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: 24,
    maxHeight: '60vh',
    overflowY: 'auto',
  },
  // Mobile (<600): 1 cột, cột thiết lập nằm dưới danh sách câu hỏi.
  // minmax(0, 1fr): '1fr' có min auto nên nội dung dài đẩy cột tràn ngang.
  gridMobile: {
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: 16,
    maxHeight: 'none',
    overflowY: 'visible',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingRight: 4,
    minWidth: 0,
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  emptyQuestions: {
    paddingTop: 44,
    paddingBottom: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyQuestionsText: {
    ...typography.body2,
    color: 'var(--color-text-disabled)',
  },
  questionCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  questionCardMobile: {
    padding: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'var(--color-vhu-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  indexBadgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: 'var(--color-text-on-primary)',
  },
  questionInput: {
    flex: 1,
    minWidth: 0,
    height: 44,
  },
  removeQuestionButton: {
    width: 42,
    height: 32,
    backgroundColor: 'var(--color-vhu-primary)',
    borderWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flexShrink: 0,
  },
  // Căn đáp án, lỗi và giải thích thẳng hàng với ô nội dung câu hỏi (sau badge).
  answerBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingLeft: 40,
  },
  // Mobile: bỏ thụt lề 40px để ô đáp án/giải thích chiếm đủ bề ngang thẻ.
  answerBlockMobile: {
    paddingLeft: 0,
  },
  answersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  answerInput: {
    flex: 1,
    minWidth: 0,
  },
  answerDeleteButton: {
    width: 32,
    height: 32,
    backgroundColor: 'var(--color-vhu-primary)',
    borderWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flexShrink: 0,
  },
  errorText: {
    ...typography.caption,
    color: 'var(--color-error)',
  },
  addQuestionButton: {
    height: 48,
  },
  settingsPanel: {
    // Dính đầu vùng cuộn (grid, 60vh) — top 96 cũ đẩy panel xuống 96px.
    position: 'sticky',
    top: 0,
    maxHeight: '60vh',
    overflowY: 'auto',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  // Mobile: 1 cột nên panel không cần dính/giới hạn cao.
  settingsPanelMobile: {
    position: 'relative',
    maxHeight: 'none',
    overflowY: 'visible',
  },
  fullWidth: {
    width: '100%',
  },
  summaryBox: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
  summaryValue: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
});

export default styles;
