'use client';

import React from 'react';
import { View, Text } from 'react-native-web';
import { useRouter } from 'next/navigation';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  TrophyOutlined,
  RightOutlined,
} from '@components/AppIcon';
import { asButton } from '@/utils/asButton';
import { useResponsive } from '@/styles/responsive';
import { BentoStatsGridProps } from './types';
import styles from './styles';

export const BentoStatsGrid: React.FC<BentoStatsGridProps> = ({
  weeklyMinutes = 0,
  weeklyMinutesLastWeek = 0,
  completedLessonsCount = 0,
  retryQueueCount = 0,
  leaderboardRank,
  unlockedAchievementsCount = 0,
  totalAchievementsCount = 0,
}) => {
  const router = useRouter();
  const { isMobile } = useResponsive();

  const weeklyHours = weeklyMinutes / 60;
  const weeklyHoursLastWeek = weeklyMinutesLastWeek / 60;
  const weeklyDelta = weeklyHours - weeklyHoursLastWeek;

  const gridStyle = [
    styles.grid,
    isMobile ? { flexDirection: 'column' as const } : null,
  ];

  return (
    <View
      style={styles.container}
      aria-label="Khối Thống kê cá nhân Bento Grid">
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Chỉ số học tập của bạn</Text>
      </View>

      <View style={gridStyle}>
        {/* Card 1: Giờ học tuần này */}
        <View
          style={[styles.card, styles.cardHighlight]}
          {...asButton(
            () => router.push('/dashboard/my-courses'),
            'Xem giờ học tuần này',
          )}
          onClick={() => router.push('/dashboard/my-courses')}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconWrapper}>
              <ClockCircleOutlined size={22} color="var(--color-vhu-primary)" />
            </View>
            {weeklyDelta !== 0 && (
              <View
                style={[
                  styles.tagBadge,
                  weeklyDelta >= 0
                    ? styles.tagBadgeSuccess
                    : styles.tagBadgeWarning,
                ]}>
                <Text
                  style={
                    weeklyDelta >= 0
                      ? styles.tagBadgeTextSuccess
                      : styles.tagBadgeTextWarning
                  }>
                  {weeklyDelta >= 0
                    ? `+${weeklyDelta.toFixed(1)}h`
                    : `${weeklyDelta.toFixed(1)}h`}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Giờ học tuần này</Text>
            <Text style={styles.cardValue}>{weeklyHours.toFixed(1)} giờ</Text>
            <Text style={styles.cardCaption}>
              {weeklyDelta >= 0
                ? 'Tăng tốc học tập tốt hơn tuần trước'
                : 'Tiếp tục duy trì thói quen học mỗi ngày'}
            </Text>
          </View>

          <View style={styles.cardFooterRow}>
            <Text style={styles.cardActionLink}>Chi tiết khóa học</Text>
            <RightOutlined size={14} color="var(--color-vhu-primary)" />
          </View>
        </View>

        {/* Card 2: Bài đã hoàn thành */}
        <View
          style={styles.card}
          {...asButton(
            () => router.push('/dashboard/lesson'),
            'Xem bài học đã hoàn thành',
          )}
          onClick={() => router.push('/dashboard/lesson')}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconWrapperSuccess}>
              <CheckCircleOutlined size={22} color="var(--color-success)" />
            </View>
            <View style={[styles.tagBadge, styles.tagBadgeSuccess]}>
              <Text style={styles.tagBadgeTextSuccess}>Tích lũy</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Bài hoàn thành</Text>
            <Text style={styles.cardValue}>{completedLessonsCount} bài</Text>
            <Text style={styles.cardCaption}>Bao gồm lý thuyết & quiz</Text>
          </View>

          <View style={styles.cardFooterRow}>
            <Text style={styles.cardActionLink}>Kho bài giảng</Text>
            <RightOutlined size={14} color="var(--color-vhu-primary)" />
          </View>
        </View>

        {/* Card 3: Thực hành MOS */}
        <View
          style={styles.card}
          {...asButton(
            () => router.push('/dashboard/practice'),
            'Xem bài tập thực hành MOS',
          )}
          onClick={() => router.push('/dashboard/practice')}>
          <View style={styles.cardTopRow}>
            <View
              style={
                retryQueueCount > 0
                  ? styles.iconWrapperWarning
                  : styles.iconWrapperSuccess
              }>
              <BarChartOutlined
                size={22}
                color={
                  retryQueueCount > 0
                    ? 'var(--color-warning)'
                    : 'var(--color-success)'
                }
              />
            </View>
            {retryQueueCount > 0 ? (
              <View style={[styles.tagBadge, styles.tagBadgeWarning]}>
                <Text style={styles.tagBadgeTextWarning}>Cần làm lại</Text>
              </View>
            ) : (
              <View style={[styles.tagBadge, styles.tagBadgeSuccess]}>
                <Text style={styles.tagBadgeTextSuccess}>Sẵn sàng</Text>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Thực hành MOS</Text>
            <Text style={styles.cardValue}>
              {retryQueueCount > 0
                ? `${retryQueueCount} bài cần sửa`
                : 'Đạt chuẩn 100%'}
            </Text>
            <Text style={styles.cardCaption}>
              {retryQueueCount > 0
                ? 'Luyện lại để mở khóa bài tiếp'
                : 'Tiến độ thực hành rất xuất sắc'}
            </Text>
          </View>

          <View style={styles.cardFooterRow}>
            <Text style={styles.cardActionLink}>Phòng luyện thi</Text>
            <RightOutlined size={14} color="var(--color-vhu-primary)" />
          </View>
        </View>

        {/* Card 4: Thành tích & Bảng xếp hạng */}
        <View
          style={styles.card}
          {...asButton(
            () => router.push('/dashboard/leaderboard'),
            'Xem bảng xếp hạng và thành tích',
          )}
          onClick={() => router.push('/dashboard/leaderboard')}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconWrapper}>
              <TrophyOutlined
                size={22}
                color="var(--color-vhu-accent, #f0c356)"
              />
            </View>
            <View style={[styles.tagBadge, styles.tagBadgeSuccess]}>
              <Text style={styles.tagBadgeTextSuccess}>
                {leaderboardRank ? `#${leaderboardRank}` : 'Top học viên'}
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Hạng & Huy hiệu</Text>
            <Text style={styles.cardValue}>
              {totalAchievementsCount > 0
                ? `${unlockedAchievementsCount}/${totalAchievementsCount} huy hiệu`
                : 'Top VHU'}
            </Text>
            <Text style={styles.cardCaption}>
              {leaderboardRank
                ? `Hạng hiện tại: #${leaderboardRank} toàn trường`
                : 'Tích lũy XP để leo bảng xếp hạng'}
            </Text>
          </View>

          <View style={styles.cardFooterRow}>
            <Text style={styles.cardActionLink}>Bảng xếp hạng</Text>
            <RightOutlined size={14} color="var(--color-vhu-primary)" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default BentoStatsGrid;
