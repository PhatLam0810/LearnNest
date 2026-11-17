'use client';
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { View } from 'react-native-web';
import AdminGuide from '~mdAdmin/components/AdminGuide';
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
    <AdminGuide
      title="xem tổng quan người học"
      steps={[
        'Tab "Tổng Quan Khóa học": chọn khóa để xem tiến độ từng học viên và nhắc học viên chưa học hoặc chưa đạt.',
        'Tab "Tổng Quan Lớp Thực hành": xem tiến độ theo lớp thực hành.',
        'Bấm vào một học viên để mở hồ sơ học tập chi tiết.',
      ]}
    />
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  </View>
);

export default LessonLearnersOverview;
