'use client';
import React from 'react';
import dayjs from 'dayjs';
import { Text, View } from 'react-native-web';
import AppButton from '@components/AppButton';
import { StarFilled } from '@components/AppIcon';
import { usePremium } from '@/modules/premium/usePremium';
import styles from './styles';

type PremiumStatusCardProps = {
  // Bấm "Gia hạn" / "Nâng cấp": trang Premium cuộn tới bảng giá, nơi khác chuyển trang.
  onAction: () => void;
};

// Thẻ "Gói của bạn": dùng ở trang Premium và trang Hồ sơ. Có 4 trạng thái:
// đang tải, miễn phí, đang dùng (có/không sắp hết hạn), đã hết hạn.
const PremiumStatusCard: React.FC<PremiumStatusCardProps> = ({ onAction }) => {
  const { isPremium, expiresAt, info, isLoading } = usePremium();

  if (isLoading) return <View style={[styles.card, styles.skeleton]} />;

  const adminOnly = isPremium && !info.active;
  const title = info.active
    ? 'Gói Premium đang hoạt động'
    : adminOnly
      ? 'Quyền Premium của quản trị'
      : info.expired
        ? 'Gói Premium đã hết hạn'
        : 'Gói miễn phí';
  const detail = info.active
    ? `Hết hạn ngày ${dayjs(expiresAt).format('DD/MM/YYYY')} · còn ${info.daysLeft} ngày`
    : adminOnly
      ? 'Tài khoản quản trị có đầy đủ quyền Premium, không có ngày hết hạn.'
      : info.expired
        ? `Hết hạn từ ${dayjs(expiresAt).format('DD/MM/YYYY')}. Gia hạn để dùng lại đầy đủ quyền lợi.`
        : 'Nâng cấp để dùng AI không giới hạn, thi thử và luyện tập đầy đủ.';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icon, info.active && styles.iconActive]}>
          <StarFilled size={20} color="currentColor" />
        </View>
        <View style={styles.text}>
          <Text role="heading" aria-level={2} style={styles.title}>
            {title}
          </Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>
        {!adminOnly && (!info.active || info.expiringSoon) && (
          <AppButton
            type="primary"
            style={{ width: 'auto' }}
            onClick={onAction}>
            {info.active ? 'Gia hạn' : info.expired ? 'Mua lại' : 'Nâng cấp'}
          </AppButton>
        )}
      </View>
      {info.expiringSoon && (
        <View style={styles.warning} {...({ role: 'status' } as object)}>
          <Text style={styles.warningText}>
            Gói sắp hết hạn trong {info.daysLeft} ngày. Gia hạn ngay, ngày mới
            được cộng nối tiếp vào hạn hiện tại.
          </Text>
        </View>
      )}
    </View>
  );
};

export default PremiumStatusCard;
