'use client';
import React, { useState } from 'react';
import { View } from 'react-native-web';
import { ContentTab, ContentTabStrip } from '~mdAdmin/components';
import QuizListTab from './_components/QuizListTab';
import QuestionBankTab from './_components/QuestionBankTab';
import styles from './styles';

const tabs: ContentTab[] = [
  { key: 'quizzes', label: 'Bài tập' },
  { key: 'bank', label: 'Ngân hàng câu hỏi' },
];

const QuizManagePage: React.FC = () => {
  const [activeKey, setActiveKey] = useState('quizzes');

  return (
    <View style={styles.container}>
      <ContentTabStrip
        tabs={tabs}
        activeKey={activeKey}
        onChange={setActiveKey}
      />
      <View style={styles.tabBody}>
        {activeKey === 'quizzes' ? <QuizListTab /> : <QuestionBankTab />}
      </View>
    </View>
  );
};

export default QuizManagePage;
