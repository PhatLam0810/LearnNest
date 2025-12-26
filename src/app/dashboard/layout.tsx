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
import { useResponsive } from '@/styles/responsive';
import { ConnectButton } from '@mysten/dapp-kit';

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

  // Responsive hook
  const { isMobile, isTablet } = useResponsive();

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
  const Logo = () => {
    const logoStyle = {
      ...styles.logo,
      gap: isMobile ? 8 : 10,
      paddingVertical: isMobile ? 8 : 12,
      paddingHorizontal: isMobile ? 8 : 10,
    };

    const logoMarkStyle = {
      ...styles.logoMark,
      width: isMobile ? 36 : 44,
      height: isMobile ? 36 : 44,
      borderRadius: isMobile ? 8 : 12,
    };

    const logoMarkTextStyle = {
      ...styles.logoMarkText,
      fontSize: isMobile ? 14 : 16,
    };

    const logoTextStyle = {
      ...styles.logoText,
      fontSize: isMobile ? 14 : 16,
      display: isMobile ? 'none' : 'flex', // Hide text on mobile
    };

    return (
      <TouchableOpacity
        onClick={() => {
          router.push('/dashboard/home');
          setOpen(false);
        }}>
        <View style={logoStyle}>
          <View style={logoMarkStyle}>
            <Text style={logoMarkTextStyle}>LN</Text>
          </View>
          <Text style={logoTextStyle}>LearnNest</Text>
        </View>
      </TouchableOpacity>
    );
  };

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

  const TopBar = () => {
    // Responsive topbar styles
    const topbarStyle = {
      ...styles.topbar,
      paddingHorizontal: isMobile ? 12 : isTablet ? 16 : 24,
      minHeight: isMobile ? 56 : 64,
    };

    const topbarRowStyle = {
      ...styles.topbarRow,
      gap: isMobile ? 8 : isTablet ? 16 : 24,
    };

    const searchWrapStyle = {
      ...styles.searchWrap,
      maxWidth: isMobile ? '100%' : isTablet ? 400 : 540,
    };

    const searchInputStyle = {
      ...styles.searchInput,
      height: isMobile ? 36 : 40,
      paddingHorizontal: isMobile ? 10 : 12,
      fontSize: isMobile ? 14 : 16,
    };

    const actionsStyle = {
      ...styles.actions,
      gap: isMobile ? 8 : isTablet ? 12 : 16,
    };

    const iconBtnStyle = {
      ...styles.iconBtn,
      fontSize: isMobile ? 18 : 20,
      padding: isMobile ? 4 : 8,
    };

    const avatarStyle = {
      ...styles.avatar,
      width: isMobile ? 32 : 40,
      height: isMobile ? 32 : 40,
    };

    return (
      <View style={topbarStyle}>
        {!screens.md && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: isMobile ? 18 : 20 }} />}
            onClick={() => setOpen(true)}
            style={{
              ...styles.btnOpenDrawer,
              padding: isMobile ? 4 : 8,
            }}
          />
        )}
        <View style={topbarRowStyle}>
          <Logo />
          <View style={{ flex: 1, minWidth: 0 }}>
            {isLessonPage ? (
              <LessonSearchBar />
            ) : (
              <View style={searchWrapStyle}>
                <Input
                  prefix={
                    <SearchOutlined
                      style={{
                        color: '#94a3b8',
                        fontSize: isMobile ? 16 : 18,
                      }}
                    />
                  }
                  suffix={
                    !isMobile && (
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
                    )
                  }
                  placeholder={'Search'}
                  allowClear
                  size={isMobile ? 'middle' : 'large'}
                  style={searchInputStyle}
                />
              </View>
            )}
          </View>
          <Space size={isMobile ? 8 : 12} style={actionsStyle}>
            <ConnectButton />
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={iconBtnStyle}
                aria-label="Thông báo"
              />
            </Badge>
            <Dropdown
              trigger={['hover', 'click']}
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
                style={avatarStyle}
              />
            </Dropdown>
          </Space>
        </View>
      </View>
    );
  };

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
