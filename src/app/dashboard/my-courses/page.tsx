'use client';

import React from 'react';
import { View, Text } from 'react-native-web';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useAppSelector } from '@redux';
import { useMyCourses } from '@/hooks/useMyCourses';
import { dashboardQuery } from '~mdDashboard/redux';
import { AppButton } from '@components';
import styles from './styles';

// Trang "Tổng Quan" - theo design mới: biểu đồ giờ học 4 tuần gần nhất, kết
// quả bài kiểm tra gần đây, gợi ý từ Lộ Trình AI (dùng lại đúng dữ liệu của
// RoadmapCard ở Trang Chủ, không tạo insight riêng), và bảng "Khóa học của
// tôi" (thay cho danh sách card đơn giản trước đây).
const scoreStyle = (score: number) => {
  if (score >= 8) return styles.scoreGood;
  if (score >= 5) return styles.scoreOk;
  return styles.scoreBad;
};

const MyCoursesPage = () => {
  const router = useRouter();
  const userId = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile?._id,
  );

  const { myCourses, loadingCourses, formatRelativeTime } = useMyCourses(
    userId || null,
  );
  const { data: overview } = dashboardQuery.useGetMyOverviewQuery(
    userId || '',
    { skip: !userId },
  );
  const { data: insights } = dashboardQuery.useGetMyRoadmapQuery(userId || '', {
    skip: !userId,
  });

  const latestInsight = Array.isArray(insights) ? insights[0] : null;
  const weeklyHours = overview?.weeklyHours || [];
  const maxHours = Math.max(1, ...weeklyHours.map(w => w.hours));

  const handleOpenCourse = (course: (typeof myCourses)[number]) => {
    router.push(
      `/dashboard/home/lesson/moduleDetail?lessonId=${course.lessonId}&subLessonId=${course.lastSubLessonId || 'first-lesson'}`,
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.pageTitle}>Tổng Quan</Text>
        <Text style={styles.pageSubtitle}>
          Tiến độ học tập của bạn trong 30 ngày gần nhất
        </Text>
      </View>

      <View style={styles.topRow}>
        <View style={styles.chartCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Giờ học theo tuần</Text>
            <Text style={styles.cardMeta}>
              Tổng {overview?.totalHours ?? 0} giờ
            </Text>
          </View>
          <View style={styles.barsRow}>
            {weeklyHours.map((w, idx) => {
              const isLast = idx === weeklyHours.length - 1;
              const pct = Math.max((w.hours / maxHours) * 100, 3);
              return (
                <View key={w.label} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        isLast && styles.barFillActive,
                        { height: `${pct}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{w.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.resultsCard}>
          <Text style={styles.cardTitle}>Kết quả bài kiểm tra</Text>
          {!overview?.recentResults?.length && (
            <Text style={styles.emptyText}>Chưa có bài kiểm tra nào.</Text>
          )}
          {overview?.recentResults?.map(r => (
            <View key={r._id} style={styles.resultRow}>
              <View>
                <Text style={styles.resultName}>{r.name}</Text>
                <Text style={styles.resultDate}>
                  {dayjs(r.createdAt).format('DD/MM/YYYY')}
                </Text>
              </View>
              <Text style={[styles.resultScore, scoreStyle(r.score)]}>
                {r.score.toFixed(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {latestInsight && (
        <View style={styles.aiSuggestionBox}>
          <Text style={styles.aiTitle}>Đề xuất từ Lộ Trình AI</Text>
          <Text style={styles.aiText}>{latestInsight.summary}</Text>
          <AppButton
            style={styles.aiButton}
            onClick={() => router.push('/dashboard/my-roadmap')}>
            {latestInsight.roadmap?.[0]?.action || 'Xem lộ trình đề xuất'}
          </AppButton>
        </View>
      )}

      <View>
        <Text style={styles.sectionTitle}>Khóa học của tôi</Text>
      </View>

      {loadingCourses ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Đang tải dữ liệu...</Text>
        </View>
      ) : !myCourses.length ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Bạn chưa bắt đầu khóa học nào.</Text>
        </View>
      ) : (
        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colCourse]}>
              Khóa học
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colCompleted]}>
              Bài đã xong
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colProgress]}>
              Tiến độ
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colLastStudied]}>
              Học lần cuối
            </Text>
          </View>
          {myCourses
            .filter(c => c && c.lessonId)
            .map(course => {
              const progress = Math.round(course.progress || 0);
              const isDone = progress >= 100;
              return (
                <View
                  key={course.lessonId}
                  style={styles.tableRow}
                  onClick={() => handleOpenCourse(course)}>
                  <Text
                    style={[styles.courseNameCell, styles.colCourse]}
                    numberOfLines={1}>
                    {course.lessonName || 'Khóa học đang cập nhật...'}
                  </Text>
                  <Text style={[styles.completedCell, styles.colCompleted]}>
                    {course.completedItems ?? 0} / {course.totalItems ?? 0}
                  </Text>
                  <View style={[styles.progressCellRow, styles.colProgress]}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          isDone && styles.progressFillDone,
                          { width: `${progress}%` },
                        ]}
                      />
                    </View>
                    {isDone ? (
                      <Text
                        style={[styles.progressPct, styles.progressPctDone]}>
                        Hoàn thành
                      </Text>
                    ) : (
                      <Text style={styles.progressPct}>{progress}%</Text>
                    )}
                  </View>
                  <Text style={[styles.lastStudiedCell, styles.colLastStudied]}>
                    {course.lastStudiedAt
                      ? formatRelativeTime(course.lastStudiedAt)
                      : 'Chưa học'}
                  </Text>
                </View>
              );
            })}
        </View>
      )}
    </View>
  );
};

export default MyCoursesPage;
