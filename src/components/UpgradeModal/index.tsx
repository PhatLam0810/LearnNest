'use client';
import React from 'react';
import { Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { Text, View } from 'react-native-web';
import { useAppDispatch, useAppSelector } from '@redux';
import { premiumAction } from '@/modules/premium/redux/slice';
import AppButton from '@components/AppButton';
import { PREMIUM_BENEFITS } from '@/modules/premium/benefits';
import styles from './styles';

// Mở bởi baseQuery khi BE trả PREMIUM_REQUIRED, hoặc bởi PremiumGate.
const UpgradeModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { upgradeOpen, upgradeMessage } = useAppSelector(
    state => state.premiumReducer,
  );
  const close = () => dispatch(premiumAction.closeUpgradeModal());

  return (
    <Modal
      open={upgradeOpen}
      onCancel={close}
      footer={null}
      closable={false}
      width={520}
      centered
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Text role="heading" aria-level={2} style={styles.title}>
            Nâng cấp LearnNest Premium
          </Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.message}>
            {upgradeMessage || 'Tính năng này dành cho thành viên Premium.'}
          </Text>
          <View style={styles.list}>
            {PREMIUM_BENEFITS.map(b => (
              <Text key={b.key} style={styles.item}>
                ✓ {b.title}
              </Text>
            ))}
          </View>
          <View style={styles.actions}>
            <AppButton
              type="primary"
              onClick={() => {
                close();
                router.push('/dashboard/premium');
              }}>
              Xem gói Premium
            </AppButton>
            <AppButton onClick={close}>Để sau</AppButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpgradeModal;
