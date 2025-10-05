'use client';
import React, { useState, useEffect } from 'react';
import { Avatar, GetProp, Layout, Menu, MenuProps, Button, Drawer } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
  ControlOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import './styles.css';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import Icon from '@components/icons';
import { LessonIcon } from '@/assets/svg';
import { useResponsive } from '@/styles/responsive';
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
  const { isTablet, isMobile } = useResponsive();
  const [collapsed, setCollapsed] = useState(true);
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

  const renderSidebar = () => (
    <View style={{ height: '100%' }}>
      <TouchableOpacity>
        <View
          style={{ alignItems: 'center', marginBottom: 20 }}
          onClick={() => {
            router.push('/dashboard/profile');
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
            setCollapsed(true);
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
              setCollapsed(true);
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
          setCollapsed(true);
        }}
      />
    </View>
  );

  return (
    <Layout
      hasSider
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'white',
        overflow: 'hidden',
      }}>
      {!isTablet && !isMobile && (
        <Sider theme="light" style={styles.sider} width={240}>
          {renderSidebar()}
        </Sider>
      )}

      {(isTablet || isMobile) && (
        <>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 24 }} />}
            onClick={() => setCollapsed(false)}
            style={{
              position: 'fixed',
              top: 30,
              left: 16,
              zIndex: 1000,
            }}
          />

          <Drawer
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Menu</span>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setCollapsed(true)}
                />
              </div>
            }
            placement="left"
            closable={false}
            open={!collapsed}
            width={240}
            bodyStyle={{ padding: 0 }}>
            {renderSidebar()}
          </Drawer>
        </>
      )}

      <Content
        style={{
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flex: 1,
            maxHeight: '100vh',
            height: '100%',
            paddingLeft: isMobile || isTablet ? 56 : 0,
          }}>
          {children}
        </View>
      </Content>
    </Layout>
  );
}
