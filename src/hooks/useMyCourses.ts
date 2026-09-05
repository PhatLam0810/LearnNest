import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import api from '@/services/api';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export interface MyCourseItem {
  lessonId: string;
  lessonName?: string;
  thumbnail?: string;
  progress: number;
  lastStudiedAt: string;
  lastSubLessonId: string;
  totalItems?: number;
  completedItems?: number;
  lastSubLessonTitle?: string;
  lastSubLessonRemainingSeconds?: number;
}

export const useMyCourses = (userId: string | null) => {
  const [myCourses, setMyCourses] = useState<MyCourseItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);

  const fetchMyCourses = useCallback(async () => {
    if (!userId) return;
    setLoadingCourses(true);
    try {
      const response = await api.get(`/lesson/user/${userId}/my-courses`);
      const data = response.data;
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
