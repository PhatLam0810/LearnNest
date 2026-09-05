'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, Image, Modal, Space, Input, Pagination } from 'antd';
import dayjs from 'dayjs';
import { useAppPagination } from '@hooks';
import { messageApi } from '@hooks';
import api from '@services/api';
import { UserAvatar } from '@components';
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
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleResolve = async (item: FeedbackItem) => {
    setTogglingId(item._id);
    try {
      const res = await api.post(`/feedback/${item._id}/resolve`);
      const updated = res.data?.data;
      setListItem(prev =>
        prev.map(f => (f._id === item._id ? { ...f, ...updated } : f)),
      );
    } catch (e: any) {
      messageApi.error(
        e?.response?.data?.message || 'Không cập nhật được trạng thái',
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleSendReply = async () => {
    if (!replyTarget || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await api.post(`/feedback/${replyTarget._id}/reply`, {
        message: replyText.trim(),
      });
      const updated = res.data?.data;
      setListItem(prev =>
        prev.map(f => (f._id === replyTarget._id ? { ...f, ...updated } : f)),
      );
      messageApi.success(
        updated?.sent
          ? 'Đã gửi email trả lời cho người dùng.'
          : 'Đã lưu trả lời nhưng gửi email thất bại.',
      );
      setReplyTarget(null);
      setReplyText('');
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không gửi được trả lời');
    } finally {
      setSending(false);
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
                    setReplyText('');
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
          onChange={pageNum => fetchData({ pageNum })}
        />
      )}

      <Modal
        title={`Trả lời ${replyTarget?.fullName || ''}`}
        open={!!replyTarget}
        onCancel={() => setReplyTarget(null)}
        onOk={handleSendReply}
        confirmLoading={sending}
        okText="Gửi email trả lời"
        cancelText="Hủy">
        {replyTarget && (
          <View style={{ gap: 10 }}>
            <View style={styles.replyBox}>
              <Text style={styles.replyLabel}>Nội dung gốc</Text>
              <Text style={styles.replyText}>{replyTarget.content}</Text>
            </View>
            <Input.TextArea
              rows={4}
              placeholder="Nhập nội dung trả lời - sẽ gửi qua email cho người dùng..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
          </View>
        )}
      </Modal>
    </View>
  );
};

export default FeedbackManage;
