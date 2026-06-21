'use client';

import React, { useState, useCallback } from 'react';
import {
  Layout,
  Button,
  Dropdown,
  Avatar,
  Space,
  Drawer,
  Grid,
  GetProp,
  MenuProps,
} from 'antd';
import Icon, {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  ControlOutlined,
  BookOutlined,
} from '@ant-design/icons';
import './styles.scss';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { authAction } from '~mdAuth/redux';
import { useAppSelector } from '@redux';
import SearchBar from '@components/SearchContext/SearchBar';
import { useMyCourses } from '@/hooks/useMyCourses';
import CourseItem from '@/components/CourseItem';
import LessonThumbnail from '~mdDashboard/components/LessonThumbnail';

const { Header } = Layout;
const { useBreakpoint } = Grid;
type MenuItem = GetProp<MenuProps, 'items'>[number];
const HeaderLayout: React.FC = ({}) => {
  const screens = useBreakpoint();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);

  const userProfile = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile,
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isLessonPage = pathname.startsWith('/dashboard/lesson');
  const isLibraryPage = pathname.startsWith('/dashboard/library');
  const userId = userProfile?._id || null;
  const isAdmin = userProfile?.role?.level <= 2;
  const isHomePage = pathname.startsWith('/dashboard/home');
  const isMyCoursesPage = pathname === '/dashboard/my-courses';

  const { myCourses, loadingCourses, fetchMyCourses, formatRelativeTime } =
    useMyCourses(userId);

  // Hàm điều hướng: ép đóng menu trước khi chuyển trang
  const handleNavigate = useCallback(
    (url: string) => {
      setIsCoursesDropdownOpen(false);
      router.push(url);
    },
    [router],
  );

  const handleDropdownOpenChange = (visible: boolean) => {
    if (isMyCoursesPage) return;
    setIsCoursesDropdownOpen(visible);
    if (visible) fetchMyCourses();
  };

  const renderMyCoursesDropdown = () => (
    <div className="my-courses-dropdown-panel">
      <div className="dropdown-header">
        <h3>Khóa học của tôi</h3>
        <span
          className="see-all-btn"
          onClick={() => handleNavigate('/dashboard/my-courses')}>
          Xem tất cả
        </span>
      </div>
      <div className="dropdown-body">
        {loadingCourses ? (
          <div className="loading-state">Đang tải dữ liệu...</div>
        ) : !Array.isArray(myCourses) || myCourses.length === 0 ? (
          <div className="empty-state">Bạn chưa bắt đầu khóa học nào.</div>
        ) : (
          myCourses
            .filter(course => course && course.lessonId)
            .map(course => (
              <CourseItem
                key={course.lessonId}
                course={course}
                formatRelativeTime={formatRelativeTime}
                onNavigate={handleNavigate}
              />
            ))
        )}
      </div>
    </div>
  );

  const menuItemsUser = [
    ...(isAdmin
      ? [
          {
            key: 'admin',
            label: 'Admin',
            icon: <ControlOutlined />,
            onClick: () => router.push('/dashboard/admin/'),
          },
        ]
      : []),

    {
      key: 'profile',
      label: 'Settings',
      icon: <UserOutlined />,
      onClick: () => router.push('/dashboard/profile'),
    },

    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: () => dispatch(authAction.logout()),
    },
  ];

  return (
    <>
      <Header className="app-header">
        <div className="header-container">
          {/* LEFT */}
          <div className="header-left">
            {!screens.md && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setOpen(true)}
              />
            )}

            {/* LOGO */}
            <div
              className="header-logo"
              onClick={() => router.push('/dashboard/home')}>
              <div className="header-logo-image-wrap">
                <Image
                  src="/images/LogoVhu.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className="header-logo-image"
                />
              </div>

              {screens.sm && (
                <span className="header-logo-text">LearnNest</span>
              )}
            </div>

            {/* SEARCH */}
          </div>
          <div className="header-search">
            {isLessonPage || (isLibraryPage && <SearchBar />)}
          </div>

          {/* RIGHT */}
          <Space size={16}>
            {screens.sm && (
              <Dropdown
                open={isCoursesDropdownOpen}
                trigger={['click']}
                popupRender={renderMyCoursesDropdown}
                placement="bottomRight"
                onOpenChange={handleDropdownOpenChange}>
                <Button
                  type="text"
                  className="my-courses-nav-btn"
                  disabled={isMyCoursesPage}
                  title={
                    isMyCoursesPage ? 'Bạn đang ở trang Khóa học của tôi' : ''
                  }>
                  Khóa học của tôi
                </Button>
              </Dropdown>
            )}
            <Dropdown trigger={['hover']} menu={{ items: menuItemsUser }}>
              <Avatar
                size={screens.md ? 42 : 36}
                src={userProfile?.avatar}
                icon={<UserOutlined />}
                className="header-avatar"
              />
            </Dropdown>
          </Space>
        </div>
      </Header>

      {/* MOBILE DRAWER */}
      <Drawer
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        width={260}>
        <div className="drawer-header">
          <Image
            src="/images/LogoVhu.png"
            alt="logo"
            width={40}
            height={40}
            className="drawer-logo"
          />

          <span className="drawer-title">LearnNest</span>
        </div>

        <div className="drawer-content">
          <Button block onClick={() => router.push('/dashboard/home')}>
            Home
          </Button>
          <Button
            block
            icon={<BookOutlined />}
            onClick={() => {
              setOpen(false);
              router.push('/dashboard/my-courses');
            }}>
            Khóa học của tôi
          </Button>
          <Button
            block
            onClick={() => {
              setOpen(false);
              router.push('/dashboard/profile');
            }}>
            Profile
          </Button>

          {isAdmin && (
            <>
              <Button
                block
                onClick={() => router.push('/dashboard/admin/userManage')}>
                User Manage
              </Button>

              <Button
                block
                onClick={() => router.push('/dashboard/admin/lessonManage')}>
                Lesson Manage
              </Button>
            </>
          )}

          <Button danger block onClick={() => dispatch(authAction.logout())}>
            Logout
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default HeaderLayout;
