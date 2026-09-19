'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Input, Modal } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import UserAvatar from '@components/UserAvatar';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { FeedbackItem } from '~mdDashboard/types';
import styles from './styles';

interface FeedbackReplyModalProps {
  item: FeedbackItem | null;
  onClose: () => void;
  onUpdated: (updated: Partial<FeedbackItem>) => void;
}

const buttonStyle = { width: 'auto', height: 44 } as const;

const errorMessage = (e: unknown, fallback: string) =>
  (e as { data?: { message?: string } })?.data?.message || fallback;

const FeedbackReplyModal: React.FC<FeedbackReplyModalProps> = ({
  item,
  onClose,
  onUpdated,
}) => {
  const [text, setText] = useState('');
  const [reply, { isLoading: isSending }] =
    adminQuery.useReplyFeedbackMutation();
  const [toggle, { isLoading: isResolving }] =
    adminQuery.useToggleFeedbackResolvedMutation();

  const close = () => {
    setText('');
    onClose();
  };

  const handleSend = async () => {
    if (!item || !text.trim()) return;
    try {
      const updated = await reply({
        id: item._id,
        message: text.trim(),
      }).unwrap();
      onUpdated({ _id: item._id, ...updated });
      messageApi.success(
        updated?.sent
          ? 'Đã gửi email trả lời cho người dùng.'
          : 'Đã lưu trả lời nhưng gửi email thất bại.',
      );
      close();
    } catch (e: unknown) {
      messageApi.error(errorMessage(e, 'Không gửi được trả lời'));
    }
  };

  const handleResolve = async () => {
    if (!item) return;
    try {
      const updated = await toggle(item._id).unwrap();
      onUpdated({ _id: item._id, ...updated });
      messageApi.success('Đã đánh dấu đã xử lý');
      close();
    } catch (e: unknown) {
      messageApi.error(errorMessage(e, 'Không cập nhật được trạng thái'));
    }
  };

  const busy = isSending || isResolving;

  return (
    <Modal
      open={!!item}
      onCancel={close}
      footer={null}
      closable={false}
      width={720}
      destroyOnHidden
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.identity}>
            <UserAvatar
              size={48}
              fullName={item?.fullName}
              seed={item?.userId || item?.fullName}
            />
            <View style={styles.identityText}>
              <Text style={styles.title}>{item?.fullName || 'Người dùng'}</Text>
              <Text style={styles.subline}>
                {item
                  ? `Gửi lúc ${dayjs(item.createdAt).format('HH:mm DD/MM/YYYY')}`
                  : ' '}
              </Text>
            </View>
          </View>
          <button
            type="button"
            aria-label="Đóng"
            onClick={close}
            style={styles.closeButton as React.CSSProperties}>
            Đóng
          </button>
        </View>
        <View style={styles.body}>
          <View style={styles.quoteBlock}>
            <Text style={styles.quoteLabel}>Phản hồi gốc</Text>
            <Text style={styles.quoteText}>{item?.content}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Nội dung trả lời</Text>
            <Input.TextArea
              aria-label="Nội dung trả lời"
              rows={5}
              maxLength={2000}
              showCount
              placeholder="Nội dung sẽ được gửi qua email cho người dùng"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </View>
          <View style={styles.footer}>
            <AppButton
              style={buttonStyle}
              loading={isResolving}
              disabled={busy || item?.status === 'resolved'}
              onClick={handleResolve}>
              {item?.status === 'resolved' ? 'Đã xử lý' : 'Đánh dấu đã xử lý'}
            </AppButton>
            <AppButton
              type="primary"
              style={buttonStyle}
              loading={isSending}
              disabled={busy || !text.trim()}
              onClick={handleSend}>
              Gửi phản hồi
            </AppButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackReplyModal;
