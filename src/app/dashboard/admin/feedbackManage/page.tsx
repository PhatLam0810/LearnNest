'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, Image, Space, Pagination } from 'antd';
import dayjs from 'dayjs';
import { useAppPagination } from '@hooks';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { UserAvatar } from '@components';
import FeedbackReplyModal from '~mdAdmin/components/FeedbackReplyModal';
import { FeedbackItem } from '~mdDashboard/types';
import styles from './styles';

const CATEGORY_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  content: { label: 'Nội dung', color: '#1d418a', bg: '#e8f0ff' },
  bug: { label: 'Lỗi hệ thống', color: '#c0392b', bg: '#fdeceb' },
  suggestion: { label: 'Đề xuất', color: '#16a34a', bg: '#eafaf0' },
  grading: { label: 'Chấm điểm', color: '#b45309', bg: '#fef3e2' },
  other: { label: 'Khác', color: '#5b6478', bg: '#eef0f5' },
};

const FeedbackManage: React.FC = () => {
  const { listItem, setListItem, currentData, fetchData } =
    useAppPagination<FeedbackItem>({
      apiUrl: 'feedback/getAllFeedback',
    });
  const [replyTarget, setReplyTarget] = useState<FeedbackItem | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toggleResolved] = adminQuery.useToggleFeedbackResolvedMutation();

  const handleToggleResolve = async (item: FeedbackItem) => {
    setTogglingId(item._id);
    try {
      const updated = await toggleResolved(item._id).unwrap();
      setListItem(prev =>
        prev.map(f => (f._id === item._id ? { ...f, ...updated } : f)),
      );
    } catch (e: any) {
      messageApi.error(e?.data?.message || 'Không cập nhật được trạng thái');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Phản Hồi Người Dùng</Text>
      </View>

      {!listItem.length && (
        <Text style={styles.emptyText}>Chưa có phản hồi nào.</Text>
      )}

      <View style={styles.list}>
        {listItem.map(item => {
          const meta = CATEGORY_META[item.category || 'other'];
          const isResolved = item.status === 'resolved';
          return (
            <View key={item._id} style={styles.card}>
              <UserAvatar
                size={40}
                fullName={item.fullName}
                seed={item.userId || item.fullName}
              />
              <View style={styles.cardBody}>
                <View style={styles.headerLine}>
                  <Text style={styles.name}>{item.fullName}</Text>
                  <Text style={styles.time}>
                    {dayjs(item.createdAt).fromNow()}
                  </Text>
                  <Text
                    style={[
                      styles.tag,
                      { color: meta.color, backgroundColor: meta.bg },
                    ]}>
                    {meta.label}
                  </Text>
                </View>
                <Text style={styles.content}>{item.content}</Text>
                {!!item.images?.length && (
                  <Space wrap style={styles.imagesRow}>
                    {item.images.map((url, idx) => (
                      <Image
                        key={idx}
                        src={url}
                        width={64}
                        height={64}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    ))}
                  </Space>
                )}
                {!!item.replyMessage && (
                  <View style={styles.replyBox}>
                    <Text style={styles.replyLabel}>
                      Đã trả lời qua email
                      {item.repliedAt
                        ? ` · ${dayjs(item.repliedAt).format('DD/MM/YYYY HH:mm')}`
                        : ''}
                    </Text>
                    <Text style={styles.replyText}>{item.replyMessage}</Text>
                  </View>
                )}
              </View>
              <View style={styles.actionsCol}>
                <Button
                  onClick={() => {
                    setReplyTarget(item);
                  }}>
                  Trả lời
                </Button>
                <Button
                  type={isResolved ? 'default' : 'primary'}
                  loading={togglingId === item._id}
                  onClick={() => handleToggleResolve(item)}>
                  {isResolved ? 'Đã xử lý' : 'Đánh dấu xử lý'}
                </Button>
              </View>
            </View>
          );
        })}
      </View>

      {!!currentData?.totalRecords && (
        <Pagination
          current={currentData?.pageNum}
          pageSize={currentData?.pageSize}
          total={currentData?.totalRecords}
          showSizeChanger={false}
          onChange={pageNum => fetchData({ pageNum, replace: true })}
        />
      )}

      <FeedbackReplyModal
        item={replyTarget}
        onClose={() => setReplyTarget(null)}
        onUpdated={updated =>
          setListItem(prev =>
            prev.map(f => (f._id === updated._id ? { ...f, ...updated } : f)),
          )
        }
      />
    </View>
  );
};

export default FeedbackManage;
