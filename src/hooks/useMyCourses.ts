// useMyCourses.ts
import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export interface MyCourseItem {
  lessonId: string;
  lessonName?: string;
  thumbnail?: string;
  progress: number;
  lastStudiedAt: string;
  lastSubLessonId: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:9999';

export const useMyCourses = (userId: string | null) => {
  const [myCourses, setMyCourses] = useState<MyCourseItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);

  const fetchMyCourses = useCallback(async () => {
    if (!userId) return;
    setLoadingCourses(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/lesson/user/${userId}/my-courses`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMyCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khóa học của tôi:', error);
      message.error('Không thể tải danh sách khóa học lúc này.');
    } finally {
      setLoadingCourses(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  const formatRelativeTime = useCallback((dateString: string) => {
    if (!dateString) return '';
    return dayjs(dateString).fromNow();
  }, []);

  return {
    myCourses,
    loadingCourses,
    fetchMyCourses,
    formatRelativeTime,
  };
};
