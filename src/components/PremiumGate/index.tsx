'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { StarFilled } from '@components/AppIcon';
import { asButton } from '@/utils/asButton';
import { usePremium } from '@/modules/premium/usePremium';
import styles from './styles';

type PremiumGateProps = {
  // Chỉ để hiển thị khóa; BE vẫn là nơi chặn thật.
  locked: boolean;
  message?: string;
  children: React.ReactNode;
};

// Khóa: nội dung mờ + không tương tác (inert), phủ một nút trong suốt bấm để
// mở modal nâng cấp. Nút nằm cạnh nội dung (không bọc) để tránh nested-interactive.
const PremiumGate: React.FC<PremiumGateProps> = ({
  locked,
  message,
  children,
}) => {
  const { openUpgrade } = usePremium();
  if (!locked) return <>{children}</>;
  return (
    <View style={styles.wrap}>
      <View
        ref={el => (el as unknown as HTMLElement)?.setAttribute('inert', '')}
        style={styles.dimmed}>
        {children}
      </View>
      <View
        style={styles.overlay}
        {...asButton(
          () => openUpgrade(message),
          'Nâng cấp Premium để mở khóa',
        )}>
        <View style={styles.badge}>
          <StarFilled size={12} color="currentColor" />
          <Text style={styles.badgeText}>Premium</Text>
        </View>
      </View>
    </View>
  );
};

export default PremiumGate;
