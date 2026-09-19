import { StyleSheet } from '@styles';
import { lexend } from '@/styles/typography';

const font = lexend.style.fontFamily;

const styles = StyleSheet.create({
  // Dùng lại cho các ô input antd thường (không phải AppInput) để đồng bộ
  // font Lexend trên toàn bộ khung bình luận.
  lexendFont: {
    fontFamily: font,
  },
  // Nút "Hỏi đáp" nằm ngay trong hàng tiêu đề bài học (cạnh title, bên
  // phải) - không còn nổi/portal, chỉ là 1 nút gọn trong luồng trang.
  inlineTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 6,
    backgroundColor: 'var(--color-vhu-primary)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 9999,
    boxShadow: '0 2px 8px rgba(29, 65, 138, 0.25)',
    cursor: 'pointer',
  },
  fabText: {
    fontFamily: font,
    color: 'var(--color-text-on-primary)',
    fontSize: 14,
    fontWeight: '600',
  },
  fabBadge: {
    fontFamily: font,
    backgroundColor: 'var(--color-error)',
    color: 'var(--color-text-on-primary)',
    fontSize: 11,
    fontWeight: '700',
    borderRadius: 9999,
    minWidth: 18,
    height: 18,
    textAlign: 'center',
    lineHeight: '18px',
    paddingHorizontal: 4,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: font,
    fontWeight: '600',
    fontSize: 17,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },
  // Bọc textarea để icon ảnh "nằm trong" ô nhập bằng cách overlay tuyệt đối
  // ở góc trên-phải (TextArea của antd không có prop suffix như Input).
  textAreaWrap: {
    position: 'relative',
    flex: 1,
  },
  attachBtnOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    cursor: 'pointer',
    color: 'var(--color-text-disabled)',
    fontSize: 18,
    display: 'flex',
    zIndex: 1,
  },
  attachBtnActiveIcon: {
    color: 'var(--color-vhu-primary)',
  },
  attachBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  pendingImagesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  pendingImageWrap: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  pendingImageRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'var(--color-error)',
    borderRadius: 9999,
    width: 18,
    height: 18,
    color: 'var(--color-text-on-primary)',
    fontSize: 11,
    lineHeight: '18px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  replyingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--color-info-bg)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  replyingText: {
    fontFamily: font,
    fontSize: 13,
    color: 'var(--color-vhu-primary)',
  },
  // Khung nhập dạng "hỏi đáp" dùng riêng cho tab Thảo luận (inline) - có
  // avatar người dùng hiện tại bên trái, hint + nút "Gửi bình luận" dạng
  // chữ bên dưới ô nhập, khác nút tròn icon của Drawer cũ.
  composerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  composerCol: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  composerFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  composerHint: {
    fontFamily: font,
    fontSize: 12.5,
    color: 'var(--color-text-disabled)',
  },
  sendTextButton: {
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    color: 'var(--color-text-on-primary)',
    borderRadius: 999,
    height: 36,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: 600,
    flexShrink: 0,
  },
  list: {
    gap: 6,
  },
  // Mỗi thread (câu hỏi + trả lời) đứng trong 1 khung riêng ở tab Thảo luận
  // - khác kiểu ngăn cách bằng border mờ trước đây.
  listInline: {
    gap: 14,
  },
  commentCard: {
    backgroundColor: 'var(--color-surface)',
    borderWidth: 1,
    borderColor: 'var(--color-border)',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
  },
  empty: {
    fontFamily: font,
    color: 'var(--color-text-disabled)',
    fontSize: 14,
    paddingVertical: 16,
    textAlign: 'center',
  },
  commentRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  replyRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    marginTop: 10,
    marginLeft: 24,
    borderLeftWidth: 2,
    borderLeftColor: 'var(--color-border)',
    paddingLeft: 14,
  },
  // Highlight riêng cho trả lời của giảng viên - nền xanh nhạt để nổi bật
  // giữa các trả lời thường.
  teacherReplyRow: {
    backgroundColor: 'var(--color-surface-selected)',
    borderLeftColor: 'var(--color-border-strong)',
    borderRadius: 10,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },
  commentBody: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  commentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentAuthor: {
    fontFamily: font,
    fontWeight: '600',
    fontSize: 13.5,
  },
  commentAuthorOwn: {
    color: 'var(--color-vhu-primary)',
  },
  teacherBadge: {
    fontFamily: font,
    fontSize: 11,
    fontWeight: '700',
    color: 'var(--color-warning)',
    backgroundColor: 'var(--color-warning-bg)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  commentText: {
    fontFamily: font,
    fontSize: 14,
    color: 'var(--color-text-primary)',
    lineHeight: 20,
  },
  commentImagesRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 6,
    alignItems: 'center',
  },
  commentTime: {
    fontFamily: font,
    fontSize: 12,
    color: 'var(--color-text-disabled)',
  },
  actionLink: {
    fontFamily: font,
    fontSize: 12,
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    fontWeight: '500',
  },
  likeActive: {
    color: 'var(--color-vhu-primary)',
    fontWeight: '700',
  },
  deleteLink: {
    color: 'var(--color-error)',
  },
  moreBtn: {
    cursor: 'pointer',
    color: 'var(--color-text-disabled)',
    fontSize: 16,
    paddingLeft: 4,
    paddingRight: 4,
  },
  editRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  viewMoreReplies: {
    fontFamily: font,
    fontSize: 12.5,
    color: 'var(--color-vhu-primary)',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: 8,
  },
  reportPanel: {
    gap: 10,
    padding: 6,
    width: 230,
  },
  reportOption: {
    fontFamily: font,
    fontSize: 13,
    color: 'var(--color-text-primary)',
    paddingVertical: 4,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
});

export default styles;
