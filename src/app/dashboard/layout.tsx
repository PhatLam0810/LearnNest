'use client';
import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  GetProp,
  Grid,
  Input,
  Layout,
  Menu,
  MenuProps,
  Space,
} from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
  BellOutlined,
  ControlOutlined,
  FilterOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './styles.css';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import Icon from '@components/icons';
import { LessonIcon } from '@/assets/svg';
import LessonSearchBar from './lesson/_components/LessonSearchBar';
import { LessonSearchProvider } from './lesson/lessonSearchContext';

const { Sider, Content, Header } = Layout;
type MenuItem = GetProp<MenuProps, 'items'>[number];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint(); // detect breakpoint
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [open, setOpen] = useState(false);
  const isAdmin = userProfile?.role?.level <= 2;

  const onClickItem = (item: string) => {
    router.replace(item);
    setOpen(false);
  };
  const isLessonPage = pathname.startsWith('/dashboard/lesson');

  const menuItems: MenuItem[] = [
    {
      key: 'Overview',
      label: 'OVERVIEW',
      type: 'group',
      children: [
        { key: '/dashboard/home', label: 'Home', icon: <Icon name="home" /> },
        { key: '/dashboard/lesson', label: 'Lesson', icon: <LessonIcon /> },
        {
          key: '/dashboard/library',
          label: 'Library',
          icon: <Icon name="library" />,
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
  const Logo = () => (
    <TouchableOpacity
      onClick={() => {
        router.push('/dashboard/home');
        setOpen(false);
      }}>
      <View style={styles.logo}>
        <View style={styles.logoMark}>
          <Text style={styles.logoMarkText}>LN</Text>
        </View>
        <Text style={styles.logoText}>LearnNest</Text>
      </View>
    </TouchableOpacity>
  );

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

  const TopBar = () => (
    <View style={styles.topbar}>
      {!screens.md && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setOpen(true)}
          style={styles.btnOpenDrawer}
        />
      )}
      <View style={styles.topbarRow}>
        <Logo />
        <View style={{ flex: 1 }}>
          {isLessonPage ? (
            <LessonSearchBar />
          ) : (
            <View style={styles.searchWrap}>
              <Input
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                suffix={
                  <Dropdown
                    trigger={['hover']}
                    menu={{
                      items: [
                        { key: 'desc', label: 'Desc' },
                        { key: 'asc', label: 'Asc' },
                      ],
                    }}>
                    <Button
                      type="text"
                      icon={<FilterOutlined style={{ fontSize: 18 }} />}
                      style={{ borderRadius: 999, color: '#475569' }}
                      aria-label="Filter search"
                    />
                  </Dropdown>
                }
                placeholder="Tìm kiếm khóa học, bài viết, video..."
                allowClear
                size="large"
                style={styles.searchInput}
              />
            </View>
          )}
        </View>
        <Space size={12} style={styles.actions}>
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={styles.iconBtn}
              aria-label="Thông báo"
            />
          </Badge>
          <Dropdown
            trigger={['hover']}
            menu={{
              expandIcon: null,
              items: [
                isAdmin
                  ? {
                      key: 'admin',
                      label: 'Admin',
                      icon: <ControlOutlined />,
                      children: [
                        {
                          key: 'admin-user',
                          label: 'User Manage',
                          onClick: () =>
                            router.push('/dashboard/admin/userManage'),
                        },
                        {
                          key: 'admin-lesson',
                          label: 'Lesson Manage',
                          onClick: () =>
                            router.push('/dashboard/admin/lessonManage'),
                        },
                      ],
                    }
                  : null,
                {
                  key: 'profile',
                  label: 'Settings',
                  icon: <UserOutlined />,
                  onClick: () => router.push('/dashboard/profile'),
                },
                {
                  type: 'divider',
                  key: 'divider-1',
                },
                {
                  key: 'logout',
                  label: 'Logout',
                  icon: <LogoutOutlined />,
                  onClick: () => dispatch(authAction.logout()),
                },
              ].filter(Boolean) as MenuProps['items'],
            }}>
            <Avatar
              src={userProfile?.avatar}
              icon={<UserOutlined />}
              style={styles.avatar}
            />
          </Dropdown>
        </Space>
      </View>
    </View>
  );

  const layout = (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Header
        style={{
          padding: 0,
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
        <TopBar />
      </Header>

      {!screens.md && (
        <Drawer
          placement="left"
          closable={false}
          open={open}
          onClose={() => setOpen(false)}
          width={280}
          styles={{ body: { padding: 0 } }}>
          {sidebarContent}
        </Drawer>
      )}

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

  if (isLessonPage) {
    return <LessonSearchProvider>{layout}</LessonSearchProvider>;
  }

  return layout;
}
