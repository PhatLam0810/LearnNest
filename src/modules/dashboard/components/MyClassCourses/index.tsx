'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { dashboardQuery } from '~mdDashboard/redux';
import styles from './styles';

// "Khóa học của lớp tôi": khóa được phân cho lớp đang hoạt động mà học viên
// thuộc, kèm hạn hoàn thành và tiến độ của riêng mình. Không có lớp nào (vd
// tài khoản khách) thì không hiện gì.
const MyClassCourses: React.FC = () => {
  const router = useRouter();
  const { data } = dashboardQuery.useGetMyClassesQuery();

  const rows = (data ?? []).flatMap(cls =>
    cls.courses.map(course => ({ ...course, classCode: cls.code })),
  );
  if (!rows.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Khóa học của lớp tôi</Text>
      <View style={styles.list}>
        {rows.map(row => {
          const ended = !!row.endAt && dayjs(row.endAt).isBefore(dayjs());
          return (
            <View key={`${row.classCode}-${row.lessonId}`} style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.classCode}>{row.classCode}</Text>
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {row.title}
                </Text>
                <Text style={ended ? styles.deadlineEnded : styles.deadline}>
                  {row.endAt
                    ? `${ended ? 'Đã hết hạn' : 'Hạn hoàn thành'} ${dayjs(row.endAt).format('DD/MM/YYYY')}`
                    : 'Không giới hạn thời gian'}
                </Text>
              </View>
              <View style={styles.progressBox}>
                <View style={styles.track}>
                  <View style={{ ...styles.fill, width: `${row.percent}%` }} />
                </View>
                <Text style={styles.percent}>{row.percent}%</Text>
              </View>
              <button
                type="button"
                style={styles.cta as React.CSSProperties}
                onClick={() =>
                  router.push(`/dashboard/home/lesson/${row.lessonId}`)
                }>
                {row.percent > 0 ? 'Học tiếp' : 'Bắt đầu học'}
              </button>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default MyClassCourses;
