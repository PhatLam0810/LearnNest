import { asButton } from '@/utils/asButton';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Progress } from 'antd';
import { useRouter } from 'next/navigation';
import { MyCourseItem } from '~mdDashboard/redux/RTKQuery/types';
import LessonThumbnail from '~mdDashboard/components/LessonThumbnail';
import { useResponsive } from '@/styles/responsive';
import motion from '@/styles/motion';
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
  const openCourse = (course: (typeof courses)[number]) =>
    router.push(
      `/dashboard/home/lesson/moduleDetail?lessonId=${course.lessonId}&subLessonId=${course.lastSubLessonId || 'first-lesson'}`,
    );
  const [hoverId, setHoverId] = useState<string | null>(null);
  const { isMobile } = useResponsive();
  // repeat(auto-fill, minmax(240px, 1fr)) để lại 1 cột ma bên phải trên màn
  // hẹp (auto-fill tính số cột theo bề rộng container thực tế, có thể rộng
  // hơn viewport khả kiến) - ép hẳn 1 cột full-width ở mobile thay vì để
  // grid tự tính.
  const gridStyle = [
    styles.grid,
    isMobile ? { gridTemplateColumns: '1fr' } : null,
  ];

  if (loading) {
    return (
      <View style={gridStyle}>
        {[0, 1].map(i => (
          <View key={i} style={styles.cardSkeleton} />
        ))}
      </View>
    );
  }

  if (!courses?.length) return null;

  return (
    <View style={gridStyle}>
      {courses.map(course => (
        <View
          key={course.lessonId}
          onMouseEnter={() => setHoverId(course.lessonId)}
          onMouseLeave={() => setHoverId(null)}
          style={{
            ...styles.card,
            ...(hoverId === course.lessonId ? motion.cardHoverOn : null),
          }}
          {...asButton(() => openCourse(course), course.lessonName)}
          onClick={() => openCourse(course)}>
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
            aria-label={`Tiến độ ${course.lessonName}`}
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
