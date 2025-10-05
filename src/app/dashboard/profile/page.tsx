'use client';
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { View } from 'react-native-web';
import styles from './styles';
import { ChangePassword, EditProfile, TransactionHistory } from './components';
import './styles.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResponsive } from '@/styles/responsive'; // 🟢 import thêm hook responsive

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile, isTablet } = useResponsive();
  const tab = searchParams.get('tab') || '1'; // Lấy `tab` từ URL, mặc định là '1'

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

  return (
    <View
      style={
        isMobile
          ? styles.containerMobile
          : isTablet
            ? styles.containerTablet
            : styles.containerDesktop
      }>
      <Tabs
        defaultActiveKey={tab}
        items={items}
        tabPosition={isMobile || isTablet ? 'top' : 'left'}
        tabBarStyle={{
          fontSize: isMobile ? 13 : isTablet ? 14 : 16,
          textAlign: 'center',
        }}
      />
    </View>
  );
};

export default ProfilePage;
