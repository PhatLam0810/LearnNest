'use client';

import React from 'react';
import { Text, View } from 'react-native-web';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@redux';
import { useGetMyRoadmapQuery } from '~mdDashboard/redux';
import { RobotOutlined, RightOutlined } from '@components/AppIcon';
import { asButton } from '@/utils/asButton';
import styles from './styles';

interface RecommendedItem {
  id: string;
  title: string;
  difficulty: 'Cơ bản' | 'Nâng cao' | 'Chuyên gia';
  duration: string;
  isHot?: boolean;
}

const DEFAULT_AI_RECOMMENDATIONS: RecommendedItem[] = [
  {
    id: 'mos-word',
    title: 'Luyện thi MOS Word 2019/365',
    difficulty: 'Cơ bản',
    duration: '4.5 giờ',
    isHot: true,
  },
  {
    id: 'mos-excel',
    title: 'Xử lý dữ liệu & Hàm nâng cao Excel',
    difficulty: 'Nâng cao',
    duration: '6.0 giờ',
    isHot: true,
  },
  {
    id: 'ai-tools',
    title: 'Ứng dụng AI Coach & Prompt Tin học',
    difficulty: 'Cơ bản',
    duration: '2.5 giờ',
  },
];

// Khối Khóa học gợi ý theo lộ trình AI:
// Danh sách thẻ bài học có tag độ khó, huy hiệu hot và thời lượng rõ ràng,
// dùng token màu VHU, tích hợp icon morphicons.
const RoadmapCard: React.FC = () => {
  const router = useRouter();
  const userId = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile?._id,
  );
  const { data: insights, isFetching } = useGetMyRoadmapQuery(userId || '', {
    skip: !userId,
  });

  const latest = Array.isArray(insights) ? insights[0] : null;

  if (isFetching) return null;

  const summaryText =
    latest?.summary ||
    'AI Coach đã phân tích kết quả học của bạn: Tập trung củng cố kỹ năng thực hành bảng biểu Word và công thức Excel để tối ưu điểm số thi MOS.';

  return (
    <View style={styles.card} aria-label="Khóa học gợi ý theo lộ trình AI">
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.robotIconWrapper}>
            <RobotOutlined size={20} color="var(--color-vhu-primary)" />
          </View>
          <Text style={styles.title}>Lộ Trình AI Gợi Ý</Text>
        </View>

        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI Đề Xuất</Text>
        </View>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summary} numberOfLines={3}>
          {summaryText}
        </Text>
      </View>

      <View style={styles.suggestedList}>
        {DEFAULT_AI_RECOMMENDATIONS.map(course => (
          <View
            key={course.id}
            style={styles.suggestedItem}
            {...asButton(
              () => router.push('/dashboard/lesson'),
              `Xem khóa học ${course.title}`,
            )}
            onClick={() => router.push('/dashboard/lesson')}>
            <View style={styles.suggestedLeft}>
              <Text style={styles.courseName}>{course.title}</Text>
              <View style={styles.tagsRow}>
                <View style={styles.levelTag}>
                  <Text style={styles.levelTagText}>{course.difficulty}</Text>
                </View>
                {course.isHot && (
                  <View style={styles.hotBadge}>
                    <Text style={styles.hotBadgeText}>HOT</Text>
                  </View>
                )}
                <Text style={styles.durationText}>⏱ {course.duration}</Text>
              </View>
            </View>

            <RightOutlined size={16} color="var(--color-vhu-primary)" />
          </View>
        ))}
      </View>

      <View
        style={styles.footerRow}
        {...asButton(
          () => router.push('/dashboard/my-roadmap'),
          'Xem lộ trình chi tiết',
        )}
        onClick={() => router.push('/dashboard/my-roadmap')}>
        <Text style={styles.link}>Xem chi tiết toàn bộ lộ trình AI</Text>
        <RightOutlined size={16} color="var(--color-vhu-primary)" />
      </View>
    </View>
  );
};

export default RoadmapCard;
