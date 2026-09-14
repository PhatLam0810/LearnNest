'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Input } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import { useAppPagination } from '@hooks';
import { messageApi } from '@hooks';
import api from '@services/api';
import UserAvatar from '@components/UserAvatar';
import { useSocket } from '@hooks/useSocket';
import { useResponsive } from '@/styles/responsive';
import styles from './styles';

dayjs.extend(relativeTime);

type QuestionUser = {
  _id?: string;
  fullName?: string;
  avatar?: string;
};

type QuestionItem = {
  _id: string;
  postId: string;
  type: string;
  commentText: string;
  user?: QuestionUser;
  createdAt: string;
  link?: string;
  contextTitle?: string;
  isAnswered?: boolean;
  dismissedAt?: string | null;
};

type QuestionStats = {
  openCount: number;
  overdueCount: number;
  avgResponseHours: number | null;
};

type AnswerInfo = { fullName?: string; commentText: string; createdAt: string };

type StatusFilter = 'open' | 'answered' | 'dismissed' | 'all';

const OVERDUE_MS = 24 * 60 * 60 * 1000;

// Gợi ý câu trả lời nhanh cho các tình huống thường gặp - tĩnh phía client,
// admin bấm để chèn vào ô soạn, vẫn sửa được trước khi gửi.
const QUICK_TEMPLATES = [
  { key: 'watch-again', label: 'Nhắc xem lại video' },
  { key: 'see-doc', label: 'Hướng dẫn xem tài liệu' },
  { key: 'ask-more', label: 'Hỏi thêm chi tiết' },
];
const QUICK_TEMPLATE_TEXT: Record<string, string> = {
  'watch-again':
    'Bạn thử xem lại đoạn video liên quan nhé, nội dung này đã được giải thích khá kỹ ở đó. Nếu vẫn chưa rõ, cứ hỏi lại mình nha!',
  'see-doc':
    'Bạn xem thêm phần Tài liệu của bài học này nhé, có hướng dẫn chi tiết ở đó.',
  'ask-more':
    'Bạn mô tả rõ hơn chỗ bạn đang vướng được không? Mình sẽ hỗ trợ cụ thể hơn.',
};

const questionState = (
  item: Pick<QuestionItem, 'isAnswered' | 'dismissedAt' | 'createdAt'>,
) => {
  if (item.isAnswered) {
    return {
      label: 'Đã trả lời',
      color: '#16a34a',
      bg: '#f0fdf4',
      rail: '#16a34a',
    };
  }
  if (item.dismissedAt) {
    return {
      label: 'Đã bỏ qua',
      color: '#6b7280',
      bg: '#f3f4f6',
      rail: '#d1d5db',
    };
  }
  const overdue = Date.now() - new Date(item.createdAt).getTime() > OVERDUE_MS;
  return overdue
    ? { label: 'Quá hạn', color: '#dc2626', bg: '#fef2f2', rail: '#dc2626' }
    : {
        label: 'Chờ trả lời',
        color: '#2563eb',
        bg: '#eef3fb',
        rail: '#2563eb',
      };
};

const QaInbox: React.FC = () => {
  const router = useRouter();
  const socket = useSocket();
  const { isMobile } = useResponsive();
  const [status, setStatus] = useState<StatusFilter>('open');
  const { listItem, fetchData, filter, refresh } =
    useAppPagination<QuestionItem>({
      apiUrl: 'comments/admin/questions/list',
      params: { filter: { status: 'open' }, pageSize: 50 },
    });
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answer, setAnswer] = useState<AnswerInfo | null>(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [reopening, setReopening] = useState(false);

  const loadStats = () => {
    api
      .get('/comments/admin/questions/stats')
      .then(res => setStats(res.data?.data ?? res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Câu hỏi mới ở bất kỳ bài học nào cũng bắn NEW_QUESTION cho mọi admin qua
  // đúng socket này (xem CommentService.notifyOnNewComment) - tận dụng lại
  // thay vì mở kết nối riêng, chỉ cần biết KHI NÀO cần tải lại danh sách.
  useEffect(() => {
    const handleNewNotification = (payload: { type?: string }) => {
      if (payload?.type === 'NEW_QUESTION') {
        refresh();
        loadStats();
      }
    };
    socket.on('NewNotification', handleNewNotification);
    return () => {
      socket.off('NewNotification', handleNewNotification);
    };
  }, [socket, refresh]);

  const changeStatus = (v: StatusFilter) => {
    setStatus(v);
    setSelectedId(null);
    filter({ status: v });
  };

  const selected =
    listItem.find(q => q._id === selectedId) || listItem[0] || null;

  // Mở khóa "câu hỏi đầu tiên" khi danh sách vừa tải xong, hoặc khi bộ lọc
  // đổi khiến item đang chọn không còn trong danh sách nữa.
  useEffect(() => {
    if (!listItem.length) {
      setSelectedId(null);
      return;
    }
    if (!listItem.some(q => q._id === selectedId)) {
      setSelectedId(listItem[0]._id);
    }
  }, [listItem, selectedId]);

  // Câu trả lời (nếu có) chỉ cần khi ĐANG XEM 1 câu hỏi đã trả lời - không
  // tải trước cho cả danh sách. Tái dùng endpoint liệt kê comment theo
  // postId đã có sẵn (getAllByPostId), lọc lấy đúng reply của câu hỏi này.
  useEffect(() => {
    setAnswer(null);
    setDraft('');
    if (!selected || !selected.isAnswered) return;
    setLoadingAnswer(true);
    api
      .post('/comments/getList', { postId: selected.postId, pageSize: 50 })
      .then(res => {
        const items = res.data?.data?.items || res.data?.items || [];
        const reply = items
          .filter((c: any) => c.parentCommentId === selected._id)
          .sort(
            (a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          )[0];
        if (reply) {
          setAnswer({
            fullName: reply.user?.fullName,
            commentText: reply.commentText,
            createdAt: reply.createdAt,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAnswer(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?._id]);

  const handleReply = async () => {
    if (!selected || !draft.trim()) return;
    setSending(true);
    try {
      await api.post('/comments', {
        postId: selected.postId,
        type: selected.type,
        commentText: draft.trim(),
        parentCommentId: selected._id,
      });
      messageApi.success('Đã trả lời');
      setDraft('');
      refresh();
      loadStats();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không trả lời được');
    } finally {
      setSending(false);
    }
  };

  const handleDismiss = async () => {
    if (!selected) return;
    setDismissing(true);
    try {
      await api.post(`/comments/admin/questions/${selected._id}/dismiss`);
      messageApi.success('Đã bỏ qua câu hỏi');
      refresh();
      loadStats();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không xử lý được');
    } finally {
      setDismissing(false);
    }
  };

  const handleReopen = async () => {
    if (!selected) return;
    setReopening(true);
    try {
      await api.post(`/comments/admin/questions/${selected._id}/reopen`);
      messageApi.success('Đã mở lại câu hỏi');
      refresh();
      loadStats();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không xử lý được');
    } finally {
      setReopening(false);
    }
  };

  const filterTabs: { label: string; value: StatusFilter }[] = [
    { label: 'Chưa xử lý', value: 'open' },
    { label: 'Đã trả lời', value: 'answered' },
    { label: 'Đã bỏ qua', value: 'dismissed' },
    { label: 'Tất cả', value: 'all' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hộp Thư Hỏi Đáp</Text>

      <View style={styles.statsRow}>
        <View style={styles.statsGroup}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{stats?.openCount ?? '—'}</Text>
            <Text style={styles.statLabel}>chờ trả lời</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>
              {stats?.avgResponseHours != null
                ? `${stats.avgResponseHours}h`
                : '—'}
            </Text>
            <Text style={styles.statLabel}>thời gian trả lời trung bình</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={{ ...styles.statNumber, color: '#dc2626' }}>
              {stats?.overdueCount ?? '—'}
            </Text>
            <Text style={styles.statLabel}>quá 24 giờ chưa trả lời</Text>
          </View>
        </View>

        <View
          style={{
            ...styles.filterTabs,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            width: isMobile ? '100%' : undefined,
          }}>
          {filterTabs.map((t, i) => (
            <div
              key={t.value}
              onClick={() => changeStatus(t.value)}
              style={{
                ...(styles.filterTab as React.CSSProperties),
                borderLeftWidth: i === 0 ? 0 : 1,
                flex: isMobile ? 1 : undefined,
                justifyContent: isMobile ? 'center' : undefined,
                color: status === t.value ? '#fff' : '#374151',
                background:
                  status === t.value ? 'var(--color-vhu-primary)' : '#fff',
              }}>
              {t.label}
            </div>
          ))}
        </View>
      </View>

      <View
        style={{
          ...styles.mainGrid,
          gridTemplateColumns: isMobile ? '1fr' : '390px 1fr',
        }}>
        <View style={styles.listPanel}>
          {!listItem.length && (
            <Text style={styles.emptyListText}>
              Không có câu hỏi nào trong bộ lọc này.
            </Text>
          )}
          {listItem.map((item, i) => {
            const st = questionState(item);
            const isSelected = item._id === selected?._id;
            return (
              <div
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                style={{
                  ...(styles.listItem as React.CSSProperties),
                  borderTop:
                    i === 0 ? 'none' : (styles.listItem as any).borderTop,
                  borderLeft: `3px solid ${st.rail}`,
                  background: isSelected ? '#f7f9fc' : '#fff',
                }}>
                <View style={styles.listItemHead}>
                  <UserAvatar
                    size={30}
                    avatar={item.user?.avatar}
                    fullName={item.user?.fullName}
                    seed={item.user?._id}
                  />
                  <Text style={styles.listItemName}>
                    {item.user?.fullName || 'Học viên'}
                  </Text>
                  <Text style={{ ...styles.listItemTime, color: st.rail }}>
                    {dayjs(item.createdAt).fromNow()}
                  </Text>
                </View>
                <Text style={styles.listItemText}>{item.commentText}</Text>
                <View style={styles.listItemFoot}>
                  <Text style={styles.listItemLesson}>
                    {item.contextTitle || ''}
                  </Text>
                  <Text
                    style={{
                      ...styles.statePill,
                      color: st.color,
                      background: st.bg,
                    }}>
                    {st.label}
                  </Text>
                </View>
              </div>
            );
          })}
        </View>

        <View style={styles.detailPanel}>
          {!selected ? (
            <Text style={styles.detailEmpty}>
              Chọn 1 câu hỏi bên trái để xem chi tiết.
            </Text>
          ) : (
            <>
              <View style={styles.detailHeader}>
                <View style={styles.detailHeaderLeft}>
                  <UserAvatar
                    size={44}
                    avatar={selected.user?.avatar}
                    fullName={selected.user?.fullName}
                    seed={selected.user?._id}
                  />
                  <View style={{ gap: 4, minWidth: 0 }}>
                    <Text style={styles.detailName}>
                      {selected.user?.fullName || 'Học viên'}
                    </Text>
                    <Text style={styles.detailMeta}>
                      {dayjs(selected.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </View>
                </View>
                {(() => {
                  const st = questionState(selected);
                  return (
                    <Text
                      style={{
                        ...styles.statePillLarge,
                        color: st.color,
                        background: st.bg,
                      }}>
                      {st.label}
                    </Text>
                  );
                })()}
              </View>

              <View style={styles.detailBody}>
                {!!selected.contextTitle && (
                  <View style={styles.lessonCard}>
                    <View style={styles.lessonIconWrap}>▶</View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.lessonTitle}>
                        {selected.contextTitle}
                      </Text>
                    </View>
                    {!!selected.link && (
                      <button
                        style={styles.secondaryBtn as React.CSSProperties}
                        onClick={() => router.push(selected.link as string)}>
                        Xem bài học
                      </button>
                    )}
                  </View>
                )}

                <View style={{ gap: 10 }}>
                  <Text style={styles.sectionLabel}>CÂU HỎI</Text>
                  <Text style={styles.questionText}>
                    {selected.commentText}
                  </Text>
                </View>

                {selected.isAnswered && (
                  <View style={styles.answerBox}>
                    {loadingAnswer ? (
                      <Text style={styles.answerByTime}>Đang tải...</Text>
                    ) : answer ? (
                      <>
                        <View style={styles.answerByRow}>
                          <Text style={styles.answerByName}>
                            {answer.fullName || 'Quản trị viên'}
                          </Text>
                          <Text style={styles.answerByTime}>
                            {dayjs(answer.createdAt).fromNow()}
                          </Text>
                        </View>
                        <Text style={styles.answerText}>
                          {answer.commentText}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.answerByTime}>
                        Không tải được câu trả lời.
                      </Text>
                    )}
                  </View>
                )}

                {!selected.isAnswered && !selected.dismissedAt && (
                  <View style={{ gap: 12 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                      }}>
                      <Text style={styles.sectionLabel}>TRẢ LỜI</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 8,
                          flexWrap: 'wrap',
                        }}>
                        {QUICK_TEMPLATES.map(tp => (
                          <div
                            key={tp.key}
                            onClick={() =>
                              setDraft(QUICK_TEMPLATE_TEXT[tp.key])
                            }
                            style={{
                              height: 30,
                              padding: '0 12px',
                              border: '1px solid #e5e9f0',
                              borderRadius: 999,
                              fontSize: 12,
                              color: '#374151',
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                            }}>
                            {tp.label}
                          </div>
                        ))}
                      </View>
                    </View>
                    <Input.TextArea
                      rows={4}
                      placeholder="Nhập câu trả lời cho học viên..."
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      style={styles.replyTextarea as React.CSSProperties}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                      }}>
                      <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                        {draft.trim() ? `${draft.trim().length} ký tự` : ''}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <button
                          style={styles.secondaryBtn as React.CSSProperties}
                          disabled={dismissing}
                          onClick={handleDismiss}>
                          Không cần trả lời
                        </button>
                        <button
                          style={{
                            ...(styles.primaryBtn as React.CSSProperties),
                            background: draft.trim()
                              ? 'var(--color-vhu-primary)'
                              : '#c9d2e0',
                            cursor: draft.trim() ? 'pointer' : 'not-allowed',
                          }}
                          disabled={!draft.trim() || sending}
                          onClick={handleReply}>
                          Gửi trả lời
                        </button>
                      </View>
                    </View>
                  </View>
                )}

                {!selected.isAnswered && !!selected.dismissedAt && (
                  <View style={styles.skippedBox}>
                    <Text style={styles.skippedText}>
                      Câu hỏi này đã được đánh dấu không cần trả lời.
                    </Text>
                    <button
                      style={styles.secondaryBtn as React.CSSProperties}
                      disabled={reopening}
                      onClick={handleReopen}>
                      Mở lại
                    </button>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default QaInbox;
