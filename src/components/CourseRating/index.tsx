'use client';
import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Text, View } from 'react-native-web';
import { AppInput } from '@components';
import { messageApi } from '@hooks';
import { dashboardQuery } from '~mdDashboard/redux';
import styles from './styles';

interface CourseRatingProps {
  lessonId: string;
}

// Đánh giá khóa học - hiện điểm trung bình cạnh tiêu đề (cùng chỗ nút "Hỏi
// đáp" của CommentSection), bấm vào mở popover nhỏ để chọn sao + nhận xét.
// 1 user chỉ có đúng 1 đánh giá/khóa - gửi lại là SỬA đánh giá cũ (đúng như
// BE: CourseRating unique theo lessonId+userId), nên form luôn tự điền lại
// đánh giá cũ của chính user nếu đã có.
const CourseRating: React.FC<CourseRatingProps> = ({ lessonId }) => {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState('');

  const { data, refetch } = dashboardQuery.useGetCourseRatingQuery(lessonId, {
    skip: !lessonId,
  });
  const [submitRating, { isLoading: submitting }] =
    dashboardQuery.useSubmitCourseRatingMutation();

  const openPopover = (next: boolean) => {
    setOpen(next);
    if (next) {
      setStars(data?.myRating?.stars || 0);
      setComment(data?.myRating?.comment || '');
    }
  };

  const handleSubmit = async () => {
    if (!stars) {
      messageApi.error('Vui lòng chọn số sao');
      return;
    }
    try {
      await submitRating({
        lessonId,
        stars,
        comment: comment.trim() || undefined,
      }).unwrap();
      messageApi.success('Cảm ơn bạn đã đánh giá khóa học!');
      setOpen(false);
      refetch();
    } catch (e: any) {
      messageApi.error(e?.data?.message || 'Không gửi được đánh giá');
    }
  };

  const averageRating = data?.averageRating || 0;
  const ratingCount = data?.ratingCount || 0;

  const popoverContent = (
    <View style={styles.popover}>
      <Text style={styles.popoverTitle}>
        {data?.myRating ? 'Sửa đánh giá của bạn' : 'Đánh giá khóa học này'}
      </Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(n => (
          <Text
            key={n}
            style={styles.starPick}
            onMouseEnter={() => setHoverStars(n)}
            onMouseLeave={() => setHoverStars(0)}
            onPress={() => setStars(n)}>
            {(hoverStars || stars) >= n ? (
              <StarFilled style={styles.starFilledIcon} />
            ) : (
              <StarOutlined style={styles.starOutlineIcon} />
            )}
          </Text>
        ))}
      </View>
      <AppInput
        type="TextArea"
        autoSize={{ minRows: 2, maxRows: 4 }}
        placeholder="Nhận xét của bạn (không bắt buộc)"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <View style={styles.popoverActions}>
        <Button size="small" onClick={() => setOpen(false)}>
          Hủy
        </Button>
        <Button
          size="small"
          type="primary"
          loading={submitting}
          onClick={handleSubmit}>
          Gửi đánh giá
        </Button>
      </View>
    </View>
  );

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={openPopover}
      content={popoverContent}
      placement="bottomRight">
      <View style={styles.inlineTrigger}>
        <StarFilled style={styles.triggerIcon} />
        {ratingCount > 0 ? (
          <Text style={styles.triggerText}>
            {averageRating.toFixed(1)} ({ratingCount})
          </Text>
        ) : (
          <Text style={styles.triggerText}>Đánh giá khóa học</Text>
        )}
      </View>
    </Popover>
  );
};

export default CourseRating;
