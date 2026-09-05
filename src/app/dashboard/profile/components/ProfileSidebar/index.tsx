'use client';
import React from 'react';
import { View, Text } from 'react-native-web';
import dayjs from 'dayjs';
import { AppUploadToServer, UserAvatar } from '@components';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import styles from './styles';

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
      <UserAvatar
        avatar={userProfile?.avatar}
        fullName={userProfile?.fullName}
        seed={userProfile?._id}
        size={96}
        style={{ fontSize: 32 }}
      />
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
