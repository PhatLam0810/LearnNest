// components/AppVideoWatchers.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  List,
  Avatar,
  Tag,
  Button,
  Spin,
  Empty,
  Typography,
  Space,
  Tooltip,
  Progress,
  message,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import styles from './styles';

const { Text } = Typography;

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
  onClose?: () => void;
}

const AppVideoWatchers: React.FC<AppVideoWatchersProps> = ({
  subLessonId,
  subLessonTitle,
  userId,
}) => {
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
    if (item.fullName) {
      return item.fullName;
    }
    if (item.username) return item.username;
    if (item.email) return item.email.split('@')[0];
    return `User ${item.userId?.slice(-6) || ''}`;
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat('vi-VN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  }, []);

  const fetchWatchers = useCallback(async () => {
    if (!subLessonId) {
      message.warning('Missing video ID');
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
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to load data';

      message.error(errorMessage);
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
    if (progress >= 90) return 'success';
    if (progress >= 50) return 'active';
    return 'normal';
  };

  const renderWatcherItem = useCallback(
    (item: WatcherItem) => {
      const actualWatchedTime = getActualWatchedTime(item);
      const watchedTimeStr = formatSecondsToTime(actualWatchedTime);
      const totalTimeStr = formatSecondsToTime(item.duration);
      const displayName = getDisplayName(item);
      const isCurrentUser = item.userId === userId;
      const initials = displayName.charAt(0).toUpperCase();

      return (
        <List.Item
          key={item._id}
          actions={[
            <Tooltip key="time" title={formatDate(item.watchedAt)}>
              <Text type="secondary" style={styles.secondaryText12}>
                <CalendarOutlined /> {formatDate(item.watchedAt)}
              </Text>
            </Tooltip>,
          ]}
          style={styles.listItemStyle}>
          <List.Item.Meta
            avatar={
              <Avatar
                src={item.avatar}
                icon={!item.avatar && <UserOutlined />}
                style={{
                  backgroundColor: isCurrentUser ? '#1890ff' : '#f56a00',
                  ...styles.avatarStyle,
                }}>
                {!item.avatar && initials}
              </Avatar>
            }
            title={
              <Space size={4}>
                <Text strong style={styles.strongText14}>
                  {displayName}
                </Text>
                {isCurrentUser && (
                  <Tag
                    color="blue"
                    icon={<UserOutlined style={styles.icon10} />}
                    style={styles.tagYouStyle}>
                    You
                  </Tag>
                )}
                {item.completed && (
                  <Tag
                    color="success"
                    icon={<CheckCircleOutlined style={styles.icon10} />}
                    style={styles.tagCompletedStyle}>
                    Completed
                  </Tag>
                )}
              </Space>
            }
            description={
              <Space direction="vertical" size={4} style={styles.spaceVertical}>
                <Row
                  justify="space-between"
                  align="middle"
                  style={styles.statisticLabel}>
                  <Col>
                    <Text type="secondary" style={styles.secondaryText12}>
                      <PlayCircleOutlined /> {item.progress || 0}%
                    </Text>
                  </Col>
                </Row>
                <Progress
                  percent={item.progress || 0}
                  size="small"
                  status={getProgressColor(item.progress)}
                  showInfo={false}
                />
                {item.email && (
                  <Text type="secondary" style={styles.secondaryText11}>
                    {item.email}
                  </Text>
                )}
              </Space>
            }
          />
        </List.Item>
      );
    },
    [
      formatSecondsToTime,
      getActualWatchedTime,
      getDisplayName,
      formatDate,
      userId,
    ],
  );

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const hasPrev = pagination.pageNum > 1;
    const hasNext = pagination.pageNum < pagination.totalPages;

    return (
      <Row justify="center" align="middle" style={styles.paginationRow}>
        <Col>
          <Button
            icon={<ArrowLeftOutlined />}
            disabled={!hasPrev}
            onClick={handlePrevPage}
            size="small"
            style={styles.avatarSize32}
          />
        </Col>
        <Col style={styles.columnMargin12}>
          <Text style={styles.text12Center}>
            {pagination.pageNum} / {pagination.totalPages}
          </Text>
        </Col>
        <Col>
          <Button
            icon={<ArrowRightOutlined />}
            disabled={!hasNext}
            onClick={handleNextPage}
            size="small"
            style={styles.avatarSize32}
          />
        </Col>
      </Row>
    );
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      <Space direction="vertical" style={styles.spaceVerticalPadding}>
        <Row
          justify="space-between"
          align="middle"
          style={styles.statisticLabel}>
          <Col>
            <Text strong style={styles.text16Bold}>
              👥 Viewers: {subLessonTitle}
            </Text>
          </Col>
          <Col>
            <Tag color="blue" style={styles.smallText12}>
              {watchers.length} users
              {pagination.total > 0}
            </Tag>
          </Col>
        </Row>

        {watchers.length === 0 && !loading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No viewers yet"
            style={styles.emptyPadding}
          />
        ) : (
          <>
            <List
              dataSource={watchers}
              renderItem={renderWatcherItem}
              locale={{ emptyText: 'No data available' }}
            />
            {renderPagination()}
          </>
        )}
      </Space>
    </Spin>
  );
};

export default AppVideoWatchers;
