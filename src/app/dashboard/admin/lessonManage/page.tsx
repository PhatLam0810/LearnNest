'use client';
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { View } from 'react-native-web';
import styles from './styles';
import {
  ModuleManage,
  SubLessonManage,
  LessonManage,
  LibraryManage,
} from './_components';
import './styles.css';

const onChange = (key: string) => {};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Lesson',
    children: <LessonManage />,
  },
  {
    key: '2',
    label: 'Module',
    children: <ModuleManage />,
  },
  {
    key: '4',
    label: 'Library',
    children: <LibraryManage />,
  },
];

const Lesson: React.FC = () => (
  <View style={styles.container}>
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  </View>
);

export default Lesson;
