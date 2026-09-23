'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Layout,
  Button,
  Dropdown,
  Space,
  Drawer,
  Grid,
  GetProp,
  MenuProps,
  Badge,
  Empty,
} from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  ControlOutlined,
  BookOutlined,
  BellOutlined,
  FileTextOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  BarChartOutlined,
  CarryOutOutlined,
} from '@components/AppIcon';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './styles.scss';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { authAction } from '~mdAuth/redux';
import { useAppSelector } from '@redux';
import UserAvatar from '@components/UserAvatar';
import { asButton } from '@/utils/asButton';
import SearchBar from '@components/SearchContext/SearchBar';
import { formatRelativeTime } from '@/utils/time';
import CourseItem from '@/components/CourseItem';
import LessonThumbnail from '~mdDashboard/components/LessonThumbnail';
import { useSocket } from '@hooks/useSocket';
import { dashboardQuery } from '~mdDashboard/redux';
import { NotificationItem } from '~mdDashboard/redux/RTKQuery/types';

dayjs.extend(relativeTime);

const { Header } = Layout;
const { useBreakpoint } = Grid;
type MenuItem = GetProp<MenuProps, 'items'>[number];
// Màu chấm "chưa đọc" theo loại thông báo (token, không hex).
const NOTIF_DOT_COLOR: Record<string, string> = {
  COMMENT_REPLY: 'var(--color-vhu-primary)',
  NEW_QUESTION: 'var(--color-vhu-primary)',
  FEEDBACK_REPLIED: 'var(--color-vhu-primary)',
  NEW_COURSE: 'var(--color-success)',
  COURSE_COMPLETED: 'var(--color-success)',
  STUDY_REMINDER: 'var(--color-warning)',
  RETRY_REMINDER: 'var(--color-warning)',
  VIOLATION_REPORT: 'var(--color-error)',
};

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

  const {
    data: myCourses,
    isFetching: loadingCourses,
    refetch: fetchMyCourses,
  } = dashboardQuery.useGetMyCoursesQuery(userId || '', { skip: !userId });

  const socket = useSocket();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  // Chuông chỉ hiện tối đa 10 thông báo mới nhất - xem đầy đủ (mọi thông báo,
  // phân trang) thì qua trang riêng /dashboard/notifications (nút "Xem tất
  // cả" bên dưới), không tải thêm ngay trong dropdown nữa.
  const { data: notifData, refetch: refetchNotifications } =
    dashboardQuery.useGetNotificationsQuery({ limit: 10 }, { skip: !userId });
  const [markNotificationRead] =
    dashboardQuery.useMarkNotificationReadMutation();
  const [markAllNotificationsRead] =
    dashboardQuery.useMarkAllNotificationsReadMutation();
  const notifItems = notifData?.items || [];
  const unreadCount = notifData?.unreadCount || 0;

  useEffect(() => {
    if (!userId) return;
    const handleNewNotification = () => refetchNotifications();
    socket.on('NewNotification', handleNewNotification);
    return () => {
      socket.off('NewNotification', handleNewNotification);
    };
  }, [socket, userId, refetchNotifications]);

  const handleNavigate = useCallback(
    (url: string) => {
      setIsCoursesDropdownOpen(false);
      router.push(url);
    },
    [router],
  );

  const handleNotificationClick = useCallback(
    async (item: NotificationItem) => {
      setIsNotifOpen(false);
      if (!item.isRead) {
        try {
          await markNotificationRead(item._id).unwrap();
        } catch {}
      }
      if (item.link) router.push(item.link);
    },
    [markNotificationRead, router],
  );

  const handleMarkAllRead = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await markAllNotificationsRead().unwrap();
      } catch {}
    },
    [markAllNotificationsRead],
  );

  const handleSeeAllNotifications = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsNotifOpen(false);
      router.push('/dashboard/notifications');
    },
    [router],
  );

  const renderNotificationDropdown = () => (
    <div className="notification-dropdown-panel">
      <div className="dropdown-header">
        <h3>Thông báo</h3>
        {unreadCount > 0 && (
          <span className="see-all-btn" onClick={handleMarkAllRead}>
            Đánh dấu tất cả đã đọc
          </span>
        )}
      </div>
      <div className="dropdown-body">
        {notifItems.length === 0 ? (
          <div className="notification-empty">Không có thông báo mới.</div>
        ) : (
          notifItems.map(item => (
            <div
              key={item._id}
              className={`notification-item${item.isRead ? '' : ' unread'}`}
              onClick={() => handleNotificationClick(item)}>
              <span
                className="notification-dot"
                aria-hidden="true"
                style={{
                  visibility: item.isRead ? 'hidden' : 'visible',
                  backgroundColor:
                    NOTIF_DOT_COLOR[item.type] ?? 'var(--color-vhu-primary)',
                }}
              />
              <div className="notification-text">
                <div className="notification-title">
                  {item.isRead ? (
                    ''
                  ) : (
                    <span className="sr-only">Chưa đọc: </span>
                  )}
                  {item.title}
                </div>
                {item.body && (
                  <div className="notification-body">{item.body}</div>
                )}
                <div className="notification-time">
                  {dayjs(item.createdAt).fromNow()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {!!notifItems.length && (
        <div
          className="notification-see-all"
          onClick={handleSeeAllNotifications}>
          Xem tất cả
        </div>
      )}
    </div>
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
      : [
          {
            key: 'my-notes',
            label: 'Ghi chú của tôi',
            icon: <FileTextOutlined />,
            onClick: () => router.push('/dashboard/my-notes'),
          },
          {
            key: 'saved',
            label: 'Đã lưu',
            icon: <StarOutlined />,
            onClick: () => router.push('/dashboard/saved'),
          },
          {
            key: 'my-qa',
            label: 'Hỏi đáp của tôi',
            icon: <QuestionCircleOutlined />,
            onClick: () => router.push('/dashboard/my-qa'),
          },
          {
            key: 'my-assignments',
            label: 'Bài được giao',
            icon: <CarryOutOutlined />,
            onClick: () => router.push('/dashboard/my-assignments'),
          },
          {
            key: 'achievements',
            label: 'Thành tích',
            icon: <TrophyOutlined />,
            onClick: () => router.push('/dashboard/achievements'),
          },
          {
            key: 'leaderboard',
            label: 'Xếp hạng',
            icon: <BarChartOutlined />,
            onClick: () => router.push('/dashboard/leaderboard'),
          },
        ]),

    {
      key: 'profile',
      label: 'Cài đặt',
      icon: <UserOutlined />,
      onClick: () => router.push('/dashboard/profile'),
    },

    {
      key: 'logout',
      label: 'Đăng xuất',
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
              {...asButton(
                () => router.push('/dashboard/home'),
                'Về trang chủ',
              )}
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
            {(isLessonPage || isLibraryPage) && <SearchBar />}
          </div>

          {/* RIGHT */}
          <Space size={16}>
            {screens.sm && !isAdmin && (
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
            {userId && (
              <Dropdown
                open={isNotifOpen}
                trigger={['click']}
                popupRender={renderNotificationDropdown}
                placement="bottomRight"
                onOpenChange={setIsNotifOpen}>
                <Badge dot={unreadCount > 0} offset={[-6, 6]}>
                  <Button
                    type="text"
                    style={{ display: 'flex' }}
                    icon={<BellOutlined style={{ fontSize: 24 }} />}
                    className="notification-bell-btn"
                  />
                </Badge>
              </Dropdown>
            )}
            <Dropdown
              trigger={['hover', 'click']}
              menu={{ items: menuItemsUser }}>
              {/* Nút thật để Tab focus được và Enter/Space mở menu. */}
              <button
                type="button"
                aria-label="Menu tài khoản"
                aria-haspopup="menu"
                style={{
                  display: 'flex',
                  padding: 0,
                  border: 0,
                  borderRadius: '50%',
                  background: 'none',
                  cursor: 'pointer',
                }}>
                <UserAvatar
                  size={screens.md ? 42 : 36}
                  avatar={userProfile?.avatar}
                  fullName={userProfile?.fullName}
                  seed={userProfile?._id}
                  className="header-avatar"
                />
              </button>
            </Dropdown>
          </Space>
        </div>
      </Header>

      {/* MOBILE DRAWER */}
      <Drawer
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        width={260}
        styles={{ body: { padding: 0 } }}>
        {/* .ant-drawer-body mặc định padding 24px, cộng dồn với padding
            riêng của .drawer-header (20px) / .drawer-content (16px) bên
            dưới -> lề đôi. Bỏ padding mặc định, để 2 khối tự kiểm soát. */}
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
            Trang Chủ
          </Button>
          <Button
            block
            onClick={() => {
              setOpen(false);
              router.push('/dashboard/lesson');
            }}>
            Khóa Học
          </Button>
          <Button
            block
            onClick={() => {
              setOpen(false);
              router.push('/dashboard/library');
            }}>
            Thư Viện
          </Button>
          <Button
            block
            onClick={() => {
              setOpen(false);
              router.push('/dashboard/my-roadmap');
            }}>
            Lộ Trình AI
          </Button>
          <Button
            block
            onClick={() => {
              setOpen(false);
              router.push('/dashboard/practice');
            }}>
            Thực Hành MOS
          </Button>
          {!isAdmin && (
            <Button
              block
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/my-courses');
              }}>
              Khóa học của tôi
            </Button>
          )}
          {!isAdmin && (
            <Button
              block
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/my-notes');
              }}>
              Ghi chú của tôi
            </Button>
          )}
          {!isAdmin && (
            <Button
              block
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/saved');
              }}>
              Đã lưu
            </Button>
          )}
          {!isAdmin && (
            <Button
              block
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/my-qa');
              }}>
              Hỏi đáp của tôi
            </Button>
          )}
          {!isAdmin && (
            <Button
              block
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/my-assignments');
              }}>
              Bài được giao
            </Button>
          )}
          {!isAdmin && (
            <Button
              block
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/achievements');
              }}>
              Thành tích
            </Button>
          )}
          {!isAdmin && (
            <Button
              block
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/leaderboard');
              }}>
              Xếp hạng
            </Button>
          )}
          {!isAdmin && (
            <Button
              block
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/mock-exam/history');
              }}>
              Lịch sử thi thử
            </Button>
          )}
          <Button
            block
            onClick={() => {
              setOpen(false);
              router.push('/dashboard/profile');
            }}>
            Cài Đặt
          </Button>

          {isAdmin && (
            <>
              <Button
                block
                onClick={() => router.push('/dashboard/admin/userManage')}>
                Quản lí người học
              </Button>

              <Button
                block
                onClick={() => router.push('/dashboard/admin/lessonManage')}>
                Quản lí khóa học
              </Button>

              <Button
                block
                onClick={() => router.push('/dashboard/admin/feedbackManage')}>
                Phản hồi người dùng
              </Button>
            </>
          )}

          <Button danger block onClick={() => dispatch(authAction.logout())}>
            Đăng xuất
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default HeaderLayout;
