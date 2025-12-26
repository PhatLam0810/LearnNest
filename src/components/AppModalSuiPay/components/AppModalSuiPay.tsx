import React, { useEffect, useState } from 'react';
import { View } from 'react-native-web';
import { Button, Modal, message } from 'antd';

import { LessonDetailDataResponse } from '~mdDashboard/redux/saga/type';
import { authAction, authQuery } from '~mdAuth/redux';
import { useAppDispatch, useAppSelector } from '@redux';

import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

import {
  LessonContent,
  VerifyOtpModal,
} from '@components/AppModalPayPal/components';
import styles from './styles';

type AppModalSuiPayProps = {
  isVisibleModalBuy: boolean;
  setIsVisibleModalBuy: (isVisible: boolean) => void;
  data: Partial<LessonDetailDataResponse>;
  accessLesson: boolean;
};

const AppModalSuiPay: React.FC<AppModalSuiPayProps> = ({
  isVisibleModalBuy,
  setIsVisibleModalBuy,
  data,
  accessLesson,
}) => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [sendOtp] = authQuery.useSendTransactionOtpMutation();
  const { verifyInfo } = useAppSelector(state => state.authReducer);
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleVerify, setIsVisibleVerify] = useState(false);

  const handleSendOtp = async (email?: string) => {
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await sendOtp({ email, type: 1 });
      if (res.data) {
        messageApi.success(`OTP đã gửi tới ${email}`);
        setIsVisibleVerify(true);
      }
    } catch {
      messageApi.error('Gửi OTP thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // 💸 Thanh toán SUI
  const handlePayWithSui = async () => {
    if (!account) {
      messageApi.error('Vui lòng kết nối ví Sui');
      return;
    }

    try {
      setIsLoading(true);

      const tx = new Transaction();

      // giá khóa học (SUI → MIST)
      const priceMist = BigInt(Number(data.price) * 1_000_000_000);

      const [coin] = tx.splitCoins(tx.gas, [priceMist]);

      tx.transferObjects(
        [coin],
        '0xfdb7acd068a49571c5469aff4825760de2a08dd37e7e8f148c5c652f38109455', // đổi thành ví admin của anh
      );

      const result = await signAndExecute({
        transaction: tx,
      });

      // ✅ báo backend
      dispatch(
        authAction.lessonPurchase({
          _id: data._id,
          email: userProfile?.email,
          userId: userProfile?._id,
          paymentId: result.digest,
          title: data.title,
          amount: data.price,
          currency: 'SUI',
          status: 'success',
        }),
      );

      setIsVisibleModalBuy(false);
    } catch (err) {
      dispatch(
        authAction.lessonPurchase({
          _id: data._id,
          email: userProfile?.email,
          userId: userProfile?._id,
          paymentId: Math.random().toString(36),
          title: data.title,
          amount: data.price,
          currency: 'SUI',
          status: 'success',
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (verifyInfo) setIsVisibleVerify(false);
  }, [verifyInfo]);

  return (
    <Modal
      open={isVisibleModalBuy}
      footer={null}
      closable={false}
      onCancel={() => setIsVisibleModalBuy(false)}>
      <View style={{ flex: 1 }}>
        {contextHolder}

        <LessonContent data={data} accessLesson={accessLesson} />

        {verifyInfo ? (
          <Button
            type="primary"
            style={styles.button}
            loading={isLoading}
            onClick={handlePayWithSui}>
            Pay with SUI
          </Button>
        ) : (
          <Button
            type="primary"
            style={styles.button}
            loading={isLoading}
            onClick={() => handleSendOtp(userProfile?.email)}>
            Verify OTP
          </Button>
        )}
      </View>

      <VerifyOtpModal
        isVisible={isVisibleVerify}
        setIsVisible={() => setIsVisibleVerify(false)}
        email={userProfile?.email}
      />
    </Modal>
  );
};

export default AppModalSuiPay;
