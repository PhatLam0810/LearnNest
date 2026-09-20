'use client';
import React, { useEffect } from 'react';
import { Card, Form } from 'antd';
import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import { Text, View } from 'react-native-web';
import Link from 'next/link';
import styles from './styles';
import { AppButton, AppInput } from '@components';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAction, authQuery } from '~mdAuth/redux';
import { useResponsive } from '@/styles/responsive';
import typography from '@/styles/typography';
import { messageApi } from '@hooks';

type FieldType = {
  otp: string;
  password: string;
  confirmPassword: string;
};

const CreateAccountPage = () => {
  const [form] = Form.useForm<FieldType>();
  const dispatch = useAppDispatch();
  const { sendOtpInfo } = useAppSelector(state => state.authReducer);
  const contextHolder = null;
  const router = useRouter();
  const [verifyOtp] = authQuery.useVerifyOtpMutation();
  const [signUp] = authQuery.useSignUpMutation();

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

  return (
    <View style={styles.pageWrapper}>
      <Card style={containerStyle}>
        {contextHolder}
        <View>
          <Link href="/signup" className="auth-back-btn">
            <ArrowLeftOutlined /> Quay lại
          </Link>
          <div className="auth-steps">
            <span className="auth-steps__label">Bước 2/2</span>
            <span className="auth-steps__dot" />
            <span className="auth-steps__dot auth-steps__dot--active" />
          </div>
          <View style={styles.subContainer}>
            <Text
              style={isMobile ? typography.titleMMobile : typography.titleM}>
              Tạo tài khoản của bạn
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

          <Form<FieldType>
            name="register"
            requiredMark={false}
            onFinish={async data => {
              if (!sendOtpInfo) return;
              messageApi?.open({
                type: 'loading',
                content: 'SignUp',
                duration: 0,
              });
              try {
                await verifyOtp({
                  email: sendOtpInfo.email,
                  otp: data.otp,
                }).unwrap();
              } catch (e: any) {
                messageApi.destroy();
                messageApi.error(e?.data?.message || 'Mã OTP không đúng');
                return;
              }
              try {
                const signUpRes = await signUp({
                  email: sendOtpInfo.email,
                  password: data.password,
                }).unwrap();
                messageApi.destroy();
                messageApi.success('SignUp successfully!');
                dispatch(authAction.setSignUpInfo(signUpRes));
                router.push('/login');
              } catch (e: any) {
                messageApi.destroy();
                messageApi.error(e?.data?.message || 'Email already exists');
              }
            }}
            layout="vertical"
            form={form}>
            <Form.Item<FieldType>
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

            <Form.Item<FieldType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Mật khẩu
                </Text>
              }
              name={'password'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 0 }}
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
              <AppInput
                type="Password"
                prefix={<LockOutlined style={{ color: '#9aa5b8' }} />}
                placeholder="Nhập mật khẩu của bạn"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={
                <Text style={styles.labelText}>
                  <Text style={{ color: 'red' }}>*</Text> Xác nhận mật khẩu
                </Text>
              }
              name={'confirmPassword'}
              dependencies={['password']}
              labelCol={{ span: 24 }}
              style={{ width: '100%', marginBottom: 16 }}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
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
                prefix={<LockOutlined style={{ color: '#9aa5b8' }} />}
                placeholder="Xác nhận mật khẩu của bạn"
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
                    style={styles.primaryButton}
                    htmlType="submit">
                    Đăng ký
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
