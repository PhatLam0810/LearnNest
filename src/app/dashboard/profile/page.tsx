'use client';
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { View } from 'react-native-web';
import styles from './styles';
import { ChangePassword, EditProfile, TransactionHistory } from './components';
import './styles.css';
import { useRouter, useSearchParams } from 'next/navigation';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Profile',
    children: <EditProfile />,
  },
  {
    key: '2',
    label: 'Transaction History',
    children: <TransactionHistory />,
  },
  {
    key: '3',
    label: 'Change Password ',
    children: <ChangePassword />,
  },
];

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || '1'; // Lấy `tab` từ URL, mặc định là '1'
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Profile</h1>
      </View>
      <Tabs
        aria-label="Profile settings tabs"
        defaultActiveKey={tab}
        items={items}
      />
    </View>
  );
};

export default ProfilePage;
