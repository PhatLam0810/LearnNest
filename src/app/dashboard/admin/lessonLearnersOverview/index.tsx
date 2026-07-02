'use client';
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { View } from 'react-native-web';
import styles from './styles';
import './styles.scss';
import { LessonOverView, PracticeClassOver } from './components';
const onChange = (key: string) => {};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Tổng Quan Khóa học',
    children: <LessonOverView />,
  },
  {
    key: '2',
    label: 'Tổng Quan Lớp Thực hành ',
    children: <PracticeClassOver />,
  },
];

const LessonLearnersOverview: React.FC = () => (
  <View style={styles.container}>
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  </View>
);

export default LessonLearnersOverview;
