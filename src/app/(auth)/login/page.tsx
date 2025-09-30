'use client';
import React, { useEffect } from 'react';
import { Card, Form } from 'antd';
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

  const handleLoginOauth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      dispatch(authAction.loginOAuth({ token }));
      router.push('/dashboard/home');
    } catch (error) {
      console.error('Login Error:', error);
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

  return (
    <View style={styles.pageWrapper}>
      <Card style={containerStyle}>
        <View style={{ flex: 1 }}>
          {/* <Image
          src={logo}
          style={{ width: '100%', height: 200, objectFit: 'contain' }}
          alt=""
        /> */}
          <View style={styles.subContainer}>
            <Text
              style={isMobile ? typography.titleMMobile : typography.titleM}>
              Sign In
            </Text>
            <Text style={styles.subDescription}>
              Sign into your account - accessall of your lessons now.
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
                email: signUpInfo?.userProfile?.email || 'adminvhu@gmail.com',
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
                rules={[{ required: true, message: 'Email required' }]}>
                <AppInput
                  placeholder="Enter your email"
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
                initialValue={'Lamphat@081020'} // Giả sử bạn muốn đặt một giá trị mặc định
                labelCol={{ span: 24 }} // Đặt label chiếm toàn bộ hàng
                style={{ width: '100%', marginBottom: 16 }} // Đảm bảo Form.Item full width
                rules={[{ required: true, message: 'Password error' }]}>
                <AppInput
                  type="Password"
                  placeholder="Enter your password"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item<FieldType> shouldUpdate>
                {({ getFieldsValue }) => {
                  const { email, password } = getFieldsValue();
                  return (
                    <AppButton
                      type="primary"
                      disabled={!email || !password}
                      htmlType="submit">
                      Sign In
                    </AppButton>
                  );
                }}
              </Form.Item>
              <View style={styles.driverContainer}>
                <View style={styles.driver}></View>
                <Text style={styles.driverText}>or</Text>
                <View style={styles.driver}></View>
              </View>
              <AppButton onClick={handleLoginOauth}>
                <Icon name="google" />
                Sign in with Google
              </AppButton>
            </Form>
          </View>
          <View style={styles.footer}>
            <Text>Don’t have an account? </Text>
            <Link href={`/signup`}>Sign Up</Link>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default LoginPage;
