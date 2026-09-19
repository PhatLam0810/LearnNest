'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Skeleton } from 'antd';
import AppButton from '@components/AppButton';
import QuizAnswerReview from '@components/QuizAnswerReview';
import { adminQuery } from '~mdAdmin/redux';
import SubmissionDetailHeader from '../SubmissionDetailHeader';
import styles from './styles';

interface QuizSubmissionDetailProps {
  resultId: string;
}

const QuizSubmissionDetail: React.FC<QuizSubmissionDetailProps> = ({
  resultId,
}) => {
  const { data, isFetching, isError, refetch } =
    adminQuery.useGetQuizResultDetailQuery(resultId);

  if (isFetching && !data) {
    return (
      <View style={styles.card}>
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </View>
    );
  }
  if (isError || !data) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.errorText}>Không tải được chi tiết bài nộp.</Text>
        <AppButton style={{ width: 'auto', height: 40 }} onClick={refetch}>
          Thử lại
        </AppButton>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <SubmissionDetailHeader
        learner={data.user}
        submittedAt={data.createdAt}
        scoreLabel={`${data.score}/10`}
        state={data.isPass ? 'passed' : 'failed'}
      />
      {!!data.feedback && (
        <View style={styles.quoteBlock}>
          <Text style={styles.quoteLabel}>Nhận xét tự động</Text>
          <Text style={styles.quoteText}>{data.feedback}</Text>
        </View>
      )}
      {data.hasAnswers ? (
        <QuizAnswerReview questions={data.questions} />
      ) : (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            {`Bài nộp này ghi nhận ${data.correctCount}/${data.totalQuestions} câu đúng, nhưng được nộp trước khi hệ thống lưu đáp án từng câu nên không thể hiển thị chi tiết.`}
          </Text>
        </View>
      )}
    </View>
  );
};

export default QuizSubmissionDetail;
