'use client';
import React from 'react';
import { View, Text } from 'react-native-web';
import dayjs from 'dayjs';
import { AppUploadToServer, UserAvatar } from '@components';
import { messageApi } from '@hooks';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import styles from './styles';

const MAX_AVATAR_SIZE_MB = 5;

// /upload là endpoint DÙNG CHUNG cho nhiều luồng khác nhau (video/PDF thư
// viện, file đề thực hành...) nên không giới hạn kích thước/loại file ở phía
// server - giới hạn riêng cho avatar (ảnh, tối đa 5MB) ngay tại đây, chỗ duy
// nhất trong app dùng AppUploadToServer cho avatar.
const beforeUploadAvatar: NonNullable<
  React.ComponentProps<typeof AppUploadToServer>['beforeUpload']
> = file => {
  if (!file.type.startsWith('image/')) {
    messageApi.error('Chỉ chọn được file ảnh cho ảnh đại diện');
    return false;
  }
  if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
    messageApi.error(`Ảnh đại diện phải nhỏ hơn ${MAX_AVATAR_SIZE_MB}MB`);
    return false;
  }
  return true;
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
        accept="image/*"
        beforeUpload={beforeUploadAvatar}
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
