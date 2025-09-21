'use client';
import React, { useEffect } from 'react';
import { Card, Form, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@redux';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { AppButton, AppInput } from '@components';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAction } from '~mdAuth/redux';
import { useResponsive } from '@/styles/responsive';
import typography from '@/styles/typography';

type FieldType = {
  otp: number;
  password: string;
  confirmPassword: string;
};

const CreateAccountPage = () => {
  const [form] = Form.useForm<FieldType>();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { sendOtpInfo } = useAppSelector(state => state.authReducer);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    if (sendOtpInfo) {
      messageApi.open({
        type: 'success',
        content: `Otp code has been send to your ${sendOtpInfo.email}`,
        duration: 5,
      });
    }
  }, [sendOtpInfo]);

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
              Create your account
            </Text>
            <Text style={isMobile ? typography.body2Mobile : typography.body2}>
              In the next step, we’ll learn about your interests and skills.
            </Text>
            <Text style={styles.description}>
              Enter the OTP code we just sent to your email{' '}
              <Text style={styles.email}>{sendOtpInfo.email}</Text> to verify.
            </Text>
          </View>

          <Form<FieldType>
            name="register"
            requiredMark={false}
            onFinish={data => {
              dispatch(
                authAction.signUp({
                  params: {
                    email: sendOtpInfo.email,
                    password: data.password,
                    otp: data.otp,
                  },
                  callback() {
                    router.push('/login');
                  },
                }),
              );
            }}
            layout="vertical"
            form={form}>
            <Form.Item<FieldType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Otp
                </Text>
              }
              name={'otp'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 0 }}
              rules={[{ required: true, message: 'Otp required' }]}>
              <AppInput
                placeholder="Enter Otp code"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Password
                </Text>
              }
              name={'password'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 0 }}
              rules={[{ required: true, message: 'Password required' }]}>
              <AppInput
                type="Password"
                placeholder="Enter your password"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Confirm Password
                </Text>
              }
              name={'confirmPassword'}
              dependencies={['password']}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 16 }}
              rules={[
                { required: true, message: 'Confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}>
              <AppInput
                type="Password"
                placeholder="Confirm your password"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item shouldUpdate>
              {({ getFieldsValue }) => {
                const { otp, password, confirmPassword } = getFieldsValue();
                return (
                  <AppButton
                    type="primary"
                    disabled={!otp || !password || !confirmPassword}
                    htmlType="submit">
                    Sign Up
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

export default CreateAccountPage;
