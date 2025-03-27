import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlatList, Text, View } from 'react-native-web';
import styles from './styles';
import { Button, message, Modal } from 'antd';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { LessonDetailDataResponse } from '~mdDashboard/redux/saga/type';
import { LessonThumbnail } from '~mdDashboard/components';
import { DollarOutlined, CheckOutlined } from '@ant-design/icons';
import { LessonContent, VerifyOtpModal } from './components';
import Icon from '@components/icons';
import { authAction, authQuery } from '~mdAuth/redux';
import { useAppDispatch, useAppSelector } from '@redux';
import { messageApi } from '@hooks';
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

  const { userProfile } = useAppSelector(state => state.authReducer.tokenInfo);
  const router = useRouter();

  const [isVisibleVerify, setIsVisibleVerify] = useState(false);
  const handleSendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await sendOtp({ email: email });
      if (response.data) {
        messageApi.open({
          type: 'success',
          content: `Otp code has been send to your ${userProfile.email}`,
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
        {/* <PayPalButtons
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
          onApprove={async (data, actions) => {
            const detail = await actions?.order?.capture();
            // router.back();
            console.log(detail);
          }}
          onError={err => {
            setIsVisibleModalBuy(false);
          }}
        /> */}
        <Button
          type="primary"
          style={styles.button}
          onClick={() => handleSendOtp(userProfile.email)}
          loading={isLoading}>
          Continue with PayPal
        </Button>
      </View>
      <VerifyOtpModal
        isVisible={isVisibleVerify}
        setIsVisible={setIsVisibleVerify}
        email={userProfile.email}
      />
    </Modal>
  );
};

export default AppModalPayPal;
