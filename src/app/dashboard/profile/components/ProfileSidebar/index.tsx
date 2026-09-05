'use client';
import React from 'react';
import { View, Text } from 'react-native-web';
import { Avatar } from 'antd';
import dayjs from 'dayjs';
import { AppUploadToServer } from '@components';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import styles from './styles';

const AVATAR_COLORS = [
  '#1d418a',
  '#c2860a',
  '#16a34a',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
];

const getInitials = (fullName?: string) => {
  const words = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (
    words[words.length - 2][0] + words[words.length - 1][0]
  ).toUpperCase();
};

const getAvatarColor = (seed?: string) => {
  if (!seed) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Card hồ sơ bên sidebar trang Cài Đặt - avatar (chữ cái đầu màu theo user
// khi chưa có ảnh) + tên + vai trò/lớp + đổi ảnh + ngày tham gia.
const ProfileSidebar = () => {
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const roleName = (userProfile as any)?.role?.name;
  const className = (userProfile as any)?.class;
  const joinedAt = (userProfile as any)?.createdAt;

  return (
    <View style={styles.container}>
      <Avatar
        src={userProfile?.avatar || undefined}
        size={96}
        style={
          !userProfile?.avatar
            ? {
                backgroundColor: getAvatarColor(userProfile?._id),
                fontSize: 32,
                fontWeight: 700,
              }
            : undefined
        }>
        {!userProfile?.avatar && getInitials(userProfile?.fullName)}
      </Avatar>
      <Text style={styles.name}>{userProfile?.fullName}</Text>
      {(roleName || className) && (
        <Text style={styles.subtitle}>
          {[roleName, className].filter(Boolean).join(' · ')}
        </Text>
      )}
      <AppUploadToServer
        showUploadList={false}
        onChange={url =>
          dispatch(
            authAction.updateCurrentInfo({
              ...userProfile,
              avatar: url,
            } as any),
          )
        }>
        <View style={styles.changeAvatarBtn}>
          <Text style={styles.changeAvatarText}>Đổi ảnh đại diện</Text>
        </View>
      </AppUploadToServer>
      <View style={styles.divider} />
      <View style={styles.joinedRow}>
        <Text style={styles.joinedLabel}>Tham gia</Text>
        <Text style={styles.joinedValue}>
          {joinedAt ? dayjs(joinedAt).format('MM/YYYY') : '—'}
        </Text>
      </View>
    </View>
  );
};

export default ProfileSidebar;
