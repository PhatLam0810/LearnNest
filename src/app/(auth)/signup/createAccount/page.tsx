'use client';
import React from 'react';
import { Button, Card, Form } from 'antd';
import { useAppDispatch } from '@redux';
import Image from 'next/image';
import { Text, View } from 'react-native-web';
import Link from 'next/link';
import { logo } from 'public/images';
import styles from './styles';
import { AppButton, AppInput } from '@components';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAction } from '~mdAuth/redux';

type FieldType = {
  username: string;
  password: string;
  confirmPassword: string;
};

const CreateAccountPage = () => {
  const [form] = Form.useForm<FieldType>();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();

  return (
    <Card style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>Create your account</Text>
          <Text style={styles.subDescription}>
            In the next step, we’ll learn about your interests and skills.
          </Text>
        </View>

        <Form<FieldType>
          name="register"
          onFinish={data => {
            dispatch(
              authAction.signUp({
                params: {
                  email: email,
                  password: data.password,
                  fullName: data.username,
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
            name={'username'}
            rules={[{ required: true, message: 'Name required' }]}>
            <AppInput placeholder="What's your name?" />
          </Form.Item>
          <Form.Item<FieldType>
            name={'password'}
            rules={[{ required: true, message: 'Password required' }]}>
            <AppInput type="Password" placeholder="Enter your password" />
          </Form.Item>
          <Form.Item<FieldType>
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
            <AppInput type="Password" placeholder="Confirm your password" />
          </Form.Item>

          <Form.Item shouldUpdate>
            {({ getFieldsValue }) => {
              const { username, password, confirmPassword } = getFieldsValue();
              return (
                <AppButton
                  type="primary"
                  disabled={!username || !password || !confirmPassword}
                  htmlType="submit">
                  Sign Up
                </AppButton>
              );
            }}
          </Form.Item>
        </Form>
      </View>
    </Card>
  );
};

export default CreateAccountPage;
