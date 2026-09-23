'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { CheckCircleFilled, CloseCircleFilled } from '@components/AppIcon';
import styles from './styles';
import { QuizAnswerReviewProps, QuizAnswerReviewQuestion } from './types';

const Question: React.FC<{
  q: QuizAnswerReviewQuestion;
  index: number;
  chooserLabel: string;
}> = ({ q, index, chooserLabel }) => (
  <View style={styles.question}>
    <Text
      style={styles.questionTitle}>{`Câu ${index + 1}. ${q.question}`}</Text>
    {q.answerList.map((text, i) => {
      const letter = String.fromCharCode(65 + i);
      const isCorrectOption = !!q.correctAnswer && letter === q.correctAnswer;
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
              {isChosen ? ` ${chooserLabel} chọn · Đúng` : ' Đáp án đúng'}
            </Text>
          )}
          {isChosen && !isCorrectOption && (
            <Text style={{ ...styles.optionTag, ...styles.tagWrong }}>
              <CloseCircleFilled aria-hidden /> {chooserLabel} chọn · Sai
            </Text>
          )}
        </View>
      );
    })}
    {!q.selected && (
      <Text style={styles.unanswered}>
        {`${chooserLabel} bỏ trống câu này.`}
      </Text>
    )}
  </View>
);

// Xem lại từng câu: đáp án đúng viền xanh, lựa chọn sai của người làm viền đỏ.
// Dùng chung cho màn admin (QuizSubmissionDetail) và màn kết quả của học viên.
const QuizAnswerReview: React.FC<QuizAnswerReviewProps> = ({
  questions,
  chooserLabel = 'Học viên',
}) => (
  <View style={styles.questions}>
    {questions.map((q, i) => (
      <Question key={q._id} q={q} index={i} chooserLabel={chooserLabel} />
    ))}
  </View>
);

export default QuizAnswerReview;
