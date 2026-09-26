'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Button, Drawer, Progress, Result, Skeleton, Tag } from 'antd';
import dayjs from 'dayjs';
import { adminQuery } from '~mdAdmin/redux';
import StateTag from '~mdAdmin/components/StateTag';
import type { LearningProfileActivity } from '~mdAdmin/redux/RTKQuery/type';
import styles from './styles';

const TYPE_LABEL: Record<LearningProfileActivity['type'], string> = {
  practice: 'Bài thực hành',
  quiz: 'Trắc nghiệm',
  mockExam: 'Thi thử',
};

// Quy ước màu điểm dùng cả dự án: >=8 tốt, >=5 tạm được, còn lại yếu.
const scoreStyle = (score: number | null) =>
  score === null
    ? styles.scoreNone
    : score >= 8
      ? styles.scoreGood
      : score >= 5
        ? styles.scoreOk
        : styles.scoreBad;

interface Props {
  userId: string | null;
  onClose: () => void;
}

const StudentProfileDrawer: React.FC<Props> = ({ userId, onClose }) => {
  const { data, isFetching, isError, refetch } =
    adminQuery.useGetStudentLearningProfileQuery(userId ?? '', {
      skip: !userId,
    });

  return (
    <Drawer
      open={!!userId}
      onClose={onClose}
      width={520}
      title="Hồ sơ học tập"
      destroyOnClose>
      {isFetching && !data ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : isError || !data ? (
        <Result
          status="warning"
          title="Không tải được hồ sơ học tập"
          extra={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      ) : (
        <View style={styles.body}>
          <View>
            <Text style={styles.name}>{data.user.fullName}</Text>
            <Text style={styles.meta}>
              {[data.user.email, data.user.studentId, data.user.class]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </View>

          <View>
            <Text style={styles.sectionTitle}>
              Khóa học ({data.courses.length})
            </Text>
            {data.courses.length === 0 ? (
              <Text style={styles.empty}>Chưa ghi danh khóa học nào.</Text>
            ) : (
              data.courses.map(c => (
                <View key={c.lessonId} style={styles.course}>
                  <View style={styles.courseHead}>
                    <Text style={styles.courseTitle}>{c.title}</Text>
                    {c.isCompleted && (
                      <StateTag
                        label="Hoàn thành"
                        color="var(--color-success)"
                        bg="var(--color-success-bg)"
                      />
                    )}
                  </View>
                  <Progress
                    percent={c.progressPercent}
                    size="small"
                    aria-label={`Tiến độ ${c.title}`}
                  />
                  <Text style={styles.courseMeta}>
                    {c.completedItems}/{c.totalItems} mục
                    {c.enrolledAt
                      ? ` · ghi danh ${dayjs(c.enrolledAt).format('DD/MM/YYYY')}`
                      : ''}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View>
            <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
            {data.recentActivity.length === 0 ? (
              <Text style={styles.empty}>Chưa có bài nộp nào.</Text>
            ) : (
              data.recentActivity.map((a, i) => (
                <View key={`${a.type}-${a.at}-${i}`} style={styles.activity}>
                  <Tag>{TYPE_LABEL[a.type]}</Tag>
                  <Text style={styles.activityTitle}>{a.title}</Text>
                  {a.isLate && <Tag color="warning">Nộp muộn</Tag>}
                  <Text style={scoreStyle(a.score)}>
                    {a.score === null ? '—' : a.score}
                  </Text>
                  <Text style={styles.date}>
                    {dayjs(a.at).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      )}
    </Drawer>
  );
};

export default StudentProfileDrawer;
