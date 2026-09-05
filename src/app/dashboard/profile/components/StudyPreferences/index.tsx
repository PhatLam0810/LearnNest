'use client';
import React, { useState } from 'react';
import { View, Text } from 'react-native-web';
import { Switch } from 'antd';
import { useAppDispatch } from '@redux';
import { authAction } from '~mdAuth/redux';
import styles from './styles';

// Card "Học tập và thông báo" - nhắc nhở học tập qua email. Lưu ý: hiện chỉ
// là tuỳ chọn hiển thị (chưa có cron gửi email thật ở BE), việc bật/tắt
// không tự gửi email nào - cần nối với hệ thống nhắc nhở (đã có ở phần Lộ
// Trình AI) nếu muốn thật sự gửi.
const StudyPreferences = () => {
  const dispatch = useAppDispatch();
  const [reminderEnabled, setReminderEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Học tập và thông báo</Text>
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Nhắc nhở học tập</Text>
          <Text style={styles.rowSubtitle}>Email lúc 19:00 mỗi ngày</Text>
        </View>
        <Switch checked={reminderEnabled} onChange={setReminderEnabled} />
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
