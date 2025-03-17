'use client';
import React from 'react';
import { Button, Card, Form, Input } from 'antd';
import Image from 'next/image';
import logo from '../../../../public/images/logo.png';
import { Text, View } from 'react-native-web';
import Link from 'next/link';
import Icon from '@components/icons';
import { useRouter } from 'next/navigation';
import { AppButton, AppInput } from '@components';
import styles from './styles';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@utils';
import { useAppDispatch } from '@redux';
import { authAction } from '~mdAuth/redux';

type FieldType = {
  email: string;
};

const SignUpPage = () => {
  const [form] = Form.useForm<FieldType>();
  const router = useRouter();
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
              // dispatch(authAction.register(data));
              router.push(`signup/createAccount?email=${data.email}`);
            }}
            layout="vertical"
            form={form}>
            <Form.Item<FieldType>
              name={'email'}
              rules={[{ required: true, message: 'Email required' }]}>
              <AppInput placeholder="Enter Email" />
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
