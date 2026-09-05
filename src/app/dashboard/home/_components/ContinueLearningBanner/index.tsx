import React, { useMemo } from 'react';
import { Text, View } from 'react-native-web';
import { useRouter } from 'next/navigation';
import { AppButton } from '@components';
import { useAppSelector } from '@redux';
import { MyCourseItem } from '@/hooks/useMyCourses';
import styles from './styles';

type ContinueLearningBannerProps = {
  courses: MyCourseItem[];
  loading: boolean;
};

const greetingByHour = () => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};

// Banner cá nhân hóa đầu Trang Chủ - thay cho banner marketing cố định
// trước đây (mockSlides trong Banner cũ). Lấy khóa học học GẦN NHẤT trong
// useMyCourses (BE không sort sẵn, tự sort theo lastStudiedAt ở đây) để mời
// "học tiếp" đúng chỗ đang dở.
const ContinueLearningBanner: React.FC<ContinueLearningBannerProps> = ({
  courses,
  loading,
}) => {
  const router = useRouter();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  const latestCourse = useMemo(() => {
    if (!courses?.length) return null;
    return [...courses].sort(
      (a, b) =>
        new Date(b.lastStudiedAt).getTime() -
        new Date(a.lastStudiedAt).getTime(),
    )[0];
  }, [courses]);

  const firstName = userProfile?.fullName?.split(' ').slice(-1)[0] || '';

  if (loading) {
    return <View style={styles.bannerSkeleton} />;
  }

  if (!latestCourse) {
    // Chưa học khóa nào - mời khám phá thay vì hiện banner rỗng.
    return (
      <View style={styles.banner}>
        <View style={styles.textCol}>
          <Text style={styles.greeting}>
            {greetingByHour()}
            {firstName ? `, ${firstName}` : ''}
          </Text>
          <Text style={styles.headline}>
            Bắt đầu hành trình học tập của bạn
          </Text>
          <View style={styles.actionsRow}>
            <AppButton
              style={styles.ctaButton}
              onClick={() => router.push('/dashboard/lesson')}>
              Khám phá khóa học
            </AppButton>
          </View>
        </View>
      </View>
    );
  }

  const progress = Math.round(latestCourse.progress || 0);
  const remainingMinutes = latestCourse.lastSubLessonRemainingSeconds
    ? Math.ceil(latestCourse.lastSubLessonRemainingSeconds / 60)
    : 0;
  // Chỉ hiện "còn N phút nữa xong bài X" khi thật sự có bài đang dở (còn
  // thời lượng chưa xem) - nếu không, giữ nguyên câu "Tiếp tục học" chung
  // chung thay vì bịa ra số phút/tên bài không có thật.
  const headline =
    remainingMinutes > 0 && latestCourse.lastSubLessonTitle
      ? `Bạn còn ${remainingMinutes} phút nữa là xong bài "${latestCourse.lastSubLessonTitle}"`
      : `Tiếp tục học "${latestCourse.lessonName}"`;
  const hasLessonCount =
    !!latestCourse.totalItems && latestCourse.totalItems > 0;

  return (
    <View style={styles.banner}>
      <View style={styles.textCol}>
        <Text style={styles.greeting}>
          {greetingByHour()}
          {firstName ? `, ${firstName}` : ''}
        </Text>
        <Text style={styles.headline}>{headline}</Text>
        {hasLessonCount && (
          <Text style={styles.subtitle}>
            {latestCourse.lessonName} · đã hoàn thành{' '}
            {latestCourse.completedItems || 0}/{latestCourse.totalItems} bài
          </Text>
        )}
        <View style={styles.actionsRow}>
          <AppButton
            style={styles.ctaButton}
            onClick={() =>
              router.push(
                `/dashboard/home/lesson/moduleDetail?lessonId=${latestCourse.lessonId}&subLessonId=${latestCourse.lastSubLessonId || 'first-lesson'}`,
              )
            }>
            Học tiếp
          </AppButton>
          <AppButton
            style={styles.secondaryButton}
            onClick={() => router.push('/dashboard/lesson')}>
            Xem tất cả khóa học
          </AppButton>
        </View>
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.progressPercent}>{progress}%</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressCaption}>Tiến độ khóa học hiện tại</Text>
      </View>
    </View>
  );
};

export default ContinueLearningBanner;
