import React, { useState } from 'react';
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
} from '@ant-design/icons';
import './styles.scss';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { authAction } from '~mdAuth/redux';
import { useAppSelector } from '@redux';
import { usePathname, useRouter } from 'next/navigation';
import SearchBar from '@components/SearchContext/SearchBar';
const { Header } = Layout;
const { useBreakpoint } = Grid;
type MenuItem = GetProp<MenuProps, 'items'>[number];
const HeaderLayout: React.FC = ({}) => {
  const screens = useBreakpoint();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const userProfile = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile,
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isHomePage = pathname.startsWith('/dashboard/home');
  const isAdmin = userProfile?.role?.level <= 2;
  const menuItemsUser: MenuItem[] = [
    ...(isAdmin
      ? [
          {
            key: 'admin',
            label: 'Admin',
            icon: <ControlOutlined />,
            children: [
              {
                key: 'admin-user',
                label: 'User Manage',
                onClick: () => router.push('/dashboard/admin/userManage'),
              },
              {
                key: 'admin-lesson',
                label: 'Lesson Manage',
                onClick: () => router.push('/dashboard/admin/lessonManage'),
              },
            ],
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
          <div className="header-search">{!isHomePage && <SearchBar />}</div>

          {/* RIGHT */}
          <Space size={16}>
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

          <Button block onClick={() => router.push('/dashboard/profile')}>
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
