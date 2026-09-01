'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, Form } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@utils';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import Icon from '@components/icons';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { AppButton, AppInput } from '@components';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/styles/responsive';
import typography from '@/styles/typography';

type FieldType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm<FieldType>();
  const dispatch = useAppDispatch();
  const { signUpInfo } = useAppSelector(state => state.authReducer);
  const accessToken = useAppSelector(state => state.authReducer.tokenInfo);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const handleLoginOauth = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      dispatch(authAction.loginOAuth({ token }));
      router.push('/dashboard/home');
    } catch (error) {
      console.error('Login Error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      router.push('/dashboard/home');
    }
  }, [accessToken]);

  const { isMobile, isTablet } = useResponsive();

  const containerStyle = isMobile
    ? styles.containerMobile
    : isTablet
      ? styles.containerTablet
      : styles.containerDesktop;

  const layoutStyle = isMobile
    ? styles.layoutMobile
    : isTablet
      ? styles.layoutTablet
      : styles.layoutDesktop;

  return (
    <View style={styles.pageWrapper}>
      <Link href="/" style={styles.backLink}>
        ← Trang chủ
      </Link>
      <View style={layoutStyle}>
        {!isMobile && !isTablet && (
          <View style={styles.heroDesktop}>
            <Image
              src="/images/LogoVhu.png"
              alt="LearnNest"
              width={56}
              height={56}
              style={styles.heroLogo}
            />
            <Text style={styles.heroTitle}>LearnNest</Text>
            <Text style={styles.heroSlogan}>
              Học thông minh hơn, tiến bộ nhanh hơn — Cá nhân hóa hành trình học
              tập của bạn.
            </Text>
          </View>
        )}
        <Card
          variant={!isMobile ? 'outlined' : 'borderless'}
          style={containerStyle}
          styles={{ body: { padding: isMobile ? 10 : 16 } }}>
          <View style={styles.formWrapper}>
            <View style={styles.subContainer}>
              <Text
                style={isMobile ? typography.titleMMobile : typography.titleM}>
                Đăng nhập
              </Text>
              <Text style={styles.subDescription}>
                Đăng nhập vào tài khoản của bạn — truy cập toàn bộ bài học ngay.
              </Text>
            </View>
            <View style={{ overflow: 'hidden' }}>
              <Form<FieldType>
                name="login"
                onFinish={data => {
                  dispatch(authAction.login(data));
                }}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
                initialValues={{
                  email: signUpInfo?.userProfile?.email || '',
                }}
                form={form}>
                {/* <Form.Item<FieldType>
              name={'email'}
              rules={[{ required: true, message: 'Email required' }]}>
              <AppInput placeholder="Enter your email" />
            </Form.Item> */}
                <Form.Item<FieldType>
                  label={
                    <Text style={styles.labelText}>
                      <Text style={{ color: 'red' }}>*</Text> Email
                    </Text>
                  }
                  name={'email'}
                  labelCol={{ span: 24 }} // Đặt label chiếm toàn bộ hàng
                  style={{ width: '100%', marginBottom: 16 }} // Đảm bảo Form.Item full width
                  rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                  <AppInput
                    prefix={<MailOutlined style={{ color: '#9aa5b8' }} />}
                    placeholder="Nhập email của bạn"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  label={
                    <Text style={styles.labelText}>
                      <Text style={{ color: 'red' }}>*</Text> Mật khẩu
                    </Text>
                  }
                  name={'password'}
                  labelCol={{ span: 24 }}
                  style={{ width: '100%', marginBottom: 16 }}
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                  ]}>
                  <AppInput
                    type="Password"
                    prefix={<LockOutlined style={{ color: '#9aa5b8' }} />}
                    placeholder="Nhập mật khẩu của bạn"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <View style={styles.forgotWrapper}>
                  <Text
                    style={styles.forgotTitle}
                    onPress={() => router.push('/forgotPassword')}>
                    Quên mật khẩu?
                  </Text>
                </View>
                <Form.Item<FieldType> shouldUpdate style={{ marginBottom: 12 }}>
                  {({ getFieldsValue }) => {
                    const { email, password } = getFieldsValue();
                    return (
                      <AppButton
                        type="primary"
                        aria-label="Đăng nhập vào tài khoản của bạn"
                        style={styles.primaryButton}
                        disabled={!email || !password}
                        htmlType="submit">
                        Đăng nhập
                      </AppButton>
                    );
                  }}
                </Form.Item>

                <AppButton
                  aria-label="Đăng nhập bằng Google"
                  onClick={handleLoginOauth}
                  disabled={isGoogleLoading}
                  style={styles.googleButton}>
                  <Icon name="google" />
                  Đăng nhập bằng Google
                </AppButton>
              </Form>
            </View>
            <View style={styles.footer}>
              <Text>Chưa có tài khoản? </Text>
              <Link href={`/signup`}>Đăng ký</Link>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
};

export default LoginPage;
