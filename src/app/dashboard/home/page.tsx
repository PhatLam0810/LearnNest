'use client';
import React, { useMemo } from 'react';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { dashboardQuery } from '~mdDashboard/redux';
import { useAppSelector } from '@redux';
import { useRouter } from 'next/navigation';
import { AppButton } from '@components';
import styles from './styles';
import { View, Text } from 'react-native-web';
import { useMyCourses } from '@/hooks/useMyCourses';
import { useResponsive } from '@/styles/responsive';
import ContinueLearningBanner from './_components/ContinueLearningBanner';
import StatCard from './_components/StatCard';
import ContinuingCourses from './_components/ContinuingCourses';
import RoadmapCard from './_components/RoadmapCard';
import AllCoursesGrid from './_components/AllCoursesGrid';

// Trang Chủ - dashboard cá nhân hóa: banner "tiếp tục học", 3 thẻ thống kê
// (giờ học tuần này / bài đã hoàn thành / chuỗi ngày học), danh sách khóa
// đang học, gợi ý AI. Trước đây trang này là 1 catalog chung (banner
// marketing cố định + lưới toàn bộ khóa học) - catalog đầy đủ đó vẫn còn
// nguyên ở /dashboard/lesson, Trang Chủ chỉ còn nút "Xem tất cả khóa học"
// trỏ sang đó.
const HomeOverview = () => {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const userId = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile?._id,
  );

  const { myCourses, loadingCourses, formatRelativeTime } = useMyCourses(
    userId || null,
  );
  const { data: studyStats } = dashboardQuery.useGetStudyStatsQuery(
    userId || '',
    { skip: !userId },
  );
  const enrolledIds = useMemo(
    () => new Set(myCourses.map(c => c.lessonId)),
    [myCourses],
  );

  const containerStyle = {
    ...styles.container,
    padding: isMobile ? 12 : isTablet ? 16 : 20,
  };

  const statsRowStyle = [
    styles.statsRow,
    isMobile ? { flexDirection: 'column' as const } : null,
  ];

  const weeklyHours = (studyStats?.weeklyMinutes || 0) / 60;
  const weeklyHoursLastWeek = (studyStats?.weeklyMinutesLastWeek || 0) / 60;
  const weeklyDelta = weeklyHours - weeklyHoursLastWeek;

  return (
    <View style={containerStyle} aria-label="Home dashboard overview">
      <View style={styles.content}>
        <ContinueLearningBanner courses={myCourses} loading={loadingCourses} />

        <View style={statsRowStyle}>
          <StatCard
            icon={<ClockCircleOutlined style={styles.statIcon} />}
            label="Giờ học tuần này"
            value={`${weeklyHours.toFixed(1)} giờ`}
            caption={
              studyStats
                ? `${weeklyDelta >= 0 ? '+' : ''}${weeklyDelta.toFixed(1)} giờ so với tuần trước`
                : undefined
            }
            captionColor={weeklyDelta >= 0 ? '#389e0d' : undefined}
          />
          <StatCard
            icon={<CheckCircleOutlined style={styles.statIcon} />}
            label="Bài đã hoàn thành"
            value={`${studyStats?.completedLessonsCount ?? 0}`}
          />
          <StatCard
            icon={<FireOutlined style={styles.statIcon} />}
            label="Chuỗi ngày học"
            value={`${studyStats?.streakDays ?? 0} ngày`}
          />
        </View>

        <View style={[styles.mainRow, isMobile ? styles.mainRowMobile : null]}>
          <View style={styles.continuingCol}>
            <View style={styles.titleContainer}>
              <Text style={{ ...styles.title, fontSize: isMobile ? 18 : 20 }}>
                Đang học
              </Text>
              <AppButton
                type="text"
                style={styles.seeAllBtn}
                onClick={() => router.push('/dashboard/lesson')}>
                Xem tất cả
              </AppButton>
            </View>
            <ContinuingCourses
              courses={myCourses}
              loading={loadingCourses}
              formatRelativeTime={formatRelativeTime}
            />
          </View>

          <View style={styles.roadmapCol}>
            <RoadmapCard />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={{ ...styles.title, fontSize: isMobile ? 18 : 20 }}>
            Tất cả khóa học
          </Text>
          <AppButton
            type="text"
            style={styles.seeAllBtn}
            onClick={() => router.push('/dashboard/lesson')}>
            Xem tất cả
          </AppButton>
        </View>
        <AllCoursesGrid enrolledIds={enrolledIds} />
      </View>
    </View>
  );
};

export default HomeOverview;
