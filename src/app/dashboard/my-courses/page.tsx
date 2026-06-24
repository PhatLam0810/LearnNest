'use client';

import React from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@redux';
import { useMyCourses } from '@/hooks/useMyCourses';
import LessonThumbnail from '~mdDashboard/components/LessonThumbnail';
import './styles.scss';
import { Progress } from 'antd';

export interface MyCourseItem {
  lessonId: string;
  lessonName?: string;
  name?: string;
  thumbnail?: string;
  progress: number;
  lastStudiedAt: string;
  lastSubLessonId: string;
}

interface CourseItemProps {
  course: MyCourseItem;
  formatRelativeTime?: (date: string) => string;
  onNavigate: (url: string) => void;
}

const CourseItem: React.FC<CourseItemProps> = React.memo(
  ({ course, formatRelativeTime, onNavigate }) => {
    const handleItemClick = () => {
      if (!course?.lessonId) return;
      const subLessonId = course?.lastSubLessonId || 'first-lesson';
      onNavigate(
        `/dashboard/home/lesson/moduleDetail?lessonId=${course.lessonId}&subLessonId=${subLessonId}`,
      );
    };

    return (
      <div
        className="course-list-item"
        onClick={handleItemClick}
        role="button"
        tabIndex={0}>
        <div className="course-list-item__thumb">
          <LessonThumbnail
            thumbnail={course?.thumbnail}
            width={120}
            height={68}
          />
        </div>

        <div className="course-list-item__content">
          <h3 className="course-title">
            {course?.lessonName || course?.name || 'Khóa học đang cập nhật...'}
          </h3>

          <span
            className="course-time"
            style={{ display: 'block', marginBottom: '4px' }}>
            {course?.lastStudiedAt
              ? `Học cách đây ${typeof formatRelativeTime === 'function' ? formatRelativeTime(course.lastStudiedAt) : 'gần đây'}`
              : 'Chưa bắt đầu học'}
          </span>

          <div
            className="course-item-progress"
            style={{ marginTop: '6px', width: '100%' }}>
            <Progress
              percent={Math.round(course?.progress)}
              size="small"
              status="active"
              strokeColor="green"
            />
          </div>
        </div>
      </div>
    );
  },
);

CourseItem.displayName = 'CourseItem';

const MyCoursesPage = () => {
  const router = useRouter();
  const userProfile = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile,
  );
  const userId = userProfile?._id || null;
  const { myCourses, loadingCourses, formatRelativeTime } =
    useMyCourses(userId);

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  if (loadingCourses) {
    return <div className="course-empty-state">Đang tải dữ liệu...</div>;
  }

  if (!Array.isArray(myCourses) || myCourses.length === 0) {
    return (
      <div className="course-empty-state">Bạn chưa bắt đầu khóa học nào.</div>
    );
  }

  return (
    <div className="my-courses-page">
      <h1 className="my-courses-heading">Khóa học của tôi</h1>
      <div className="my-courses-list">
        {myCourses
          .filter(course => course && course.lessonId)
          .map(course => (
            <CourseItem
              key={course.lessonId}
              course={course}
              formatRelativeTime={formatRelativeTime}
              onNavigate={handleNavigate}
            />
          ))}
      </div>
    </div>
  );
};

export default MyCoursesPage;
