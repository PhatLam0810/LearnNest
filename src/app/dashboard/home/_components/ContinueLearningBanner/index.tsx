import React, { useMemo } from 'react';
import { Text, View } from 'react-native-web';
import { useRouter } from 'next/navigation';
import { AppButton } from '@components';
import { PlayCircleOutlined, BookOpenOutlined } from '@components/AppIcon';
import { MyCourseItem } from '~mdDashboard/redux/RTKQuery/types';
import styles from './styles';

type ContinueLearningBannerProps = {
  courses: MyCourseItem[];
  loading: boolean;
};

// Khối 'Tiếp tục bài học gần nhất' (Resume Learning):
// Thiết kế dạng thẻ Card nổi bật (bóng đổ mềm, bo góc 16px) với thanh tiến
// trình % gradient, nút bấm 'Học tiếp' có icon Play biến hình morphicon.
const ContinueLearningBanner: React.FC<ContinueLearningBannerProps> = ({
  courses,
  loading,
}) => {
  const router = useRouter();

  const latestCourse = useMemo(() => {
    if (!courses?.length) return null;
    return [...courses].sort(
      (a, b) =>
        new Date(b.lastStudiedAt).getTime() -
        new Date(a.lastStudiedAt).getTime(),
    )[0];
  }, [courses]);

  if (loading) {
    return <View style={styles.bannerSkeleton} />;
  }

  if (!latestCourse) {
    return (
      <View style={styles.banner} aria-label="Tiếp tục bài học">
        <View style={styles.textCol}>
          <View style={styles.cardTag}>
            <BookOpenOutlined size={14} color="var(--color-vhu-secondary)" />
            <Text style={styles.cardTagText}>Bắt đầu lộ trình</Text>
          </View>
          <Text style={styles.headline}>
            Sẵn sàng bứt phá cùng chứng chỉ MOS & CNTT
          </Text>
          <Text style={styles.subtitle}>
            Chọn một khóa học để bắt đầu tích lũy kiến thức và điểm rèn luyện
            ngay hôm nay.
          </Text>
          <View style={styles.actionsRow}>
            <AppButton
              style={styles.ctaButton}
              onClick={() => router.push('/dashboard/lesson')}>
              <PlayCircleOutlined size={16} color="var(--color-text-primary)" />
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

  const headline =
    remainingMinutes > 0 && latestCourse.lastSubLessonTitle
      ? `Còn ${remainingMinutes} phút nữa là xong: "${latestCourse.lastSubLessonTitle}"`
      : `Tiếp tục học: "${latestCourse.lessonName}"`;

  const hasLessonCount =
    !!latestCourse.totalItems && latestCourse.totalItems > 0;

  return (
    <View style={styles.banner} aria-label="Tiếp tục bài học gần nhất">
      <View style={styles.textCol}>
        <View style={styles.cardTag}>
          <Text style={styles.cardTagText}>🔥 TIẾP TỤC BÀI HỌC GẦN NHẤT</Text>
        </View>
        <Text style={styles.headline}>{headline}</Text>
        {hasLessonCount && (
          <Text style={styles.subtitle}>
            {latestCourse.lessonName} · Đã hoàn thành{' '}
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
            <PlayCircleOutlined size={18} color="var(--color-text-primary)" />
            Học tiếp ngay
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
        <View
          style={styles.progressTrack}
          {...({
            role: 'progressbar',
            'aria-label': 'Tiến độ hoàn thành',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': progress,
          } as object)}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressCaption}>Tiến độ khóa học này</Text>
      </View>
    </View>
  );
};

export default ContinueLearningBanner;
