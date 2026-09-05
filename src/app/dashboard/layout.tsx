'use client';
import React, { useEffect } from 'react';
import { GetProp, Grid, Layout, Menu, MenuProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
  ControlOutlined,
  FileTextOutlined,
  IdcardOutlined,
  LogoutOutlined,
  RocketOutlined,
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
          // Hub luyện tập MOS đứng riêng — chỉ để duyệt/làm bài thực hành
          // không gắn với 1 khóa video cụ thể nào. Bài thực hành nằm TRONG
          // 1 khóa video (nội dung trộn) thì làm ngay tại moduleDetail của
          // khóa đó, không dùng khu vực này.
          key: '/dashboard/practice',
          label: 'Luyện Tập',
          icon: <FileTextOutlined />,
        },
        ...(!isAdmin
          ? [
              {
                key: '/dashboard/my-courses',
                label: 'Tổng Quan',
                icon: <IdcardOutlined />,
              },
              {
                key: '/dashboard/my-roadmap',
                label: 'Lộ Trình AI',
                icon: <RocketOutlined />,
              },
            ]
          : []),
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
            collapsed={false}
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
