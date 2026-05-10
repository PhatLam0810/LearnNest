'use client';
import React from 'react';
import { Card, Form, message } from 'antd';
import { useRouter } from 'next/navigation';
import { Text, View } from 'react-native-web';
import { AppButton, AppInput } from '@components';
import { useAppDispatch } from '@redux';
import { authAction, authQuery } from '~mdAuth/redux';
import styles from './styles';
import { useResponsive } from '@/styles/responsive';
import { typography } from '@/styles/typography';

type FieldType = {
  email: string;
};

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<FieldType>();
  const [sendOtp] = authQuery.useSendOtpMutation();

  const handleSendOtp = async (email: string) => {
    try {
      dispatch(authAction.setIsShowLoading(true));
      const response = await sendOtp({ email, type: 2 });
      if (response.data) {
        dispatch(authAction.sendOtpInfo({ email }));
        router.push('forgotPassword/changePassword');
      }
    } catch (error: any) {
      console.error('Lỗi gửi OTP:', error);
      messageApi.error(error.message || 'Failed to send OTP.');
    } finally {
      dispatch(authAction.setIsShowLoading(false));
    }
  };

  const { isMobile, isTablet } = useResponsive();
  const containerStyle = isMobile
    ? styles.containerMobile
    : isTablet
      ? styles.containerTablet
      : styles.containerDesktop;

  return (
    <View style={styles.pageWrapper}>
      <Card style={containerStyle}>
        {contextHolder}
        <View>
          <View style={styles.subContainer}>
            <Text
              style={isMobile ? typography.titleMMobile : typography.titleM}>
              Forgot Password
            </Text>
            <Text style={isMobile ? typography.body2Mobile : typography.body2}>
              Enter your email address and we will send you a otp to reset your
              password
            </Text>
          </View>

          <Form<FieldType>
            name="forgotPasswordForm"
            onFinish={data => handleSendOtp(data.email)}
            layout="vertical"
            requiredMark={false}
            form={form}>
            <Form.Item<FieldType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Email
                </Text>
              }
              name={'email'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 16 }}
              rules={[{ required: true, message: 'Email required' }]}>
              <AppInput
                placeholder="Enter your email"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item<FieldType> shouldUpdate>
              {({ getFieldsValue }) => {
                const { email } = getFieldsValue();
                return (
                  <AppButton type="primary" disabled={!email} htmlType="submit">
                    Go to verification
                  </AppButton>
                );
              }}
            </Form.Item>
          </Form>
        </View>
      </Card>
    </View>
  );
};

export default ForgotPasswordPage;
