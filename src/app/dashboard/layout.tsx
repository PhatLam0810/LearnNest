'use client';
import React, { useEffect, useState } from 'react';
import { GetProp, Grid, Layout, Menu, MenuProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpenOutlined,
  ControlOutlined,
  FileTextOutlined,
  HomeOutlined,
  IdcardOutlined,
  LeftOutlined,
  LibraryOutlined,
  RightOutlined,
  RocketOutlined,
} from '@components/AppIcon';
import './styles.css';
import { useAppSelector } from '@redux';
import { ScrollView, Text, View } from 'react-native-web';
import styles from './styles';
import HeaderLayout from '@components/HeaderLayout';
import { SearchProvider } from '@components/SearchContext';
import { asButton } from '@/utils/asButton';

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
  const [collapsed, setCollapsed] = useState(false);

  const onClickItem = (item: string) => {
    router.replace(item);
  };
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const isAdmin = userProfile?.role?.level <= 2;

  // Trước đây các trang /dashboard/admin/* chỉ ẩn link trong menu chứ không
  // chặn truy cập trực tiếp bằng URL - học viên thường gõ thẳng link vẫn
  // vào được (dữ liệu rỗng vì BE từ chối, nhưng khung trang admin vẫn hiện
  // ra). Chờ userProfile tải xong (tránh đá nhầm admin thật lúc mới load
  // trang) rồi mới quyết định chặn.
  const isBlockedAdminRoute =
    pathname.startsWith('/dashboard/admin') && !!userProfile && !isAdmin;

  useEffect(() => {
    if (isBlockedAdminRoute) {
      router.replace('/dashboard/home');
    }
  }, [isBlockedAdminRoute, router]);

  const isHomeSelected = pathname === '/dashboard/home';
  const isLessonSelected = pathname === '/dashboard/lesson';
  const isLibrarySelected = pathname === '/dashboard/library';
  const isPracticeSelected = pathname.startsWith('/dashboard/practice');
  const isMyCoursesSelected = pathname === '/dashboard/my-courses';
  const isMyRoadmapSelected = pathname === '/dashboard/my-roadmap';
  const isAdminSelected = pathname.startsWith('/dashboard/admin');

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
            <HomeOutlined
              size={20}
              hoverMorph={false}
              color={isHomeSelected ? '#ffffff' : 'inherit'}
              activeColor={isHomeSelected ? '#ffffff' : 'inherit'}
              hoverColor={isHomeSelected ? '#ffffff' : 'inherit'}
            />
          ),
        },
        {
          key: '/dashboard/lesson',
          label: 'Khóa Học',
          icon: (
            <BookOpenOutlined
              size={20}
              hoverMorph={false}
              color={isLessonSelected ? '#ffffff' : 'inherit'}
              activeColor={isLessonSelected ? '#ffffff' : 'inherit'}
              hoverColor={isLessonSelected ? '#ffffff' : 'inherit'}
            />
          ),
        },
        {
          key: '/dashboard/library',
          label: 'Thư Viện',
          icon: (
            <LibraryOutlined
              size={20}
              hoverMorph={false}
              color={isLibrarySelected ? '#ffffff' : 'inherit'}
              activeColor={isLibrarySelected ? '#ffffff' : 'inherit'}
              hoverColor={isLibrarySelected ? '#ffffff' : 'inherit'}
            />
          ),
        },
        {
          key: '/dashboard/practice',
          label: 'Luyện Tập',
          icon: (
            <FileTextOutlined
              size={20}
              hoverMorph={false}
              color={isPracticeSelected ? '#ffffff' : 'inherit'}
              activeColor={isPracticeSelected ? '#ffffff' : 'inherit'}
              hoverColor={isPracticeSelected ? '#ffffff' : 'inherit'}
            />
          ),
        },
        ...(!isAdmin
          ? [
              {
                key: '/dashboard/my-courses',
                label: 'Tổng Quan',
                icon: (
                  <IdcardOutlined
                    size={20}
                    hoverMorph={false}
                    color={isMyCoursesSelected ? '#ffffff' : 'inherit'}
                    activeColor={isMyCoursesSelected ? '#ffffff' : 'inherit'}
                    hoverColor={isMyCoursesSelected ? '#ffffff' : 'inherit'}
                  />
                ),
              },
              {
                key: '/dashboard/my-roadmap',
                label: 'Lộ Trình AI',
                icon: (
                  <RocketOutlined
                    size={20}
                    hoverMorph={false}
                    color={isMyRoadmapSelected ? '#ffffff' : 'inherit'}
                    activeColor={isMyRoadmapSelected ? '#ffffff' : 'inherit'}
                    hoverColor={isMyRoadmapSelected ? '#ffffff' : 'inherit'}
                  />
                ),
              },
            ]
          : [
              {
                key: '/dashboard/admin',
                label: 'Quản Trị',
                icon: (
                  <ControlOutlined
                    size={20}
                    hoverMorph={false}
                    color={isAdminSelected ? '#ffffff' : 'inherit'}
                    activeColor={isAdminSelected ? '#ffffff' : 'inherit'}
                    hoverColor={isAdminSelected ? '#ffffff' : 'inherit'}
                  />
                ),
              },
            ]),
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
          scrollbarWidth: 'none',
        }}>
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          style={styles.menu}
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={item => {
            onClickItem(item.key);
          }}
        />
      </ScrollView>

      {/* Nút thu gọn / mở rộng Sidebar */}
      <View
        style={styles.collapseToggleBtn}
        {...asButton(
          () => setCollapsed(!collapsed),
          collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng',
        )}
        onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? (
          <RightOutlined
            size={18}
            hoverMorph={false}
            color="var(--color-text-muted)"
            hoverColor="var(--color-vhu-primary)"
          />
        ) : (
          <>
            <LeftOutlined
              size={18}
              hoverMorph={false}
              color="var(--color-text-muted)"
              hoverColor="var(--color-vhu-primary)"
            />
            <Text style={styles.collapseToggleText}>Thu gọn</Text>
          </>
        )}
      </View>
    </View>
  );

  const layout = (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <HeaderLayout />

      <Layout style={{ backgroundColor: '#f5f7fb' }}>
        {screens.md && (
          <Sider
            theme="light"
            width={130}
            collapsedWidth={68}
            collapsible
            trigger={null}
            collapsed={collapsed}
            onCollapse={value => setCollapsed(value)}
            style={styles.antSider}>
            {sidebarContent}
          </Sider>
        )}
        <Content style={styles.content}>
          {isBlockedAdminRoute ? null : children}
        </Content>
      </Layout>
    </Layout>
  );

  return <SearchProvider>{layout}</SearchProvider>;
}
