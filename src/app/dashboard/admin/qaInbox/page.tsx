'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Segmented } from 'antd';
import { useRouter } from 'next/navigation';
import { useAppPagination } from '@hooks';
import { messageApi } from '@hooks';
import { useSocket } from '@hooks/useSocket';
import { useResponsive } from '@/styles/responsive';
import {
  dismissQuestionApi,
  getQuestionAnswerApi,
  getQuestionStatsApi,
  replyQuestionApi,
  reopenQuestionApi,
} from '~mdAdmin/services/api';
import {
  AnswerInfo,
  QuestionItem,
  QuestionStats,
} from '~mdAdmin/services/api/type';
import QnaInboxList from '~mdAdmin/components/QnaInboxList';
import QnaInboxDetail from '~mdAdmin/components/QnaInboxDetail';
import styles from './styles';

type StatusFilter = 'open' | 'answered' | 'dismissed' | 'all';

const FILTER_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'Chưa xử lý', value: 'open' },
  { label: 'Đã trả lời', value: 'answered' },
  { label: 'Đã bỏ qua', value: 'dismissed' },
  { label: 'Tất cả', value: 'all' },
];

const QaInbox: React.FC = () => {
  const router = useRouter();
  const socket = useSocket();
  const { isMobile } = useResponsive();
  const [status, setStatus] = useState<StatusFilter>('open');
  const { listItem, filter, refresh, fetchData, currentData } =
    useAppPagination<QuestionItem>({
      apiUrl: 'comments/admin/questions/list',
      params: { filter: { status: 'open' }, pageSize: 5 },
    });
  // replace:true - trang mới THAY THẾ 5 item cũ thay vì cộng dồn.
  const changePage = (p: number) => fetchData({ pageNum: p, replace: true });
  const pageItems = listItem;
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answer, setAnswer] = useState<AnswerInfo | null>(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [reopening, setReopening] = useState(false);

  const loadStats = () => {
    getQuestionStatsApi()
      .then(setStats)
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
    pageItems.find(q => q._id === selectedId) || pageItems[0] || null;

  // Mở khóa "câu hỏi đầu tiên" khi trang hiện tại vừa tải xong, hoặc khi bộ
  // lọc/đổi trang khiến item đang chọn không còn trong trang này nữa.
  useEffect(() => {
    if (!pageItems.length) {
      setSelectedId(null);
      return;
    }
    if (!pageItems.some(q => q._id === selectedId)) {
      setSelectedId(pageItems[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageItems.map(q => q._id).join(','), selectedId]);

  // Câu trả lời (nếu có) chỉ cần khi ĐANG XEM 1 câu hỏi đã trả lời - không
  // tải trước cho cả danh sách. Tái dùng endpoint liệt kê comment theo
  // postId đã có sẵn (getAllByPostId), lọc lấy đúng reply của câu hỏi này.
  useEffect(() => {
    setAnswer(null);
    setDraft('');
    if (!selected || !selected.isAnswered) return;
    setLoadingAnswer(true);
    getQuestionAnswerApi(selected.postId, selected._id)
      .then(reply => {
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
      await replyQuestionApi({
        postId: selected.postId,
        type: selected.type,
        commentText: draft.trim(),
        parentCommentId: selected._id,
      });
      messageApi.success({
        content: 'Đã gửi trả lời',
        message: 'Học viên sẽ nhận email ngay bây giờ.',
      });
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
      await dismissQuestionApi(selected._id);
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
      await reopenQuestionApi(selected._id);
      messageApi.success('Đã mở lại câu hỏi');
      refresh();
      loadStats();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không xử lý được');
    } finally {
      setReopening(false);
    }
  };

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
            <Text style={{ ...styles.statNumber, color: '#c81e1e' }}>
              {stats?.overdueCount ?? '—'}
            </Text>
            <Text style={styles.statLabel}>quá 24 giờ chưa trả lời</Text>
          </View>
        </View>

        <Segmented
          value={status}
          onChange={v => changeStatus(v as StatusFilter)}
          block={isMobile}
          size={isMobile ? 'small' : 'middle'}
          options={FILTER_OPTIONS}
        />
      </View>

      <View
        style={{
          ...styles.mainGrid,
          gridTemplateColumns: isMobile ? '1fr' : '390px 1fr',
        }}>
        <QnaInboxList
          listItem={pageItems}
          selectedId={selected?._id}
          onSelect={setSelectedId}
          currentData={currentData}
          onChangePage={changePage}
        />
        <QnaInboxDetail
          selected={selected}
          answer={answer}
          loadingAnswer={loadingAnswer}
          draft={draft}
          setDraft={setDraft}
          sending={sending}
          dismissing={dismissing}
          reopening={reopening}
          onReply={handleReply}
          onDismiss={handleDismiss}
          onReopen={handleReopen}
          onOpenLesson={link => router.push(link)}
        />
      </View>
    </View>
  );
};

export default QaInbox;
