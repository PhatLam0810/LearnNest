'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Tag } from 'antd';
import { useRouter } from 'next/navigation';
import AppButton from '@components/AppButton';
import { dashboardQuery } from '~mdDashboard/redux';
import type { PlayQuizSummary } from '~mdDashboard/redux/RTKQuery/types';
import styles from './styles';

// Các bài tập trắc nghiệm (admin tạo ở "Ngân Hàng Câu Hỏi / Bài tập") gắn với
// bài học đang xem. Không có bài nào thì không hiện gì.
export const QuizSummaryItems: React.FC<{ quizzes: PlayQuizSummary[] }> = ({
  quizzes,
}) => {
  const router = useRouter();
  return (
    <>
      {quizzes.map(q => {
        const left = q.maxAttempts ? q.maxAttempts - q.attemptsUsed : null;
        const exhausted = left !== null && left <= 0;
        return (
          <View key={q._id} style={styles.item}>
            <View style={styles.info}>
              <Text style={styles.title}>{q.title}</Text>
              <Text style={styles.meta}>
                {q.questionCount} câu
                {q.timeLimitMinutes ? ` · ${q.timeLimitMinutes} phút` : ''} ·
                đạt từ {q.passThresholdPercent}%
                {left !== null ? ` · còn ${Math.max(left, 0)} lượt` : ''}
              </Text>
            </View>
            {q.passed ? (
              <Tag color="green">Đã đạt {q.bestPercent}%</Tag>
            ) : q.bestPercent !== null ? (
              <Tag color="orange">Cao nhất {q.bestPercent}%</Tag>
            ) : null}
            <AppButton
              type="primary"
              style={styles.button}
              disabled={exhausted}
              onClick={() => router.push(`/dashboard/quiz/${q._id}`)}>
              {exhausted ? 'Hết lượt' : q.attemptsUsed ? 'Làm lại' : 'Làm bài'}
            </AppButton>
          </View>
        );
      })}
    </>
  );
};

const LibraryQuizList: React.FC<{ libraryId?: string }> = ({ libraryId }) => {
  const { data } = dashboardQuery.useGetLibraryQuizzesQuery(libraryId ?? '', {
    skip: !libraryId,
    refetchOnMountOrArgChange: true,
  });
  if (!data?.length) return null;

  return (
    <View style={styles.wrap}>
      <Text role="heading" aria-level={2} style={styles.heading}>
        Bài tập trắc nghiệm
      </Text>
      <QuizSummaryItems quizzes={data} />
    </View>
  );
};

export default LibraryQuizList;
