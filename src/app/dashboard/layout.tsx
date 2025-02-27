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
import { dashboardQuery } from '~mdDashboard/redux';
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

  const { data, isSuccess } = dashboardQuery.useGetListLibraryTypeQuery();
  const [menuChildren, setMenuChildren] = useState([]);

  useEffect(() => {
    if (data) {
      const listLibraryMenu = data.map(item => ({
        key: `/dashboard/library/${item._id}`,
        label: item.name,
        icon: <Icon name="library" />,
      }));

      setMenuChildren(prev => prev.concat(listLibraryMenu));
    }
  }, [isSuccess]);

  const menuItemFriend = [
    {
      key: '/dashboard/id1',
      style: styles.menuItemFriend,
      label: (
        <View style={styles.friendContainer}>
          <Text style={styles.friendTitle}>Julius Nguyen</Text>
          <Text style={styles.friendSubTitle}>Lightbridge Teacher</Text>
        </View>
      ),
      icon: <Avatar size={32} />,
    },
    {
      key: '/dashboard/id2',
      style: styles.menuItemFriend,
      label: (
        <View style={styles.friendContainer}>
          <Text style={styles.friendTitle}>Katie K.</Text>
          <Text style={styles.friendSubTitle}>Admin</Text>
        </View>
      ),
      icon: (
        <Avatar
          size={32}
          style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
        />
      ),
    },
  ];

  const menuItems: MenuItem[] = [
    {
      key: 'Overview',
      label: 'OVERVIEW',
      type: 'group',
      children: [
        { key: '/dashboard/home', label: 'Home', icon: <Icon name="home" /> },
        { key: '/dashboard/lesson', label: 'Lesson', icon: <LessonIcon /> },
        {
          key: '/dashboard',
          label: 'Library',
          icon: <Icon name="library" />,
          children: menuChildren,
        },
        {
          key: '/dashboard/save',
          label: 'Save',
          icon: <Icon name="save" />,
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
  const friendItems: MenuProps['items'] = [
    {
      key: 'Friend',
      label: 'FRIEND',
      type: 'group',
      children: [...menuItemFriend],
    },
  ];

  const settingItems: MenuItem[] = [
    {
      key: 'Setting',
      label: 'SETTING',
      type: 'group',
      children: [
        {
          key: 'sett/dashboard/setting',
          icon: <SettingOutlined />,
          label: 'Setting',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: () => dispatch(authAction.logout()),
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
          {/* <Image
            src={LogoIcon}
            style={{ width: '80%', aspectRatio: 16 / 9, alignSelf: 'center' }}
            alt=""
          /> */}

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
            <Menu
              mode="inline"
              style={{
                backgroundColor: 'transparent',
                borderInlineEnd: 0,
              }}
              selectedKeys={[pathname]}
              items={friendItems}
              onClick={item => {
                router.replace(item.key);
              }}
            />
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
