'use client';
import React from 'react';
import './styles.css';
import { Button, Card, Form, Input } from 'antd';
import { useAppDispatch } from '@redux';
import Image from 'next/image';
import { View } from 'react-native-web';
import Link from 'next/link';
import { logo } from 'public/images';

type FieldType = {
  username: string;
  password: string;
  confirmPassword: string;
};

const CreateAccountPage = () => {
  const [form] = Form.useForm<FieldType>();
  const dispatch = useAppDispatch();

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
          <h4 className="text-heading">Create your account</h4>
          <h5 className="subText-heading">
            In the next step, we’ll learn about your interests and skills.
          </h5>
          <Form<FieldType>
            name="register"
            onFinish={data => {
              // dispatch(authAction.register(data));
            }}
            layout="vertical"
            form={form}>
            <Form.Item<FieldType>
              label={
                <>
                  <span>Username</span>
                </>
              }
              name={'username'}
              rules={[{ required: true, message: 'Username required' }]}>
              <Input style={{ padding: 16 }} />
            </Form.Item>

            <Form.Item<FieldType>
              label={
                <>
                  <span>Password</span>
                </>
              }
              name={'password'}
              rules={[{ required: true, message: 'Password required' }]}>
              <Input.Password placeholder="Password" autoComplete="off" />
            </Form.Item>

            <Form.Item<FieldType>
              label={
                <>
                  <span>Confirm Password</span>
                </>
              }
              name={'confirmPassword'}
              dependencies={['password']}
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
              <Input.Password
                placeholder="Confirm Password"
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item shouldUpdate>
              {({ getFieldsValue }) => {
                const { username, password, confirmPassword } =
                  getFieldsValue();
                return (
                  <Button
                    className="login-button"
                    disabled={!username || !password || !confirmPassword}
                    htmlType="submit">
                    Create Account
                  </Button>
                );
              }}
            </Form.Item>
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

export default CreateAccountPage;
