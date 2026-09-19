'use client';
import React, { useState } from 'react';
import { View } from 'react-native-web';
import styles from './styles';
import {
  ModuleManage,
  LessonManage,
  LibraryManage,
  PracticeLessonManage,
} from './_components';
import PracticeManage from '../practiceManage';
import { ContentTabStrip, ContentTab } from '~mdAdmin/components';
// Vẫn cần cho các tab CHƯA chuyển sang ThemedTable (giữ header bảng xanh
// brand + nút search trắng-trên-xanh qua CSS toàn cục theo route này) - bỏ
// import này khi mọi tab đã dùng ThemedTable/ContentToolbar.
import './styles.scss';

const tabs: ContentTab[] = [
  { key: '1', label: 'Khóa học' },
  { key: '2', label: 'Phần học' },
  { key: '4', label: 'Bài học' },
  { key: '5', label: 'Bài thực hành' },
  { key: '6', label: 'Phần thực hành' },
];

const tabContent: Record<string, React.ReactNode> = {
  '1': <LessonManage />,
  '2': <ModuleManage />,
  '4': <LibraryManage />,
  '5': <PracticeManage />,
  '6': <PracticeLessonManage />,
};

const LessonAdmin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1');

  return (
    <View style={styles.container}>
      <ContentTabStrip
        tabs={tabs}
        activeKey={activeKey}
        onChange={setActiveKey}
      />
      <View style={styles.tabBody}>{tabContent[activeKey]}</View>
    </View>
  );
};

export default LessonAdmin;
