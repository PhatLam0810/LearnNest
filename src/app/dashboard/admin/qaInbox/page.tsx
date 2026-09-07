'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, Input, Pagination, Segmented } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import { useAppPagination } from '@hooks';
import { messageApi } from '@hooks';
import api from '@services/api';
import UserAvatar from '@components/UserAvatar';
import { useSocket } from '@hooks/useSocket';
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
  isAnswered?: boolean;
  dismissedAt?: string | null;
};

type StatusFilter = 'open' | 'answered' | 'dismissed' | 'all';

const QaInbox: React.FC = () => {
  const router = useRouter();
  const socket = useSocket();
  const [status, setStatus] = useState<StatusFilter>('open');
  const { listItem, currentData, fetchData, filter, refresh } =
    useAppPagination<QuestionItem>({
      apiUrl: 'comments/admin/questions/list',
      params: { filter: { status: 'open' } },
    });
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  // Câu hỏi mới ở bất kỳ bài học nào cũng bắn NEW_QUESTION cho mọi admin qua
  // đúng socket này (xem CommentService.notifyOnNewComment) - tận dụng lại
  // thay vì mở kết nối riêng, chỉ cần biết KHI NÀO cần tải lại danh sách.
  useEffect(() => {
    const handleNewNotification = (payload: { type?: string }) => {
      if (payload?.type === 'NEW_QUESTION') refresh();
    };
    socket.on('NewNotification', handleNewNotification);
    return () => {
      socket.off('NewNotification', handleNewNotification);
    };
  }, [socket, refresh]);

  const changeStatus = (v: StatusFilter) => {
    setStatus(v);
    filter({ status: v });
  };

  const handleReply = async (item: QuestionItem) => {
    const commentText = (replyDrafts[item._id] || '').trim();
    if (!commentText) return;
    setSendingId(item._id);
    try {
      await api.post('/comments', {
        postId: item.postId,
        type: item.type,
        commentText,
        parentCommentId: item._id,
      });
      messageApi.success('Đã trả lời');
      setReplyDrafts(prev => ({ ...prev, [item._id]: '' }));
      refresh();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không trả lời được');
    } finally {
      setSendingId(null);
    }
  };

  const handleDismiss = async (item: QuestionItem) => {
    setDismissingId(item._id);
    try {
      await api.post(`/comments/admin/questions/${item._id}/dismiss`);
      messageApi.success('Đã bỏ qua câu hỏi');
      refresh();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không xử lý được');
    } finally {
      setDismissingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Hộp Thư Hỏi Đáp</Text>
        <Segmented
          value={status}
          onChange={v => changeStatus(v as StatusFilter)}
          options={[
            { label: 'Chưa xử lý', value: 'open' },
            { label: 'Đã trả lời', value: 'answered' },
            { label: 'Đã bỏ qua', value: 'dismissed' },
            { label: 'Tất cả', value: 'all' },
          ]}
        />
      </View>

      {!listItem.length && (
        <Text style={styles.emptyText}>Không có câu hỏi nào.</Text>
      )}

      <View style={styles.list}>
        {listItem.map(item => {
          const isOpen = !item.isAnswered && !item.dismissedAt;
          return (
            <View key={item._id} style={styles.card}>
              <View style={styles.headerLine}>
                <UserAvatar
                  size={32}
                  avatar={item.user?.avatar}
                  fullName={item.user?.fullName}
                  seed={item.user?._id}
                />
                <Text style={styles.userName}>
                  {item.user?.fullName || 'Học viên'}
                </Text>
                <Text style={styles.metaText}>
                  · {dayjs(item.createdAt).fromNow()}
                </Text>
                {item.isAnswered && (
                  <Text style={styles.answeredTag}>Đã trả lời</Text>
                )}
                {!item.isAnswered && item.dismissedAt && (
                  <Text style={styles.dismissedTag}>Đã bỏ qua</Text>
                )}
              </View>

              <View style={styles.commentBox}>
                <Text style={styles.commentText}>{item.commentText}</Text>
              </View>

              <View style={styles.actionsRow}>
                {!!item.link && (
                  <Button onClick={() => router.push(item.link as string)}>
                    Xem bài học
                  </Button>
                )}
                {isOpen && (
                  <Button
                    loading={dismissingId === item._id}
                    onClick={() => handleDismiss(item)}>
                    Không cần trả lời
                  </Button>
                )}
              </View>

              {isOpen && (
                <View style={styles.replyBox}>
                  <Input.TextArea
                    rows={2}
                    placeholder="Nhập câu trả lời..."
                    value={replyDrafts[item._id] || ''}
                    onChange={e =>
                      setReplyDrafts(prev => ({
                        ...prev,
                        [item._id]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="primary"
                    loading={sendingId === item._id}
                    disabled={!(replyDrafts[item._id] || '').trim()}
                    onClick={() => handleReply(item)}>
                    Trả lời
                  </Button>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {!!currentData?.totalRecords && (
        <Pagination
          current={currentData?.pageNum}
          pageSize={currentData?.pageSize}
          total={currentData?.totalRecords}
          onChange={pageNum => fetchData({ pageNum })}
        />
      )}
    </View>
  );
};

export default QaInbox;
