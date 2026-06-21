// CourseItem.tsx
'use client';

import React from 'react';
import { Progress } from 'antd';
import { useRouter } from 'next/navigation';
import { MyCourseItem } from '@/hooks/useMyCourses';
import LessonThumbnail from '~mdDashboard/components/LessonThumbnail';

interface CourseItemProps {
  course: MyCourseItem;
  formatRelativeTime: (date: string) => string;
  onNavigate: (url: string) => void; // Dùng callback thay vì truyền nguyên cả object router vào
}

export const CourseItem: React.FC<CourseItemProps> = React.memo(
  ({ course, formatRelativeTime, onNavigate }) => {
    const handleItemClick = () => {
      const currentLessonId = course?.lessonId;
      const currentSubLessonId = course?.lastSubLessonId || 'first-lesson';

      if (!currentLessonId) {
        console.error('Không tìm thấy lessonId cho khóa học này');
        return;
      }

      onNavigate(
        `/dashboard/home/lesson/moduleDetail?lessonId=${currentLessonId}&subLessonId=${currentSubLessonId}`,
      );
    };

    return (
      <div
        className="course-item"
        onClick={handleItemClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter') handleItemClick();
        }}>
        <div className="course-thumb-wrap">
          <LessonThumbnail
            thumbnail={course?.thumbnail}
            width={120}
            height={68}
          />
        </div>

        <div className="course-info">
          <h4 className="course-title">{course?.lessonName}</h4>
          <span className="course-time">
            Học cách đây{' '}
            {typeof formatRelativeTime === 'function'
              ? formatRelativeTime(course?.lastStudiedAt || '')
              : 'gần đây'}
          </span>
          <div className="course-progress-bar">
            <Progress
              percent={course.progress || 0}
              size="small"
              status="active"
              strokeColor="#ff512f"
            />
          </div>
        </div>
      </div>
    );
  },
);

CourseItem.displayName = 'CourseItem';
export default CourseItem;
