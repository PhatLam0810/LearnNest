// components/AppVideoWatchers.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Avatar,
  Tag,
  Button,
  Popconfirm,
  Spin,
  Empty,
  Progress,
  message,
} from 'antd';
import {
  UserOutlined,
  CheckCircleFilled,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { View, Text } from 'react-native-web';
import { adminQuery } from '~mdAdmin/redux';
import { ReminderHistory } from '~mdAdmin/components';
import styles from './styles';

interface WatcherItem {
  _id: string;
  userId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  watchedAt: string;
  duration: number;
  progress: number;
  completed: boolean;
  watchedSeconds?: number;
  lastPosition?: number;
  totalWatchedTime?: number;
  actualWatchedTime?: number;
  subLessonId: string;
}

interface PaginationData {
  items: WatcherItem[];
  totalRecords: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data: PaginationData;
  items?: WatcherItem[];
  totalRecords?: number;
}

interface AppVideoWatchersProps {
  subLessonId: string;
  subLessonTitle: string;
  userId: string;
  // Chỉ admin mở từ trang quản trị mới truyền — có giá trị thì mới hiện nút
  // "Nhắc những người chưa xem" (cần lessonId để gọi đúng API nhắc theo
  // khóa). Không truyền thì ẩn nút, không đổi gì hành vi cũ.
  lessonId?: string;
  onClose?: () => void;
}

// Danh sách "đã xem bài này" — dùng cả cho học viên (nút mắt cạnh mỗi video,
// admin/level<=2 mới thấy nút) lẫn cho trang tổng quan nội dung khóa học của
// admin. Toàn bộ chữ hiển thị PHẢI là tiếng Việt — component này trước đây
// để nguyên tiếng Anh (Viewers/users/You/Completed/No viewers yet...), đã
// dịch lại hết + làm gọn giao diện (card thay vì List thô, bỏ progress bar
// lặp lại 2 lần cho cùng 1 số %).
const AppVideoWatchers: React.FC<AppVideoWatchersProps> = ({
  subLessonId,
  subLessonTitle,
  userId,
  lessonId,
}) => {
  const [remindNotWatched, { isLoading: isReminding }] =
    adminQuery.useRemindNotWatchedVideoMutation();
  const [watchers, setWatchers] = useState<WatcherItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const formatSecondsToTime = useCallback((seconds: number): string => {
    if (!seconds || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getActualWatchedTime = useCallback((item: WatcherItem): number => {
    return (
      item.totalWatchedTime ||
      item.watchedSeconds ||
      item.actualWatchedTime ||
      item.lastPosition ||
      0
    );
  }, []);

  const getDisplayName = useCallback((item: WatcherItem): string => {
    if (item.fullName) return item.fullName;
    if (item.username) return item.username;
    if (item.email) return item.email.split('@')[0];
    return `Người dùng ${item.userId?.slice(-6) || ''}`;
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  }, []);

  const fetchWatchers = useCallback(async () => {
    if (!subLessonId) {
      message.warning('Thiếu ID video');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}/lesson/sublesson/${subLessonId}/watchers`,
        {
          params: {
            pageNum: pagination.pageNum,
            pageSize: pagination.pageSize,
          },
          timeout: 10000,
        },
      );

      const responseData = response.data;

      let items: WatcherItem[] = [];
      let totalRecords = 0;
      let pageNum = pagination.pageNum;
      let pageSize = pagination.pageSize;
      let totalPages = 0;

      if (responseData.data?.items) {
        items = responseData.data.items;
        totalRecords = responseData.data.totalRecords || 0;
        pageNum = responseData.data.pageNum || pageNum;
        pageSize = responseData.data.pageSize || pageSize;
        totalPages = responseData.data.totalPages || 0;
      } else if (responseData.items) {
        items = responseData.items;
        totalRecords = responseData.totalRecords || items.length;
      }

      const validItems = items.filter(
        item => item && item.userId && item.progress != null,
      );

      setWatchers(validItems);
      setPagination({
        pageNum,
        pageSize,
        total: totalRecords,
        totalPages: totalPages || Math.ceil(totalRecords / pageSize),
      });
    } catch (error: any) {
      console.error('Fetch error:', error);
      message.error(
        error.response?.data?.message ||
          'Không tải được danh sách, thử lại sau',
      );
      setWatchers([]);
    } finally {
      setLoading(false);
    }
  }, [subLessonId, pagination.pageNum, pagination.pageSize, API_BASE_URL]);

  useEffect(() => {
    if (subLessonId) {
      fetchWatchers();
    }
  }, [subLessonId, pagination.pageNum, fetchWatchers]);

  const handlePrevPage = () => {
    setPagination(prev => ({
      ...prev,
      pageNum: Math.max(1, prev.pageNum - 1),
    }));
  };

  const handleNextPage = () => {
    setPagination(prev => ({
      ...prev,
      pageNum: Math.min(prev.totalPages, prev.pageNum + 1),
    }));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return '#16a34a';
    if (progress >= 50) return '#1d418a';
    return '#d97706';
  };

  const handleRemindNotWatched = async () => {
    if (!lessonId) return;
    try {
      const res = await remindNotWatched({ lessonId, subLessonId }).unwrap();
      if (res.totalEligible === 0) {
        message.info(
          'Hiện không có ai cần nhắc (đã xem hết hoặc mới nhắc gần đây)',
        );
        return;
      }
      message.success(
        `Đã nhắc ${res.sent}/${res.totalEligible} học viên chưa xem${
          res.failed ? ` (${res.failed} gửi thất bại)` : ''
        }`,
      );
    } catch (error: any) {
      message.error(
        error?.data?.message || 'Gửi nhắc nhở thất bại, thử lại sau',
      );
    }
  };

  return (
    <Spin spinning={loading}>
      {/* Modal bọc ngoài (LessonDetailPage/LessonContentOverview) đã hiện
          tên video ở title của Modal rồi — chỉ hiện số lượng ở đây, tránh
          lặp lại tên video 2 lần. */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Người đã xem</Text>
        <View style={styles.headerActions}>
          <Tag color="blue" style={styles.countTag}>
            {pagination.total} người
          </Tag>
          {lessonId && (
            <Popconfirm
              title="Gửi email nhắc nhở?"
              description="Sẽ gửi email THẬT tới toàn bộ học viên chưa xem xong video này. Không thể thu hồi sau khi gửi."
              okText="Gửi"
              cancelText="Huỷ"
              onConfirm={handleRemindNotWatched}>
              <Button size="small" loading={isReminding}>
                Nhắc người chưa xem
              </Button>
            </Popconfirm>
          )}
        </View>
      </View>
      {lessonId && (
        <View style={{ marginBottom: 8 }}>
          <ReminderHistory
            lessonId={lessonId}
            type="video"
            targetId={subLessonId}
          />
        </View>
      )}

      {watchers.length === 0 && !loading ? (
        <View style={styles.emptyWrap}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có ai xem bài học này"
          />
        </View>
      ) : (
        <>
          <View style={styles.list}>
            {watchers.map(item => {
              const actualWatchedTime = getActualWatchedTime(item);
              const watchedTimeStr = formatSecondsToTime(actualWatchedTime);
              const totalTimeStr = formatSecondsToTime(item.duration);
              const displayName = getDisplayName(item);
              const isCurrentUser = item.userId === userId;
              const initials = displayName.charAt(0).toUpperCase();

              return (
                <View key={item._id} style={styles.card}>
                  <Avatar
                    src={item.avatar}
                    icon={!item.avatar && <UserOutlined />}
                    style={{
                      ...styles.avatar,
                      backgroundColor: isCurrentUser ? '#1d418a' : '#f56a00',
                    }}>
                    {!item.avatar && initials}
                  </Avatar>
                  <View style={styles.cardBody}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name} numberOfLines={1}>
                        {displayName}
                      </Text>
                      {isCurrentUser && (
                        <Tag color="blue" style={styles.meRow}>
                          Bạn
                        </Tag>
                      )}
                      {item.completed && (
                        <Tag
                          color="success"
                          icon={<CheckCircleFilled />}
                          style={styles.doneTag}>
                          Đã hoàn thành
                        </Tag>
                      )}
                    </View>
                    {item.email && (
                      <Text style={styles.email} numberOfLines={1}>
                        {item.email}
                      </Text>
                    )}
                    <View style={styles.progressRow}>
                      <View style={styles.progressBarWrap}>
                        <Progress
                          percent={item.progress || 0}
                          size="small"
                          showInfo={false}
                          strokeColor={getProgressColor(item.progress)}
                        />
                      </View>
                      <Text style={styles.progressLabel}>
                        {item.progress || 0}%
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaText}>
                        Đã xem {watchedTimeStr} / {totalTimeStr}
                      </Text>
                      <Text style={styles.metaText}>
                        {formatDate(item.watchedAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {pagination.totalPages > 1 && (
            <View style={styles.paginationRow}>
              <Button
                icon={<ArrowLeftOutlined />}
                disabled={pagination.pageNum <= 1}
                onClick={handlePrevPage}
                size="small"
              />
              <Text style={styles.pageText}>
                Trang {pagination.pageNum}/{pagination.totalPages}
              </Text>
              <Button
                icon={<ArrowRightOutlined />}
                disabled={pagination.pageNum >= pagination.totalPages}
                onClick={handleNextPage}
                size="small"
              />
            </View>
          )}
        </>
      )}
    </Spin>
  );
};

export default AppVideoWatchers;
