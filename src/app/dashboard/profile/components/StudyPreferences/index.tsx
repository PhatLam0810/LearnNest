'use client';
import React from 'react';
import { View, Text } from 'react-native-web';
import { Switch } from 'antd';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import styles from './styles';

// Card "Học tập và thông báo" - bật/tắt email nhắc nhở học tập lúc 19:00
// hàng ngày. Lưu trực tiếp vào userProfile.studyReminderEnabled qua API cập
// nhật hồ sơ đã có sẵn (cùng luồng với đổi avatar/tên) - BE gửi email thật
// mỗi ngày cho user đang bật, xem AiCoachService.runDailyStudyReminder.
const StudyPreferences = () => {
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  // Field có thể chưa tồn tại trên profile cũ (chưa từng đổi) - mặc định
  // bật, khớp default true ở BE.
  const reminderEnabled = userProfile?.studyReminderEnabled !== false;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Học tập và thông báo</Text>
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Nhắc nhở học tập</Text>
          <Text style={styles.rowSubtitle}>Email lúc 19:00 mỗi ngày</Text>
        </View>
        <Switch
          checked={reminderEnabled}
          onChange={checked =>
            dispatch(
              authAction.updateCurrentInfo({
                ...userProfile,
                studyReminderEnabled: checked,
              } as any),
            )
          }
        />
      </View>
      <View style={styles.divider} />
      <Text
        style={styles.logoutLink}
        onClick={() => dispatch(authAction.logout())}>
        Đăng xuất
      </Text>
    </View>
  );
};

export default StudyPreferences;
