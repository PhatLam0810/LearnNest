'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Drawer,
  Image as AntImage,
  Input,
  Popover,
  Radio,
} from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  LikeFilled,
  LikeOutlined,
  LoadingOutlined,
  MessageOutlined,
  MoreOutlined,
  PictureOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Text, View } from 'react-native-web';
import dayjs from 'dayjs';
import api from '@/services/api';
import { messageApi } from '@hooks';
import { useAppSelector } from '@redux';
import { useSocket } from '@hooks/useSocket';
import { AppInput } from '@components';
import styles from './styles';

const REPLIES_PREVIEW_COUNT = 4;
const MAX_COMMENT_IMAGES = 3;

type PendingImage = { url: string; name: string };

const REPORT_REASONS: { value: string; label: string }[] = [
  { value: 'spam', label: 'Spam / quảng cáo' },
  { value: 'inappropriate', label: 'Ngôn từ không phù hợp' },
  { value: 'misinformation', label: 'Nội dung sai lệch' },
  { value: 'other', label: 'Khác' },
];

type CommentUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
};

type CommentItem = {
  _id: string;
  postId: string;
  type: string;
  commentText: string;
  user: CommentUser;
  parentCommentId: string | null;
  images?: string[];
  likes?: string[];
  createdAt: string;
};

interface CommentSectionProps {
  postId: string;
  type: string;
  // true = mount thẳng nội dung bình luận vào chỗ gọi (dùng cho tab "Thảo
  // luận" trên ModuleDetailPage) - không có nút nổi/Drawer, luôn "mở".
  // false/undefined (mặc định) = giữ nguyên hành vi cũ: nút "Hỏi đáp" +
  // Drawer trượt từ phải.
  inline?: boolean;
}

const displayName = (u: CommentUser | undefined, myId?: string) =>
  u?._id === myId ? 'Bạn' : `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim();

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  type,
  inline,
}) => {
  const socket = useSocket();
  const userProfile = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile,
  );
  const isAdmin = (userProfile as any)?.role?.level <= 2;

  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<CommentItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set(),
  );
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('spam');
  const [reportNote, setReportNote] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    api
      .post('/comments/getList', { postId, pageSize: 100, pageNum: 1 })
      .then(res => setComments(res.data?.data?.items || []))
      .finally(() => setLoading(false));

    socket.emit('joinPost', postId);
    const onReceive = (c: CommentItem) => {
      if (c.postId !== postId) return;
      setComments(prev => [...prev, c]);
    };
    const onUpdate = (c: CommentItem) => {
      if (c.postId !== postId) return;
      setComments(prev => prev.map(item => (item._id === c._id ? c : item)));
    };
    const onDelete = (ids: string | string[]) => {
      const idSet = new Set(Array.isArray(ids) ? ids : [ids]);
      setComments(prev => prev.filter(item => !idSet.has(item._id)));
    };
    const onLiked = (payload: { id: string; likes: string[] }) => {
      setComments(prev =>
        prev.map(item =>
          item._id === payload.id ? { ...item, likes: payload.likes } : item,
        ),
      );
    };
    socket.on('ReceiveComment', onReceive);
    socket.on('CommentUpdated', onUpdate);
    socket.on('CommentDeleted', onDelete);
    socket.on('CommentLiked', onLiked);
    return () => {
      socket.off('ReceiveComment', onReceive);
      socket.off('CommentUpdated', onUpdate);
      socket.off('CommentDeleted', onDelete);
      socket.off('CommentLiked', onLiked);
    };
  }, [postId, socket]);

  const handleSend = () => {
    if (!text.trim()) return;
    socket.emit('sendcomment', {
      postId,
      type,
      commentText: text.trim(),
      parentCommentId: replyTo?._id,
      images: pendingImages.map(img => img.url),
    });
    setText('');
    setReplyTo(null);
    setPendingImages([]);
  };

  // Bấm icon ảnh -> mở thẳng hộp thoại chọn file hệ điều hành (input file ẩn),
  // không qua bước "hiện component upload rồi bấm lại" như trước - thừa thao
  // tác. Chọn xong tự upload lên /upload luôn, không cần bấm gì thêm.
  const handlePickImages = () => {
    if (uploadingImages || pendingImages.length >= MAX_COMMENT_IMAGES) return;
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // cho phép chọn lại đúng file đó lần sau vẫn bắn change
    const room = MAX_COMMENT_IMAGES - pendingImages.length;
    const toUpload = files.slice(0, room);
    if (!toUpload.length) return;
    setUploadingImages(true);
    try {
      const uploaded = await Promise.all(
        toUpload.map(async file => {
          const formData = new FormData();
          formData.append('file', file);
          // `api` mặc định set Content-Type: application/json cho mọi
          // request - phải gỡ header đó ở đây để trình duyệt tự set đúng
          // multipart/form-data kèm boundary, nếu không BE (Multer) không
          // parse được file, upload thất bại âm thầm.
          const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': undefined },
          });
          return { url: res.data?.data as string, name: file.name };
        }),
      );
      setPendingImages(prev => [...prev, ...uploaded.filter(img => img.url)]);
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không tải được ảnh lên');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemovePendingImage = (url: string) => {
    setPendingImages(prev => prev.filter(img => img.url !== url));
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    socket.emit('updateComment', {
      id,
      postId,
      commentText: editingText.trim(),
    });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/comments/${id}`);
      // Xóa 1 comment gốc kéo theo xóa luôn reply của nó ở BE - deletedIds có
      // thể nhiều hơn 1 id, phải dọn hết để không còn reply "mồ côi" (vẫn
      // đếm vào tổng nhưng không render được do cha đã mất).
      const deletedIds: string[] = res.data?.deletedIds || [id];
      setComments(prev => prev.filter(item => !deletedIds.includes(item._id)));
      socket.emit('notifyDeleted', { ids: deletedIds, postId });
    } catch (e: any) {
      messageApi.error(
        e?.response?.data?.message || 'Không xóa được bình luận',
      );
    }
  };

  const handleToggleLike = async (id: string) => {
    try {
      const res = await api.post(`/comments/${id}/like`);
      // Endpoint này trả thẳng document Mongoose (không bọc qua
      // responseService.list như các API phân trang khác) - res.data CHÍNH
      // LÀ comment, không phải res.data.data.
      const likes: string[] = res.data?.likes || [];
      setComments(prev =>
        prev.map(item => (item._id === id ? { ...item, likes } : item)),
      );
      socket.emit('notifyLiked', { id, postId, likes });
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không thực hiện được');
    }
  };

  const openReport = (id: string) => {
    setReportTarget(id);
    setReportReason('spam');
    setReportNote('');
  };

  const submitReport = async () => {
    if (!reportTarget) return;
    if (reportReason === 'other' && !reportNote.trim()) {
      messageApi.error('Vui lòng mô tả lý do báo cáo');
      return;
    }
    setSubmittingReport(true);
    try {
      await api.post('/comments/report', {
        commentId: reportTarget,
        reason: reportReason,
        note: reportNote.trim() || undefined,
      });
      messageApi.success('Đã gửi báo cáo, cảm ơn bạn!');
      setReportTarget(null);
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không gửi được báo cáo');
    } finally {
      setSubmittingReport(false);
    }
  };

  const topLevel = comments.filter(c => !c.parentCommentId);
  const repliesOf = (id: string) =>
    comments.filter(c => c.parentCommentId === id);

  const renderReportPanel = () => (
    <View style={styles.reportPanel}>
      <Radio.Group
        value={reportReason}
        onChange={e => setReportReason(e.target.value)}>
        <View style={{ gap: 4 }}>
          {REPORT_REASONS.map(r => (
            <Radio key={r.value} value={r.value} style={styles.reportOption}>
              {r.label}
            </Radio>
          ))}
        </View>
      </Radio.Group>
      {reportReason === 'other' && (
        <Input.TextArea
          rows={2}
          style={styles.lexendFont}
          placeholder="Mô tả lý do..."
          value={reportNote}
          onChange={e => setReportNote(e.target.value)}
        />
      )}
      <View style={styles.reportActions}>
        <Button size="small" onClick={() => setReportTarget(null)}>
          Hủy
        </Button>
        <Button
          size="small"
          type="primary"
          danger
          loading={submittingReport}
          onClick={submitReport}>
          Gửi báo cáo
        </Button>
      </View>
    </View>
  );

  const renderComment = (c: CommentItem, isReply = false) => {
    const canEdit = c.user?._id === userProfile?._id;
    const canDelete = canEdit || isAdmin;
    const likes = c.likes || [];
    const isLiked = !!userProfile?._id && likes.includes(userProfile._id);
    const allReplies = !isReply ? repliesOf(c._id) : [];
    const isExpanded = expandedReplies.has(c._id);
    const visibleReplies = isExpanded
      ? allReplies
      : allReplies.slice(0, REPLIES_PREVIEW_COUNT);
    const hiddenCount = allReplies.length - visibleReplies.length;

    return (
      <View key={c._id} style={isReply ? styles.replyRow : styles.commentRow}>
        <Avatar size={32} src={c.user?.avatar} icon={<UserOutlined />} />
        <View style={styles.commentBody}>
          <View style={styles.commentHeaderRow}>
            <Text
              style={[
                styles.commentAuthor,
                canEdit && styles.commentAuthorOwn,
              ]}>
              {displayName(c.user, userProfile?._id)}
            </Text>
            {!canEdit && (
              <Popover
                trigger={['hover', 'click']}
                open={reportTarget === c._id}
                onOpenChange={o =>
                  o ? openReport(c._id) : setReportTarget(null)
                }
                content={renderReportPanel()}
                placement="bottomRight">
                <Text style={styles.moreBtn}>
                  <MoreOutlined />
                </Text>
              </Popover>
            )}
          </View>
          {editingId === c._id ? (
            <View style={styles.editRow}>
              <Input
                size="small"
                style={styles.lexendFont}
                value={editingText}
                onChange={e => setEditingText(e.target.value)}
                onPressEnter={() => handleSaveEdit(c._id)}
              />
              <Button
                size="small"
                type="link"
                onClick={() => handleSaveEdit(c._id)}>
                Lưu
              </Button>
              <Button
                size="small"
                type="link"
                onClick={() => setEditingId(null)}>
                Hủy
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.commentText}>{c.commentText}</Text>
              {!!c.images?.length && (
                <View style={styles.commentImagesRow}>
                  <AntImage.PreviewGroup>
                    {c.images.map((url, idx) => (
                      <AntImage
                        key={idx}
                        src={url}
                        width={72}
                        height={72}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    ))}
                  </AntImage.PreviewGroup>
                </View>
              )}
            </>
          )}
          <View style={styles.commentActions}>
            <Text style={styles.commentTime}>
              {dayjs(c.createdAt).fromNow()}
            </Text>
            <Text
              style={[styles.actionLink, isLiked && styles.likeActive]}
              onPress={() => handleToggleLike(c._id)}>
              {isLiked ? <LikeFilled /> : <LikeOutlined />} Thích
              {likes.length > 0 ? ` (${likes.length})` : ''}
            </Text>
            {!isReply && (
              <Text style={styles.actionLink} onPress={() => setReplyTo(c)}>
                Trả lời
              </Text>
            )}
            {canEdit && editingId !== c._id && (
              <Text
                style={styles.actionLink}
                onPress={() => {
                  setEditingId(c._id);
                  setEditingText(c.commentText);
                }}>
                <EditOutlined /> Sửa
              </Text>
            )}
            {canDelete && (
              <Text
                style={[styles.actionLink, styles.deleteLink]}
                onPress={() => handleDelete(c._id)}>
                <DeleteOutlined /> Xóa
              </Text>
            )}
          </View>
          {!isReply && visibleReplies.map(reply => renderComment(reply, true))}
          {!isReply && hiddenCount > 0 && (
            <Text
              style={styles.viewMoreReplies}
              onPress={() =>
                setExpandedReplies(prev => new Set(prev).add(c._id))
              }>
              Xem thêm {hiddenCount} câu trả lời
            </Text>
          )}
          {!isReply &&
            isExpanded &&
            allReplies.length > REPLIES_PREVIEW_COUNT && (
              <Text
                style={styles.viewMoreReplies}
                onPress={() =>
                  setExpandedReplies(prev => {
                    const next = new Set(prev);
                    next.delete(c._id);
                    return next;
                  })
                }>
                Thu gọn
              </Text>
            )}
        </View>
      </View>
    );
  };

  const bodyContent = (
    <View style={{ gap: 18 }}>
      {replyTo && (
        <View style={styles.replyingBanner}>
          <Text style={styles.replyingText}>
            Đang trả lời {displayName(replyTo.user, userProfile?._id)}
          </Text>
          <Text style={styles.actionLink} onPress={() => setReplyTo(null)}>
            Hủy
          </Text>
        </View>
      )}

      {pendingImages.length > 0 && (
        <View style={styles.pendingImagesRow}>
          {pendingImages.map(img => (
            <View key={img.url} style={styles.pendingImageWrap}>
              <AntImage
                src={img.url}
                width={56}
                height={56}
                preview={false}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
              <Text
                style={styles.pendingImageRemove}
                onPress={() => handleRemovePendingImage(img.url)}>
                ×
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputRow}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFilesSelected}
        />
        <View style={styles.textAreaWrap}>
          <AppInput
            type="TextArea"
            autoSize={{ minRows: 1, maxRows: 6 }}
            placeholder="Nhập bình luận mới của bạn"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            style={{ height: 'auto', minHeight: 56, paddingRight: 40 }}
          />
          <Text
            style={[
              styles.attachBtnOverlay,
              (uploadingImages || pendingImages.length >= MAX_COMMENT_IMAGES) &&
                styles.attachBtnDisabled,
            ]}
            onPress={handlePickImages}>
            {uploadingImages ? (
              <LoadingOutlined />
            ) : (
              <PictureOutlined
                style={
                  pendingImages.length > 0
                    ? styles.attachBtnActiveIcon
                    : undefined
                }
              />
            )}
          </Text>
        </View>
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          disabled={!text.trim()}
          onClick={handleSend}
        />
      </View>

      <View style={styles.list}>
        {!loading && topLevel.length === 0 && (
          <Text style={styles.empty}>
            Chưa có bình luận nào — hãy là người đầu tiên.
          </Text>
        )}
        {topLevel.map(c => renderComment(c))}
      </View>
    </View>
  );

  if (inline) {
    return bodyContent;
  }

  return (
    <>
      {/* Nút nổi cạnh tiêu đề bài học, mở Drawer trượt từ phải - hành vi cũ
          khi KHÔNG dùng dạng tab (vd màn quiz vẫn dùng nút này). */}
      <View style={styles.inlineTrigger} onClick={() => setOpen(true)}>
        <MessageOutlined style={{ color: '#fff', fontSize: 14 }} />
        <Text style={styles.fabText}>Hỏi đáp</Text>
        {comments.length > 0 && (
          <Text style={styles.fabBadge}>{comments.length}</Text>
        )}
      </View>

      <Drawer
        title={
          <Text style={styles.headerTitle}>{comments.length} bình luận</Text>
        }
        placement="right"
        width={480}
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={<CloseOutlined />}
        styles={{
          header: { padding: '18px 24px' },
          body: { padding: '20px 24px 24px' },
        }}>
        {bodyContent}
      </Drawer>
    </>
  );
};

export default CommentSection;
