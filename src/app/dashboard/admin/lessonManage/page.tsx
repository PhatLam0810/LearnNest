'use client';
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { View } from 'react-native-web';
import styles from './styles';
import { ModuleManage, LessonManage, LibraryManage } from './_components';
import './styles.scss';
const onChange = (key: string) => {};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Khóa học',
    children: <LessonManage />,
  },
  {
    key: '2',
    label: 'Phần học',
    children: <ModuleManage />,
  },
  {
    key: '4',
    label: 'Bài học',
    children: <LibraryManage />,
  },
];

const LessonAdmin: React.FC = () => (
  <View style={styles.container}>
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  </View>
);

export default LessonAdmin;
