'use client';
import React from 'react';
import { View } from 'react-native-web';
import QuestionBankTab from './_components/QuestionBankTab';
import styles from './styles';

// Tab "Bài tập" (QuizListTab) đã ẩn: đề soạn ở đó (Quiz) không nối vào luồng
// làm bài của học viên nên soạn xong học viên không thấy. Bài trắc nghiệm học
// viên làm là Library.questionList, quản lý ở phần Thư viện/khóa học.
const QuizManagePage: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.tabBody}>
      <QuestionBankTab />
    </View>
  </View>
);

export default QuizManagePage;
