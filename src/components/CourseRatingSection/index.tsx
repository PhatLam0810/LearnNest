'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { StarFilled, StarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import AppButton from '@components/AppButton';
import { AppInput } from '@components';
import { messageApi } from '@hooks';
import { dashboardQuery } from '~mdDashboard/redux';
import { CourseRatingUser } from '~mdDashboard/redux/RTKQuery/types';
import styles from './styles';

interface CourseRatingSectionProps {
  lessonId?: string;
}

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

// Khung đánh giá khóa học đầy đủ (điểm trung bình + % theo từng mức sao +
// form gửi đánh giá + danh sách nhận xét) — đặt trên trang tổng quan khóa
// học (LessonDetailPage), theo đúng vị trí trong design. Thay cho popover
// nhỏ trước đây gắn ở trang xem video (ModuleDetailPage) - 1 khóa chỉ có 1
// khung đánh giá, tránh trùng lặp.
const CourseRatingSection: React.FC<CourseRatingSectionProps> = ({
  lessonId,
}) => {
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState('');

  const { data, refetch } = dashboardQuery.useGetCourseRatingQuery(
    lessonId || '',
    { skip: !lessonId },
  );
  const [submitRating, { isLoading: submitting }] =
    dashboardQuery.useSubmitCourseRatingMutation();
  const [fetchRatings, { data: ratingsData, isLoading: loadingRatings }] =
    dashboardQuery.useGetCourseRatingsMutation();

  useEffect(() => {
    if (lessonId) {
      fetchRatings({ lessonId, pageNum: 1, pageSize: 10 });
    }
  }, [lessonId]);

  useEffect(() => {
    setStars(data?.myRating?.stars || 0);
    setComment(data?.myRating?.comment || '');
  }, [data?.myRating]);

  if (!lessonId) return null;

  const averageRating = data?.averageRating || 0;
  const ratingCount = data?.ratingCount || 0;
  const breakdown = data?.breakdown;

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
      refetch();
      fetchRatings({ lessonId, pageNum: 1, pageSize: 10 });
    } catch (e: any) {
      messageApi.error(e?.data?.message || 'Không gửi được đánh giá');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {data?.myRating ? 'Sửa đánh giá của bạn' : 'Đánh giá của bạn'}
        </Text>
        <Text style={styles.formHint}>
          Chọn số sao rồi viết nhận xét (không bắt buộc)
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
                <StarFilled style={styles.starFilledIconLarge} />
              ) : (
                <StarOutlined style={styles.starOutlineIconLarge} />
              )}
            </Text>
          ))}
        </View>
        <AppInput
          type="TextArea"
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Khóa học giúp bạn được gì? Điều gì nên cải thiện?"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <AppButton
          style={styles.submitButton}
          loading={submitting}
          onClick={handleSubmit}>
          Gửi đánh giá
        </AppButton>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeaderRow}>
          <Text style={styles.title}>Đánh giá khóa học</Text>
          {ratingCount > 0 && (
            <Text style={styles.countLabel}>{ratingCount} đánh giá</Text>
          )}
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.averageBlock}>
            <Text style={styles.averageNumber}>{averageRating.toFixed(1)}</Text>
            <View style={styles.averageStarsRow}>
              {[1, 2, 3, 4, 5].map(n =>
                n <= Math.round(averageRating) ? (
                  <StarFilled key={n} style={styles.starFilledIcon} />
                ) : (
                  <StarOutlined key={n} style={styles.starOutlineIcon} />
                ),
              )}
            </View>
            <Text style={styles.countLabel}>{ratingCount} đánh giá</Text>
          </View>

          {ratingCount > 0 && breakdown && (
            <View style={styles.breakdownBlock}>
              {STAR_LEVELS.map(level => {
                const count = breakdown[String(level) as '5'] || 0;
                const pct = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
                return (
                  <View key={level} style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>{level} ★</Text>
                    <View style={styles.breakdownTrack}>
                      <View
                        style={{
                          ...styles.breakdownFill,
                          width: `${pct}%`,
                        }}
                      />
                    </View>
                    <Text style={styles.breakdownPct}>{Math.round(pct)}%</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {!loadingRatings && (ratingsData?.items?.length ?? 0) > 0 && (
        <View style={styles.reviewList}>
          {ratingsData?.items.map(review => {
            const user =
              typeof review.userId === 'object'
                ? (review.userId as CourseRatingUser)
                : undefined;
            return (
              <View key={review._id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Avatar
                    src={user?.avatar}
                    icon={<UserOutlined />}
                    size={40}
                  />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.reviewName} numberOfLines={1}>
                      {user?.fullName || 'Học viên'}
                    </Text>
                    <View style={styles.reviewStarsRow}>
                      {[1, 2, 3, 4, 5].map(n =>
                        n <= review.stars ? (
                          <StarFilled key={n} style={styles.reviewStarIcon} />
                        ) : (
                          <StarOutlined
                            key={n}
                            style={styles.reviewStarOutlineIcon}
                          />
                        ),
                      )}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CourseRatingSection;
