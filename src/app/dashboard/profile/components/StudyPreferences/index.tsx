'use client';
import React from 'react';
import { View, Text } from 'react-native-web';
import { Switch, Checkbox } from 'antd';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import styles from './styles';

// Nhãn tiếng Việt cho từng loại thông báo user tự bật/tắt được - KHÔNG gồm
// STUDY_REMINDER (đã có công tắc riêng "Nhắc nhở học tập" bên dưới, gộp cả
// email + trong app, thêm công tắc thứ 2 cho cùng 1 thứ sẽ gây rối). 2 loại
// cuối chỉ dành cho admin (NEW_QUESTION/VIOLATION_REPORT là thông báo admin
// mới nhận được, xem BE NotificationService.notifyAdmins).
const USER_NOTIF_TYPES: { type: string; label: string }[] = [
  { type: 'COMMENT_REPLY', label: 'Có người trả lời bình luận của bạn' },
  { type: 'FEEDBACK_REPLIED', label: 'Phản hồi của bạn được trả lời' },
  { type: 'NEW_COURSE', label: 'Có khóa học mới' },
  { type: 'COURSE_COMPLETED', label: 'Hoàn thành khóa học' },
  { type: 'RETRY_REMINDER', label: 'Nhắc làm lại bài thực hành chưa đạt' },
  { type: 'ACHIEVEMENT_UNLOCKED', label: 'Mở khoá huy hiệu mới' },
];
const ADMIN_NOTIF_TYPES: { type: string; label: string }[] = [
  { type: 'NEW_QUESTION', label: 'Có câu hỏi mới cần trả lời' },
  { type: 'VIOLATION_REPORT', label: 'Có báo cáo vi phạm mới' },
];

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
  const isAdmin = (userProfile as any)?.role?.level <= 2;
  const disabledTypes = (userProfile as any)?.disabledNotificationTypes || [];

  const toggleNotifType = (type: string, checked: boolean) => {
    const next = checked
      ? disabledTypes.filter((t: string) => t !== type)
      : [...disabledTypes, type];
    dispatch(
      authAction.updateCurrentInfo({
        ...userProfile,
        disabledNotificationTypes: next,
      } as any),
    );
  };

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
      <Text style={styles.rowTitle}>Loại thông báo muốn nhận</Text>
      <View style={styles.notifList}>
        {[...USER_NOTIF_TYPES, ...(isAdmin ? ADMIN_NOTIF_TYPES : [])].map(
          ({ type, label }) => (
            <Checkbox
              key={type}
              checked={!disabledTypes.includes(type)}
              onChange={e => toggleNotifType(type, e.target.checked)}>
              {label}
            </Checkbox>
          ),
        )}
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
