'use client';

import React from 'react';
import { View, Text } from 'react-native-web';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppSelector } from '@redux';
import { useMyCourses } from '@/hooks/useMyCourses';
import { dashboardQuery } from '~mdDashboard/redux';
import { RecentTestResult } from '~mdDashboard/redux/RTKQuery/types';
import { AppButton } from '@components';
import styles from './styles';

// Trang "Tổng Quan" - theo design mới: biểu đồ giờ học từng ngày trong tuần
// này (Thứ 2 - Chủ nhật), kết quả bài kiểm tra gần đây, gợi ý từ Lộ Trình AI
// (dùng lại đúng dữ liệu của RoadmapCard ở Trang Chủ, không tạo insight
// riêng), và bảng "Khóa học của tôi" (thay cho danh sách card đơn giản
// trước đây).
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
  const { data: scoreHistory } = dashboardQuery.useGetMyScoreHistoryQuery(
    { userId: userId || '', limit: 10 },
    { skip: !userId },
  );

  const latestInsight = Array.isArray(insights) ? insights[0] : null;
  const weeklyHours = overview?.weeklyHours || [];
  const maxHours = Math.max(1, ...weeklyHours.map(w => w.hours));
  const scoreChartData = (scoreHistory || []).map(r => ({
    label: dayjs(r.createdAt).format('DD/MM'),
    score: r.score,
    name: r.name,
  }));

  const handleOpenCourse = (course: (typeof myCourses)[number]) => {
    router.push(
      `/dashboard/home/lesson/moduleDetail?lessonId=${course.lessonId}&subLessonId=${course.lastSubLessonId || 'first-lesson'}`,
    );
  };

  const handleOpenResult = (result: RecentTestResult) => {
    if (result.link) router.push(result.link);
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
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Kết quả bài kiểm tra</Text>
            <Text
              style={styles.viewAllLink}
              onClick={() => router.push('/dashboard/results')}>
              Xem tất cả
            </Text>
          </View>
          {!overview?.recentResults?.length && (
            <Text style={styles.emptyText}>Chưa có bài kiểm tra nào.</Text>
          )}
          {overview?.recentResults?.map(r => (
            <View
              key={r._id}
              style={[styles.resultRow, r.link && { cursor: 'pointer' }]}
              onClick={() => handleOpenResult(r)}>
              <View>
                <View style={styles.resultNameRow}>
                  <Text style={styles.resultName}>{r.name}</Text>
                  <Text
                    style={[
                      styles.resultTypeTag,
                      r.type === 'practice'
                        ? styles.resultTypeTagPractice
                        : styles.resultTypeTagQuiz,
                    ]}>
                    {r.type === 'practice' ? 'Thực hành' : 'Trắc nghiệm'}
                  </Text>
                </View>
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

      {scoreChartData.length > 1 && (
        <View style={styles.chartCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Điểm số theo thời gian</Text>
            <Text style={styles.cardMeta}>
              {scoreChartData.length} lần làm gần nhất
            </Text>
          </View>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={scoreChartData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#eef1f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickMargin={10}
                  axisLine={{ stroke: '#eef1f6' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickMargin={8}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  formatter={(value: number, _key, item) => [
                    value,
                    item?.payload?.name || 'Điểm',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-vhu-primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </View>
      )}

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
