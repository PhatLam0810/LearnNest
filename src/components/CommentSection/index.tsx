'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, Button, Input } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Text, View } from 'react-native-web';
import dayjs from 'dayjs';
import api from '@/services/api';
import { messageApi } from '@hooks';
import { useAppSelector } from '@redux';
import { useSocket } from '@hooks/useSocket';
import styles from './styles';

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
  createdAt: string;
};

interface CommentSectionProps {
  postId: string;
  type: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, type }) => {
  const socket = useSocket();
  const userProfile = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile,
  );
  const isAdmin = (userProfile as any)?.role?.level <= 2;

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<CommentItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);

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
    const onDelete = (id: string) => {
      setComments(prev => prev.filter(item => item._id !== id));
    };
    socket.on('ReceiveComment', onReceive);
    socket.on('CommentUpdated', onUpdate);
    socket.on('CommentDeleted', onDelete);
    return () => {
      socket.off('ReceiveComment', onReceive);
      socket.off('CommentUpdated', onUpdate);
      socket.off('CommentDeleted', onDelete);
    };
  }, [postId, socket]);

  const handleSend = () => {
    if (!text.trim()) return;
    socket.emit('sendcomment', {
      postId,
      type,
      commentText: text.trim(),
      parentCommentId: replyTo?._id,
    });
    setText('');
    setReplyTo(null);
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
      await api.delete(`/comments/${id}`);
      setComments(prev => prev.filter(item => item._id !== id));
      socket.emit('notifyDeleted', { id, postId });
    } catch (e: any) {
      messageApi.error(
        e?.response?.data?.message || 'Không xóa được bình luận',
      );
    }
  };

  const topLevel = comments.filter(c => !c.parentCommentId);
  const repliesOf = (id: string) =>
    comments.filter(c => c.parentCommentId === id);

  const renderComment = (c: CommentItem, isReply = false) => {
    const canEdit = c.user?._id === userProfile?._id;
    const canDelete = canEdit || isAdmin;
    return (
      <View key={c._id} style={isReply ? styles.replyRow : styles.commentRow}>
        <Avatar size={32} src={c.user?.avatar} icon={<UserOutlined />} />
        <View style={styles.commentBody}>
          <Text style={styles.commentAuthor}>
            {c.user?.firstName} {c.user?.lastName}
          </Text>
          {editingId === c._id ? (
            <View style={styles.editRow}>
              <Input
                size="small"
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
            <Text style={styles.commentText}>{c.commentText}</Text>
          )}
          <View style={styles.commentActions}>
            <Text style={styles.commentTime}>
              {dayjs(c.createdAt).fromNow()}
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
          {!isReply &&
            repliesOf(c._id).map(reply => renderComment(reply, true))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MessageOutlined />
        <Text style={styles.headerTitle}>Bình luận ({comments.length})</Text>
      </View>

      {replyTo && (
        <View style={styles.replyingBanner}>
          <Text style={styles.replyingText}>
            Đang trả lời {replyTo.user?.firstName} {replyTo.user?.lastName}
          </Text>
          <Text style={styles.actionLink} onPress={() => setReplyTo(null)}>
            Hủy
          </Text>
        </View>
      )}
      <View style={styles.inputRow}>
        <Input
          placeholder="Viết bình luận..."
          value={text}
          onChange={e => setText(e.target.value)}
          onPressEnter={handleSend}
        />
        <Button
          type="primary"
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
};

export default CommentSection;
