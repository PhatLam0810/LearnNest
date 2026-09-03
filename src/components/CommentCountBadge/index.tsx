'use client';
import React, { useEffect, useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { Text, View } from 'react-native-web';
import api from '@/services/api';

interface CommentCountBadgeProps {
  postId: string;
}

// Icon + số lượng comment cho 1 bài trong khóa học - dùng ở danh sách nội
// dung (LessonDetailPage). Chỉ gọi 1 endpoint đếm nhẹ, không kéo cả danh
// sách comment về chỉ để hiển thị số.
const CommentCountBadge: React.FC<CommentCountBadgeProps> = ({ postId }) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    api
      .post(`/comments/count/${postId}`)
      .then(res => {
        if (!cancelled) setCount(res.data?.count ?? 0);
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (count === null || count === 0) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}>
      <MessageOutlined style={{ fontSize: 12, color: '#9aa5b8' }} />
      <Text style={{ fontSize: 12, color: '#9aa5b8' }}>{count}</Text>
    </View>
  );
};

export default CommentCountBadge;
