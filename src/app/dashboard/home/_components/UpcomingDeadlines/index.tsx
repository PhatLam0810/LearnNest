'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { dashboardQuery } from '~mdDashboard/redux';
import styles from './styles';

const MAX_ROWS = 3;

const daysLabel = (due: string) => {
  const days = dayjs(due).startOf('day').diff(dayjs().startOf('day'), 'day');
  if (days < 0) return 'Quá hạn';
  if (days === 0) return 'Hôm nay';
  return `${days} ngày`;
};

// "Hạn nộp gần nhất": bài thực hành được giao cho lớp mà học viên chưa nộp.
// Không có bài nào cần nộp thì ẩn cả khối (không chiếm chỗ ở Trang Chủ).
const UpcomingDeadlines: React.FC = () => {
  const router = useRouter();
  const { data } = dashboardQuery.useGetMyAssignmentsQuery();
  const rows = (data ?? [])
    .filter(a => a.status === 'not_submitted')
    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())
    .slice(0, MAX_ROWS);
  if (!rows.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hạn nộp gần nhất</Text>
      {rows.map(a => (
        <button
          key={a.assignmentId}
          type="button"
          style={styles.row as React.CSSProperties}
          onClick={() => router.push('/dashboard/my-assignments')}>
          <Text style={styles.taskTitle} numberOfLines={1}>
            {a.taskTitle}
          </Text>
          <Text style={a.isOverdue ? styles.dueOverdue : styles.due}>
            {daysLabel(a.dueDate)}
          </Text>
        </button>
      ))}
    </View>
  );
};

export default UpcomingDeadlines;
