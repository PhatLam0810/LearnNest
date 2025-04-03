'use client';
import React from 'react';
import { Button, Card, Form, Input, message } from 'antd';
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
import { messageApi } from '@hooks';

type FieldType = {
  email: string;
};

const SignUpPage = () => {
  const [form] = Form.useForm<FieldType>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sendOtp, { error, isSuccess }] = authQuery.useSendOtpMutation();
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
      const response = await sendOtp({ email: email });

      if (response.data) {
        dispatch(authAction.sendOtpInfo({ email: email }));
        router.push('signup/createAccount');
      }
    } catch (error) {
      console.error('Lỗi gửi OTP:', error); // In ra lỗi
      messageApi.error(error.message || 'Failed to send OTP.');
    } finally {
      dispatch(authAction.setIsShowLoading(false));
    }
  };

  return (
    <Card style={styles.container}>
      {contextHolder}
      <View style={{ flex: 1 }}>
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>Sign Up</Text>
          <Text style={styles.subDescription}>
            Access thousands of free lessons today.
          </Text>
        </View>
        <View style={{ overflow: 'hidden' }}>
          <Form<FieldType>
            name="signUp"
            onFinish={data => {
              handleSendOtp(data.email);
            }}
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
              labelCol={{ span: 24 }} // Đặt label chiếm toàn bộ hàng
              style={{ width: '100%', marginBottom: 16 }} // Đảm bảo Form.Item full width
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
        </View>
        <View style={styles.footer}>
          <Text>Already have an account? </Text>
          <Link href={`/login`}>Sign In</Link>
        </View>
      </View>
    </Card>
  );
};

export default SignUpPage;
