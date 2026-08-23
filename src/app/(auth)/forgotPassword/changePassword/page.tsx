'use client';
import React, { useEffect, useState } from 'react';
import { Card, Form, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
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
        content: `Mã OTP đã được gửi đến ${sendOtpInfo.email}`,
        duration: 5,
      });
    }
  }, [sendOtpInfo]);

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
        messageApi.success('Đặt lại mật khẩu thành công');
        router.push('/login');
      } else {
        messageApi.error('Đặt lại mật khẩu thất bại');
      }
    });
  };

  return (
    <View style={styles.pageWrapper}>
      <Card style={containerStyle}>
        {contextHolder}
        <View>
          <AppButton
            type="text"
            icon={<ArrowLeftOutlined />}
            style={{ paddingLeft: 0, marginBottom: 8 }}
            onClick={() => router.push('/forgotPassword')}>
            Quay lại
          </AppButton>
          <View style={styles.subContainer}>
            <Text
              style={isMobile ? typography.titleMMobile : typography.titleM}>
              Đặt lại mật khẩu
            </Text>
            <Text style={isMobile ? typography.body2Mobile : typography.body2}>
              Ở bước tiếp theo, chúng tôi sẽ tìm hiểu về sở thích và kỹ năng của
              bạn.
            </Text>
            <Text style={styles.description}>
              Nhập mã OTP chúng tôi vừa gửi đến email{' '}
              <Text style={styles.email}>{sendOtpInfo?.email}</Text> để xác
              minh.
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
                  <Text style={{ color: 'red' }}>*</Text> OTP
                </Text>
              }
              name={'otp'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 0 }}
              rules={[{ required: true, message: 'Vui lòng nhập mã OTP' }]}>
              <AppInput placeholder="Nhập mã OTP" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item<resetPasswordType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Mật khẩu
                </Text>
              }
              name={'newPassword'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 0 }}
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
              <AppInput
                type="Password"
                placeholder="Nhập mật khẩu của bạn"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item<resetPasswordType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Xác nhận mật khẩu
                </Text>
              }
              name={'confirmPassword'}
              dependencies={['newPassword']}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 16 }}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Mật khẩu xác nhận không khớp'),
                    );
                  },
                }),
              ]}>
              <AppInput
                type="Password"
                placeholder="Xác nhận mật khẩu của bạn"
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
                    Đặt lại mật khẩu
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
