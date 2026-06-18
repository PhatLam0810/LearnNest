'use client';
import React from 'react';
import { GetProp, Grid, Layout, Menu, MenuProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
  ControlOutlined,
  IdcardOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './styles.css';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import { ScrollView, View } from 'react-native-web';
import styles from './styles';
import Icon from '@components/icons';
import { LessonIcon } from '@/assets/svg';
import HeaderLayout from '@components/HeaderLayout';
import { SearchProvider } from '@components/SearchContext';

const { Sider, Content } = Layout;
type MenuItem = GetProp<MenuProps, 'items'>[number];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const dispatch = useAppDispatch();
  const onClickItem = (item: string) => {
    router.replace(item);
  };
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const isAdmin = userProfile?.role?.level <= 2;

  const menuItems: MenuItem[] = [
    {
      key: 'Overview',
      label: 'OVERVIEW',
      type: 'group',
      children: [
        {
          key: '/dashboard/home',
          label: 'Trang Chủ',

          icon: (
            <Icon
              name="home"
              color={pathname === '/dashboard/home' ? 'white' : 'black'}
            />
          ),
        },
        {
          key: '/dashboard/lesson',
          label: 'Khóa Học',
          icon: (
            <LessonIcon
              color={pathname === '/dashboard/lesson' ? 'white' : 'black'}
            />
          ),
        },
        {
          key: '/dashboard/library',
          label: 'Thư Viện',
          icon: (
            <Icon
              name="library"
              color={pathname === '/dashboard/library' ? 'white' : 'black'}
            />
          ),
        },
        {
          key: '/dashboard/',
          label: 'Tổng Quan',
          icon: <IdcardOutlined />,
        },
        {
          key: '/dashboard/profile',
          label: 'Cài Đặt',
          icon: <SettingOutlined />,
        },
        ...(isAdmin
          ? [
              {
                key: '/dashboard/admin',
                label: 'Admin',
                icon: <ControlOutlined />,
              },
            ]
          : []),
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

  const sidebarContent = (
    <View style={styles.sider}>
      <ScrollView
        style={{ scrollbarWidth: 'none', flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 12,
          width: '100%',
          height: '100%',
          scrollbarWidth: 'none',
        }}>
        <Menu
          mode="inline"
          style={styles.menu}
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={item => {
            onClickItem(item.key);
          }}
        />
      </ScrollView>
      <Menu
        mode="inline"
        style={styles.menu}
        selectedKeys={[pathname]}
        items={settingItems}
        onClick={item => {
          onClickItem(item.key);
        }}
      />
    </View>
  );

  const layout = (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <HeaderLayout />

      <Layout style={{ backgroundColor: '#f5f7fb' }}>
        {screens.md && (
          <Sider
            theme="light"
            width={110}
            collapsed={false}
            style={styles.antSider}>
            {sidebarContent}
          </Sider>
        )}
        <Content style={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );

  return <SearchProvider>{layout}</SearchProvider>;
}
