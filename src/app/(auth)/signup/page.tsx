'use client';
import React from 'react';
import { Card, Form, message } from 'antd';
import { Text, View } from 'react-native-web';
import Link from 'next/link';
import Icon from '@components/icons';
import { useRouter } from 'next/navigation';
import { AppButton, AppInput } from '@components';
import styles from './styles';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@utils';
import { useAppDispatch } from '@redux';
import { authAction, authQuery } from '~mdAuth/redux';
import { useResponsive } from '@/styles/responsive';
import typography from '@/styles/typography';

type FieldType = {
  email: string;
};

const SignUpPage = () => {
  const [form] = Form.useForm<FieldType>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sendOtp] = authQuery.useSendOtpMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLoginOauth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      dispatch(authAction.loginOAuth({ token }));
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleSendOtp = async (email: string) => {
    try {
      dispatch(authAction.setIsShowLoading(true));
      const response = await sendOtp({ email });
      if (response.data) {
        dispatch(authAction.sendOtpInfo({ email }));
        router.push('signup/createAccount');
      }
    } catch (error: any) {
      console.error('Lỗi gửi OTP:', error);
      messageApi.error(error.message || 'Failed to send OTP.');
    } finally {
      dispatch(authAction.setIsShowLoading(false));
    }
  };

  // 🔹 Responsive detect
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
              Sign Up
            </Text>
            <Text style={isMobile ? typography.body2Mobile : typography.body2}>
              Access thousands of free lessons today.
            </Text>
          </View>

          <Form<FieldType>
            name="signUp"
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
                    Continue with Email
                  </AppButton>
                );
              }}
            </Form.Item>

            <View style={styles.driverContainer}>
              <View style={styles.driver}></View>
              <Text style={styles.driverText}>or</Text>
              <View style={styles.driver}></View>
            </View>

            <View style={styles.btnContainer}>
              <AppButton onClick={handleLoginOauth}>
                <Icon name="google" />
                Sign in with Google
              </AppButton>
            </View>
          </Form>

          <View style={styles.footer}>
            <Text>Already have an account? </Text>
            <Link href={`/login`}>Sign In</Link>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default SignUpPage;
