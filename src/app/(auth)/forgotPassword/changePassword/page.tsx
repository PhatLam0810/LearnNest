'use client';
import React, { useEffect, useState } from 'react';
import { Card, Form, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@redux';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { AppButton, AppInput } from '@components';
import { useRouter } from 'next/navigation';
import { authAction, authQuery } from '~mdAuth/redux';
import { useResponsive } from '@/styles/responsive';
import typography from '@/styles/typography';

type resetPasswordType = {
  otp: number;
  newPassword: string;
  confirmPassword: string;
};

const ChangePasswordPage = () => {
  const [formResetPassword] = Form.useForm<resetPasswordType>();
  const { sendOtpInfo } = useAppSelector(state => state.authReducer);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [resetPassword] = authQuery.useResetPasswordMutation();
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

  const handleResetPassword = (values: resetPasswordType) => {
    resetPassword({
      email: sendOtpInfo.email,
      otp: values.otp,
      newPassword: values.newPassword,
    }).then(res => {
      if (res.data) {
        messageApi.success('Reset password successfully');
        router.push('/login');
      } else {
        messageApi.error('Reset password failed');
      }
    });
  };

  return (
    <View style={styles.pageWrapper}>
      <Card style={containerStyle}>
        {contextHolder}
        <View>
          <View style={styles.subContainer}>
            <Text
              style={isMobile ? typography.titleMMobile : typography.titleM}>
              Reset your password
            </Text>
            <Text style={isMobile ? typography.body2Mobile : typography.body2}>
              In the next step, we’ll learn about your interests and skills.
            </Text>
            <Text style={styles.description}>
              Enter the OTP code we just sent to your email{' '}
              <Text style={styles.email}>{sendOtpInfo?.email}</Text> to verify.
            </Text>
          </View>
          <Form<resetPasswordType>
            name="resetPassword"
            requiredMark={false}
            onFinish={data => {
              handleResetPassword(data);
            }}
            layout="vertical"
            form={formResetPassword}>
            <Form.Item<resetPasswordType>
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
            <Form.Item<resetPasswordType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Password
                </Text>
              }
              name={'newPassword'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 0 }}
              rules={[{ required: true, message: 'Password required' }]}>
              <AppInput
                type="Password"
                placeholder="Enter your password"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item<resetPasswordType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Confirm Password
                </Text>
              }
              name={'confirmPassword'}
              dependencies={['newPassword']}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 16 }}
              rules={[
                { required: true, message: 'Confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
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
                const { otp, newPassword, confirmPassword } = getFieldsValue();
                return (
                  <AppButton
                    type="primary"
                    disabled={!otp || !newPassword || !confirmPassword}
                    htmlType="submit">
                    Reset Password
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

export default ChangePasswordPage;

//  <Form.Item<FieldType>
//           label={
//             <Text style={styles.labelText}>
//               <Text style={{ color: 'red' }}>*</Text> Password
//             </Text>
//           }
//           name={'password'}
//           labelCol={{ span: 24 }}
//           style={{ width: '100%', marginBottom: 0 }}
//           rules={[{ required: true, message: 'Password required' }]}>
//           <AppInput
//             type="Password"
//             placeholder="Enter your password"
//             style={{ width: '100%' }}
//           />
//         </Form.Item>

//         <Form.Item<FieldType>
//           label={
//             <Text style={styles.labelText}>
//               <Text style={{ color: 'red' }}>*</Text> Confirm Password
//             </Text>
//           }
//           name={'confirmPassword'}
//           dependencies={['password']}
//           labelCol={{ span: 24 }}
//           style={{ width: '100%', marginBottom: 16 }}
//           rules={[
//             { required: true, message: 'Confirm your password' },
//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 if (!value || getFieldValue('password') === value) {
//                   return Promise.resolve();
//                 }
//                 return Promise.reject(new Error('Passwords do not match'));
//               },
//             }),
//           ]}>
//           <AppInput
//             type="Password"
//             placeholder="Confirm your password"
//             style={{ width: '100%' }}
//           />
//         </Form.Item>
