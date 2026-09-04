import React from 'react';
import { Text, View } from 'react-native-web';
import { Progress } from 'antd';
import { useRouter } from 'next/navigation';
import { MyCourseItem } from '@/hooks/useMyCourses';
import LessonThumbnail from '~mdDashboard/components/LessonThumbnail';
import styles from './styles';

type ContinuingCoursesProps = {
  courses: MyCourseItem[];
  loading: boolean;
  formatRelativeTime: (date: string) => string;
};

// Section "Đang học" - dùng lại NGUYÊN dữ liệu useMyCourses (đã đúng shape,
// không đổi BE), nhưng tự vẽ card riêng thay vì import thẳng
// src/components/CourseItem: style của CourseItem chỉ có tác dụng khi lồng
// trong class ".my-courses-dropdown-panel" (CSS scoped theo dropdown ở
// HeaderLayout) - đặt trực tiếp ở đây sẽ ra card không style gì cả.
const ContinuingCourses: React.FC<ContinuingCoursesProps> = ({
  courses,
  loading,
  formatRelativeTime,
}) => {
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.grid}>
        {[0, 1].map(i => (
          <View key={i} style={styles.cardSkeleton} />
        ))}
      </View>
    );
  }

  if (!courses?.length) return null;

  return (
    <View style={styles.grid}>
      {courses.map(course => (
        <View
          key={course.lessonId}
          style={styles.card}
          onClick={() =>
            router.push(
              `/dashboard/home/lesson/moduleDetail?lessonId=${course.lessonId}&subLessonId=${course.lastSubLessonId || 'first-lesson'}`,
            )
          }>
          <View style={styles.thumbWrap}>
            <LessonThumbnail thumbnail={course.thumbnail} />
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {course.lessonName}
          </Text>
          <Text style={styles.time}>
            Học cách đây {formatRelativeTime(course.lastStudiedAt)}
          </Text>
          <Progress
            percent={Math.round(course.progress || 0)}
            size="small"
            status="active"
            strokeColor="var(--color-vhu-primary)"
          />
        </View>
      ))}
    </View>
  );
};

export default ContinuingCourses;
