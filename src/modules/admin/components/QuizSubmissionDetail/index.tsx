'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Skeleton } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import AppButton from '@components/AppButton';
import { adminQuery } from '~mdAdmin/redux';
import { QuizResultDetailQuestion } from '../../redux/RTKQuery/type';
import SubmissionDetailHeader from '../SubmissionDetailHeader';
import styles from './styles';

interface QuizSubmissionDetailProps {
  resultId: string;
}

const LETTERS = ['A', 'B', 'C', 'D'];

const Question: React.FC<{ q: QuizResultDetailQuestion; index: number }> = ({
  q,
  index,
}) => (
  <View style={styles.question}>
    <Text
      style={styles.questionTitle}>{`Câu ${index + 1}. ${q.question}`}</Text>
    {q.answerList.map((text, i) => {
      const letter = LETTERS[i];
      const isCorrectOption = letter === q.correctAnswer;
      const isChosen = letter === q.selected;
      const optionStyle = isCorrectOption
        ? styles.optionCorrect
        : isChosen
          ? styles.optionWrong
          : undefined;
      return (
        <View key={letter} style={{ ...styles.option, ...optionStyle }}>
          <Text style={styles.optionLetter}>{letter}</Text>
          <Text style={styles.optionText}>{text}</Text>
          {isCorrectOption && (
            <Text style={{ ...styles.optionTag, ...styles.tagCorrect }}>
              <CheckCircleFilled aria-hidden />
              {isChosen ? ' Học viên chọn · Đúng' : ' Đáp án đúng'}
            </Text>
          )}
          {isChosen && !isCorrectOption && (
            <Text style={{ ...styles.optionTag, ...styles.tagWrong }}>
              <CloseCircleFilled aria-hidden /> Học viên chọn · Sai
            </Text>
          )}
        </View>
      );
    })}
    {!q.selected && (
      <Text style={styles.unanswered}>Học viên bỏ trống câu này.</Text>
    )}
  </View>
);

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
        <View style={styles.questions}>
          {data.questions.map((q, i) => (
            <Question key={q._id} q={q} index={i} />
          ))}
        </View>
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
