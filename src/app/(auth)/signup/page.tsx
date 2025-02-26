'use client';
import React from 'react';
import './styles.css';
import { Button, Card, Form, Input } from 'antd';
import { useAppDispatch } from '@redux';
import Image from 'next/image';
import logo from '../../../../public/images/logo.png';
import { Text, View } from 'react-native-web';
import Link from 'next/link';
import Icon from '@components/icons';
import { useRouter } from 'next/navigation';

type FieldType = {
  email: string;
};

const SignUpPage = () => {
  const [form] = Form.useForm<FieldType>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 20,
      }}>
      <View style={{ flex: 0.5, height: '100%' }}>
        <Card style={{ height: '100%' }}>
          <Image
            src={logo}
            style={{ width: '100%', height: 200, objectFit: 'contain' }}
            alt=""
          />
          <h4 className="text-heading"> Sign Up</h4>
          <h5 className="subText-heading">
            Access thousands of free lessons today.
          </h5>
          <Form<FieldType>
            name="signUp"
            onFinish={data => {
              // dispatch(authAction.register(data));
              router.push('signup/createAccount');
            }}
            layout="vertical"
            form={form}>
            <Form.Item<FieldType>
              label={
                <>
                  <span>Email</span>
                </>
              }
              name={'email'}
              rules={[{ required: true, message: 'Username required' }]}>
              <Input style={{ padding: 16 }} />
            </Form.Item>

            <Form.Item shouldUpdate>
              {({ getFieldsValue }) => {
                const { email } = getFieldsValue();
                return (
                  <Button
                    className="signup-button"
                    disabled={!email}
                    htmlType="submit">
                    Continue with Email
                  </Button>
                );
              }}
            </Form.Item>
            <button type="button" className="login-with-google-btn">
              <Icon name="google" />
              Sign in with Google
            </button>
            <button type="button" className="login-with-google-btn">
              <Icon name="apple" />
              Sign in with Apple
            </button>
          </Form>
          <View
            style={{
              marginTop: 16,
              flexDirection: 'row',
            }}>
            <Link href={`/login`}>Back to Login</Link>
          </View>
        </Card>
      </View>
      <View style={{ flex: 1, height: '100%' }}>
        <Card style={{ flex: 1 }}></Card>
      </View>
    </View>
  );
};

export default SignUpPage;
