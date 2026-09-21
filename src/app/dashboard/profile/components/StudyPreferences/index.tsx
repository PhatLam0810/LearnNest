'use client';
import { asButton } from '@/utils/asButton';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native-web';
import { Switch, Checkbox, Button } from 'antd';
import { messageApi } from '@hooks';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction, authQuery } from '~mdAuth/redux';
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

// Card "Học tập và thông báo" - công tắc nhắc nhở học tập (email 19:00 hàng
// ngày) + loại thông báo muốn nhận. Thay đổi chỉ giữ ở bản nháp trên màn hình;
// bấm "Lưu cài đặt" mới gọi API cập nhật hồ sơ đã có sẵn (cùng luồng với đổi
// avatar/tên) - tránh gọi API mỗi lần tick/bỏ tick. BE gửi email thật mỗi ngày
// cho user đang bật, xem AiCoachService.runDailyStudyReminder.
const StudyPreferences = () => {
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [updateCurrentInfo, { isLoading: isSaving }] =
    authQuery.useUpdateCurrentInfoMutation();
  // Field có thể chưa tồn tại trên profile cũ (chưa từng đổi) - mặc định
  // bật, khớp default true ở BE.
  const savedReminder = userProfile?.studyReminderEnabled !== false;
  const isAdmin = (userProfile as any)?.role?.level <= 2;
  const savedDisabledTypes: string[] =
    (userProfile as any)?.disabledNotificationTypes || [];

  const [reminderEnabled, setReminderEnabled] = useState(savedReminder);
  const [disabledTypes, setDisabledTypes] =
    useState<string[]>(savedDisabledTypes);

  // Đồng bộ lại bản nháp khi hồ sơ đã lưu đổi (vừa lưu xong / tải hồ sơ).
  const savedKey = JSON.stringify([
    savedReminder,
    [...savedDisabledTypes].sort(),
  ]);
  useEffect(() => {
    setReminderEnabled(savedReminder);
    setDisabledTypes(savedDisabledTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedKey]);

  const isDirty =
    JSON.stringify([reminderEnabled, [...disabledTypes].sort()]) !== savedKey;

  const toggleNotifType = (type: string, checked: boolean) => {
    setDisabledTypes(prev =>
      checked ? prev.filter(t => t !== type) : [...prev, type],
    );
  };

  const handleSave = async () => {
    try {
      const res = await updateCurrentInfo({
        ...userProfile,
        studyReminderEnabled: reminderEnabled,
        disabledNotificationTypes: disabledTypes,
      }).unwrap();
      dispatch(authAction.setCurrentUserInfo(res));
      messageApi.success('Đã lưu cài đặt');
    } catch {
      messageApi.error('Không lưu được cài đặt, vui lòng thử lại');
    }
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
          aria-label="Nhắc học hằng ngày qua email"
          checked={reminderEnabled}
          onChange={setReminderEnabled}
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
      <View style={styles.saveRow}>
        <Button
          type="primary"
          loading={isSaving}
          disabled={!isDirty}
          onClick={handleSave}>
          Lưu cài đặt
        </Button>
        {isDirty && (
          <Text style={styles.dirtyHint}>Bạn có thay đổi chưa lưu</Text>
        )}
      </View>
      <View style={styles.divider} />
      <Text
        style={styles.logoutLink}
        {...asButton(() => dispatch(authAction.logout()))}
        onClick={() => dispatch(authAction.logout())}>
        Đăng xuất
      </Text>
    </View>
  );
};

export default StudyPreferences;
