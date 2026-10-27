'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { useRouter } from 'next/navigation';
import { StarFilled } from '@components/AppIcon';
import { asButton } from '@/utils/asButton';
import { usePremium } from '@/modules/premium/usePremium';
import styles from './styles';

// Huy hiệu cạnh avatar ở header: chỉ hiện khi Premium còn hạn thật (admin
// không có ngày hết hạn nên không hiện).
const PremiumBadge: React.FC = () => {
  const router = useRouter();
  const { info } = usePremium();
  if (!info.active) return null;
  return (
    <View
      style={styles.badge}
      {...asButton(
        () => router.push('/dashboard/premium'),
        `Thành viên Premium, còn ${info.daysLeft} ngày. Mở trang Premium`,
      )}>
      <StarFilled size={12} color="currentColor" />
      <Text style={styles.text}>Premium</Text>
    </View>
  );
};

export default PremiumBadge;
