import React, { useMemo } from 'react';
import { Text, View } from 'react-native-web';
import { Progress } from 'antd';
import { useRouter } from 'next/navigation';
import { AppButton } from '@components';
import { useAppSelector } from '@redux';
import { MyCourseItem } from '@/hooks/useMyCourses';
import LessonThumbnail from '~mdDashboard/components/LessonThumbnail';
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

  return (
    <View style={styles.banner}>
      <View style={styles.textCol}>
        <Text style={styles.greeting}>
          {greetingByHour()}
          {firstName ? `, ${firstName}` : ''}
        </Text>
        <Text style={styles.headline}>
          Tiếp tục học &ldquo;{latestCourse.lessonName}&rdquo;
        </Text>
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
        <View style={styles.thumbWrap}>
          <LessonThumbnail
            thumbnail={latestCourse.thumbnail}
            width={120}
            height={68}
          />
        </View>
        <Progress
          type="circle"
          percent={progress}
          size={72}
          strokeColor="#fff"
          trailColor="rgba(255,255,255,0.25)"
          format={p => <Text style={styles.progressText}>{p}%</Text>}
        />
      </View>
    </View>
  );
};

export default ContinueLearningBanner;
