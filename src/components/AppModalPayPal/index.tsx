import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { View } from 'react-native-web';
import styles from './styles';
import { Button, message, Modal } from 'antd';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { LessonDetailDataResponse } from '~mdDashboard/redux/saga/type';
import { LessonContent, VerifyOtpModal } from './components';
import { authAction, authQuery } from '~mdAuth/redux';
import { useAppDispatch, useAppSelector } from '@redux';
import './styles.css';
type AppModalPayPalProps = {
  isVisibleModalBuy: boolean;
  setIsVisibleModalBuy: (isVisible: boolean) => void;
  data: Partial<LessonDetailDataResponse>;
  accessLesson: boolean;
};

const AppModalPayPal: React.FC<AppModalPayPalProps> = ({
  isVisibleModalBuy,
  setIsVisibleModalBuy,
  data,
  accessLesson,
}) => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [sendOtp] = authQuery.useSendTransactionOtpMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { verifyInfo } = useAppSelector(state => state.authReducer);
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  const [isVisibleVerify, setIsVisibleVerify] = useState(false);
  const handleSendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await sendOtp({ email: email });
      if (response.data) {
        messageApi.open({
          type: 'success',
          content: `Otp code has been send to your ${userProfile?.email}`,
          duration: 10,
        });
        setIsVisibleVerify(true);
      }
    } catch (error) {
      console.error('Lỗi gửi OTP:', error); // In ra lỗi
      messageApi.error(error.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseModalAdd = () => {
    setIsVisibleModalBuy(false);
  };
  const onCloseModalVerify = () => {
    setIsVisibleVerify(false);
  };

  useEffect(() => {
    if (verifyInfo) {
      onCloseModalVerify();
    }
  }, [verifyInfo]);

  return (
    <Modal
      open={isVisibleModalBuy}
      onCancel={onCloseModalAdd}
      closable={false}
      onClose={onCloseModalAdd}
      footer={null}>
      <View style={{ flex: 1 }}>
        {contextHolder}
        <LessonContent data={data} accessLesson={accessLesson} />
        {verifyInfo ? (
          <PayPalButtons
            fundingSource="paypal"
            createOrder={(paypalData, actions) => {
              return actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [
                  {
                    amount: {
                      value: (data.price || 0).toString(),
                      currency_code: 'USD',
                    },
                  },
                ],
              });
            }}
            onApprove={async (detailData, actions) => {
              const detail = await actions?.order?.capture();
              if (detail) {
                dispatch(
                  authAction.lessonPurchase({
                    _id: data._id,
                    email: userProfile?.email,
                    userId: userProfile?._id,
                    paymentId: detail.id,
                    title: data.title,
                    amount: data.price,
                    currency: 'USD',
                    status: 'success',
                  }),
                );
              }
            }}
            onCancel={(cancelData, actions) => {
              setIsVisibleModalBuy(false);
              if (cancelData.orderID) {
                dispatch(
                  authAction.lessonPurchase({
                    _id: data._id,
                    email: userProfile?.email,
                    userId: userProfile?._id,
                    paymentId: String(cancelData?.orderID),
                    title: data.title,
                    amount: data.price,
                    currency: 'USD',
                    status: 'failed',
                  }),
                );
              }
            }}
            onError={err => {
              setIsVisibleModalBuy(false);
            }}
          />
        ) : (
          <Button
            type="primary"
            style={styles.button}
            onClick={() => handleSendOtp(userProfile?.email)}
            loading={isLoading}>
            Continue with PayPal
          </Button>
        )}
      </View>
      <VerifyOtpModal
        isVisible={isVisibleVerify}
        setIsVisible={onCloseModalVerify}
        email={userProfile?.email}
      />
    </Modal>
  );
};

export default AppModalPayPal;
