'use client';
import React from 'react';
import { View, Text } from 'react-native-web';
import { useAppSelector } from '@redux';
import styles from './styles';
import {
  ChangePassword,
  EditProfile,
  ProfileSidebar,
  StudyPreferences,
} from './components';

const ProfilePage: React.FC = () => {
  const mustChangePassword = useAppSelector(
    state => !!state.authReducer.tokenInfo?.userProfile?.mustChangePassword,
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài Đặt</Text>
      {mustChangePassword && (
        <View style={styles.forceBanner} {...({ role: 'alert' } as object)}>
          <Text style={styles.forceBannerTitle}>
            Bạn cần đổi mật khẩu để tiếp tục
          </Text>
          <Text style={styles.forceBannerText}>
            Mật khẩu hiện tại là mã số sinh viên hoặc mật khẩu tạm được gửi qua
            email. Hãy đặt mật khẩu mới ở phần Đổi mật khẩu bên dưới; sau đó bạn
            đăng nhập lại để dùng LearnNest.
          </Text>
        </View>
      )}
      <View style={styles.contentRow}>
        <View style={styles.sideCol}>
          <ProfileSidebar />
        </View>
        <View style={styles.mainCol}>
          <EditProfile />
          <ChangePassword />
          <StudyPreferences />
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
