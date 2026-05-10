'use client';

import React, { useState } from 'react';
import { Card, Form } from 'antd';
import { useRouter } from 'next/navigation';
import { Text, View } from 'react-native-web';

import { AppButton, AppInput } from '@components';
import { useAppDispatch } from '@redux';
import { authAction } from '~mdAuth/redux';
import styles from './styles';
import { OtpType } from '@/constants/otp-type.enum';
type FormType = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const [form] = Form.useForm<FormType>();

  const handleSendOtp = async (values: FormType) => {
    setEmail(values.email);

    try {
      const res: any = await dispatch(
        authAction.sendOtp({
          email: values.email,
          type: OtpType.FORGOT_PASSWORD,
          onSuccess: () => setStep(2),
          onError: () => setStep(1),
        }),
      );

      if (res?.payload?.success || res?.status === 200) {
        setStep(2);
      }
    } catch (err) {
      console.log('OTP error:', err);
    }
  };
  const handleResetPassword = (values: FormType) => {
    dispatch(
      authAction.resetPassword({
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      }),
    );

    router.push('/login');
  };

  return (
    <View style={styles.pageWrapper}>
      <Card
        variant="outlined"
        style={styles.container}
        styles={{
          body: {
            padding: 16,
          },
        }}>
        <View style={styles.formWrapper}>
          <View style={styles.subContainer}>
            <Text style={styles.subTitle}>Forgot Password</Text>

            <Text style={styles.subDescription}>
              {step === 1
                ? 'Enter your email to receive OTP.'
                : 'Enter OTP and your new password.'}
            </Text>
          </View>

          <Form<FormType>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={step === 1 ? handleSendOtp : handleResetPassword}>
            {step === 1 && (
              <>
                <Form.Item
                  name="email"
                  label={<Text style={styles.labelText}>Email</Text>}
                  rules={[
                    {
                      required: true,
                      message: 'Email is required',
                    },
                    {
                      type: 'email',
                      message: 'Invalid email',
                    },
                  ]}>
                  <AppInput placeholder="Enter your email" />
                </Form.Item>

                <AppButton
                  htmlType="submit"
                  type="primary"
                  style={styles.primaryButton}>
                  Send OTP
                </AppButton>
              </>
            )}

            {step === 2 && (
              <>
                <Form.Item
                  name="otp"
                  label={<Text style={styles.labelText}>OTP</Text>}
                  rules={[
                    {
                      required: true,
                      message: 'OTP is required',
                    },
                  ]}>
                  <AppInput placeholder="Enter OTP" />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label={<Text style={styles.labelText}>New Password</Text>}
                  rules={[
                    {
                      required: true,
                      message: 'New password is required',
                    },
                  ]}>
                  <AppInput type="Password" placeholder="Enter new password" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={['newPassword']}
                  label={<Text style={styles.labelText}>Confirm Password</Text>}
                  rules={[
                    {
                      required: true,
                      message: 'Confirm password is required',
                    },

                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error('Passwords do not match'),
                        );
                      },
                    }),
                  ]}>
                  <AppInput type="Password" placeholder="Confirm password" />
                </Form.Item>

                <AppButton
                  htmlType="submit"
                  type="primary"
                  style={styles.primaryButton}>
                  Reset Password
                </AppButton>
              </>
            )}
          </Form>

          <View style={styles.footer}>
            <Text
              style={styles.backToLogin}
              onPress={() => router.push('/login')}>
              Back to Login
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default ForgotPasswordPage;
