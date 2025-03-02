'use client';
import React from 'react';
import { Card, Form } from 'antd';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@utils';
import { useAppDispatch } from '@redux';
import { authAction } from '~mdAuth/redux';
import Icon from '@components/icons';
import logo from '../../../../public/images/logo.png';
import Image from 'next/image';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { AppButton, AppInput } from '@components';

type FieldType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [form] = Form.useForm<FieldType>();
  const dispatch = useAppDispatch();

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

  return (
    <Card style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* <Image
          src={logo}
          style={{ width: '100%', height: 200, objectFit: 'contain' }}
          alt=""
        /> */}

        <Text style={styles.subTitle}>
          Sign into your account - accessall of your lessons now.
        </Text>
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
              email: 'lamtanphat@gmail.com',
              password: '#1Foryogapaloozaapp',
            }}
            form={form}>
            <Form.Item<FieldType>
              name={'email'}
              rules={[{ required: true, message: 'Email required' }]}>
              <AppInput placeholder="yogapaloozaapp@gmail.com" />
            </Form.Item>
            <Form.Item<FieldType>
              name={'password'}
              rules={[{ required: true, message: 'Password error' }]}>
              <AppInput type="Password" placeholder="Enter your password" />
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
  );
};

export default LoginPage;
