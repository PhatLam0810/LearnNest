'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, GetProp, Layout, Menu, MenuProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
  ControlOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './styles.css';
import LogoIcon from '../../assets/svg/LogoICon.svg';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import Icon from '@components/icons';
import { LessonIcon } from '@/assets/svg';

const { Sider, Content } = Layout;
type MenuItem = GetProp<MenuProps, 'items'>[number];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  const menuItems: MenuItem[] = [
    {
      key: 'Overview',
      label: 'OVERVIEW',
      type: 'group',
      children: [
        { key: '/dashboard/home', label: 'Home', icon: <Icon name="home" /> },
        { key: '/dashboard/lesson', label: 'Lesson', icon: <LessonIcon /> },
        {
          key: '/dashboard/library/0',
          label: 'Library',
          icon: <Icon name="library" />,
        },
      ],
    },
  ];

  const adminItems: MenuItem[] = [
    {
      key: 'Admin',
      label: 'ADMIN',
      type: 'group',
      children: [
        {
          key: '/dashboard/admin',
          label: 'Admin',
          icon: <ControlOutlined />,
          children: [
            { key: '/dashboard/admin/userManage', label: 'User Manage' },
            { key: '/dashboard/admin/lessonManage', label: 'Lesson Manage' },
          ],
        },
      ],
    },
  ];

  const settingItems: MenuItem[] = [
    {
      key: 'Setting',
      label: 'SETTING',
      type: 'group',
      children: [
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: () => {
            dispatch(authAction.logout());
          },
        },
      ],
    },
  ];
  return (
    <Layout
      hasSider
      style={{ height: '100vh', width: '100vw', backgroundColor: 'white ' }}>
      {/* Sidebar */}
      <Sider theme="light" style={styles.sider} width={240}>
        <View style={{ height: '100%' }}>
          <TouchableOpacity>
            <View
              style={{ alignItems: 'center', marginBottom: 20 }}
              onClick={() => {
                router.push('/dashboard/profile/editProfile');
              }}>
              <Avatar
                src={userProfile?.avatar}
                size={100}
                style={{ borderWidth: 2, borderColor: '#FFA726' }}
              />
              <Text style={styles.username}>
                {userProfile?.firstName + ' ' + userProfile?.lastName}
              </Text>
              <Text style={styles.role}>{userProfile?.role?.name}</Text>
            </View>
          </TouchableOpacity>
          <ScrollView
            style={{ scrollbarWidth: 'none' }}
            contentContainerStyle={{ minHeight: '100%' }}>
            <Menu
              style={{
                backgroundColor: 'transparent',
                borderInlineEnd: 0,
              }}
              selectedKeys={[pathname]}
              items={menuItems}
              onClick={item => {
                router.replace(item.key);
              }}
            />
            {userProfile?.role?.level <= 2 && (
              <Menu
                style={{
                  backgroundColor: 'transparent',
                  borderInlineEnd: 0,
                }}
                selectedKeys={[pathname]}
                items={adminItems}
                onClick={item => {
                  router.replace(item.key);
                }}
              />
            )}
          </ScrollView>
          <Menu
            mode="inline"
            style={{
              backgroundColor: 'transparent',
              borderInlineEnd: 0,
            }}
            selectedKeys={[pathname]}
            items={settingItems}
            onClick={item => {
              router.replace(item.key);
            }}
          />
        </View>
      </Sider>
      <Content style={{ backgroundColor: 'white' }}>
        <View style={{ flex: 1, maxHeight: '100vh', height: '100%' }}>
          {children}
        </View>
      </Content>
    </Layout>
  );
}
