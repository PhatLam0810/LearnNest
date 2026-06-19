'use client';
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { View } from 'react-native-web';
import styles from './styles';
import './styles.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import UserManage from './userManage/page';
import ImportUserManage from './userManage/components/ImportUserManage';
import LessonAdmin from './lessonManage/page';
import LessonLearnersOverview from './lessonLearnersOverview';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Quản Trị Người Dùng',
    children: <UserManage />,
  },
  {
    key: '2',
    label: 'Tạo Người Dùng',
    children: <ImportUserManage />,
  },
  {
    key: '3',
    label: 'Tạo Khóa Học',
    children: <LessonAdmin />,
  },
  {
    key: '4',
    label: 'Tổng Quan Người Học',
    children: <LessonLearnersOverview />,
  },
];

const AdminPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || '1'; // Lấy `tab` từ URL, mặc định là '1'
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <h1 style={styles.pageTitle}>Quản Trị Hệ Thống</h1>
      </View>
      <Tabs defaultActiveKey={tab} items={items} />
    </View>
  );
};

export default AdminPage;
