'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { View, Text } from 'react-native-web';
import { dashboardQuery } from '~mdDashboard/redux';
import { useAppSelector } from '@redux';
import { AppButton } from '@components';
import { formatRelativeTime } from '@/utils/time';
import { useResponsive } from '@/styles/responsive';

import HeroWelcomeBanner from './_components/HeroWelcomeBanner';
import ContinueLearningBanner from './_components/ContinueLearningBanner';
import BentoStatsGrid from './_components/BentoStatsGrid';
import HomeSkeleton from './_components/HomeSkeleton';
import ContinuingCourses from './_components/ContinuingCourses';
import RoadmapCard from './_components/RoadmapCard';
import UpcomingDeadlines from './_components/UpcomingDeadlines';
import AllCoursesGrid from './_components/AllCoursesGrid';
import styles from './styles';

// Trang Chủ - dashboard cá nhân hóa hiện đại phong cách EdTech (Coursera + Duolingo):
// - Hero Welcome Banner: Chào tên, Streak 🔥 morphicon, châm ngôn học tập, Level/XP & Daily Goal
// - Resume Learning Card: Thẻ nổi bật bo góc 16px, gradient progress, icon Play morphing
// - Bento Grid: Trực quan hóa giờ học, bài hoàn thành, đề thi MOS, thứ hạng & huy hiệu
// - Khóa học đang học, Lộ trình AI gợi ý, và Danh mục khóa học toàn diện
const HomeOverview: React.FC = () => {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const userId = userProfile?._id;

  const { data: myCoursesData, isFetching: loadingCourses } =
    dashboardQuery.useGetMyCoursesQuery(userId || '', { skip: !userId });
  const myCourses = myCoursesData || [];

  const { data: studyStats, isFetching: loadingStats } =
    dashboardQuery.useGetStudyStatsQuery(userId || '', { skip: !userId });

  const { data: retryQueue } = dashboardQuery.useGetMyRetryQueueQuery();
  const { data: achievements } = dashboardQuery.useGetMyAchievementsQuery();
  const { data: leaderboard } = dashboardQuery.useGetLeaderboardQuery();

  const enrolledIds = useMemo(
    () => new Set(myCourses.map(c => c.lessonId)),
    [myCourses],
  );

  const containerPadding = isMobile ? 12 : isTablet ? 16 : 24;

  const isInitialLoading =
    (!myCoursesData && loadingCourses) || (!studyStats && loadingStats);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: containerPadding,
          paddingRight: containerPadding,
          paddingBottom: containerPadding + 8,
          paddingLeft: containerPadding,
        },
      ]}
      aria-label="Home dashboard overview">
      {isInitialLoading ? (
        <HomeSkeleton />
      ) : (
        <View style={styles.content}>
          {/* 1. HERO WELCOME & GAMIFICATION BANNER */}
          <HeroWelcomeBanner
            fullName={userProfile?.fullName}
            streakDays={studyStats?.streakDays ?? 0}
            completedLessonsCount={studyStats?.completedLessonsCount ?? 0}
            weeklyMinutes={studyStats?.weeklyMinutes ?? 0}
          />

          {/* 2. RESUME LEARNING CARD */}
          <ContinueLearningBanner
            courses={myCourses}
            loading={loadingCourses}
          />

          {/* 3. BENTO STATS GRID */}
          <BentoStatsGrid
            weeklyMinutes={studyStats?.weeklyMinutes ?? 0}
            weeklyMinutesLastWeek={studyStats?.weeklyMinutesLastWeek ?? 0}
            completedLessonsCount={studyStats?.completedLessonsCount ?? 0}
            retryQueueCount={retryQueue?.length ?? 0}
            leaderboardRank={leaderboard?.me?.rank ?? null}
            unlockedAchievementsCount={
              achievements?.items?.filter(i => i.unlocked)?.length ?? 0
            }
            totalAchievementsCount={achievements?.items?.length ?? 0}
          />

          {/* 4. MAIN INTERACTIVE CONTENT: CONTINUING COURSES & AI ROADMAP */}
          <View
            style={[styles.mainRow, isMobile ? styles.mainRowMobile : null]}>
            <View style={styles.continuingCol}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Đang học</Text>
                <AppButton
                  type="text"
                  style={styles.seeAllBtn}
                  onClick={() => router.push('/dashboard/my-courses')}>
                  Xem tất cả →
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
              <UpcomingDeadlines />
            </View>
          </View>

          {/* 5. ALL COURSES CATALOG PREVIEW */}
          <View style={[styles.section, styles.sectionSpacing]}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Khám phá khóa học khác</Text>
              <AppButton
                type="text"
                style={styles.seeAllBtn}
                onClick={() => router.push('/dashboard/lesson')}>
                Xem tất cả →
              </AppButton>
            </View>
            <AllCoursesGrid enrolledIds={enrolledIds} />
          </View>
        </View>
      )}
    </View>
  );
};

export default HomeOverview;
