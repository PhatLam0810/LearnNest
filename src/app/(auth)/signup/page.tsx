'use client';
import { useState } from 'react';
import { Card, Form, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Text, View } from 'react-native-web';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@components/icons';
import { useRouter } from 'next/navigation';
import { AppButton, AppInput } from '@components';
import styles from './styles';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@utils';
import { useAppDispatch } from '@redux';
import { authAction, authQuery } from '~mdAuth/redux';
import { useResponsive } from '@/styles/responsive';
import typography from '@/styles/typography';

type FieldType = {
  email: string;
};

const SignUpPage = () => {
  const [form] = Form.useForm<FieldType>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sendOtp] = authQuery.useSendOtpMutation();
  const [messageApi, contextHolder] = message.useMessage();
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
    } catch (error) {
      console.error('Login Error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendOtp = async (email: string) => {
    try {
      dispatch(authAction.setIsShowLoading(true));
      const response = await sendOtp({ email, type: 0 });
      if (response.data) {
        dispatch(authAction.sendOtpInfo({ email }));
        router.push('signup/createAccount');
      }
    } catch (error: any) {
      console.error('Lỗi gửi OTP:', error);
      messageApi.error(error.message || 'Failed to send OTP.');
    } finally {
      dispatch(authAction.setIsShowLoading(false));
    }
  };

  const { isMobile, isTablet } = useResponsive();
  const containerStyle = isMobile
    ? styles.containerMobile
    : isTablet
      ? styles.containerTablet
      : styles.containerDesktop;

  return (
    <View style={styles.pageWrapper}>
      <View
        style={
          isMobile || isTablet ? styles.layoutStacked : styles.layoutDesktop
        }>
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
              Tham gia miễn phí, học và luyện tập MOS - CNTT - AI đúng lộ trình
              ngay hôm nay.
            </Text>
          </View>
        )}
        <Card style={containerStyle}>
          {contextHolder}
          <View>
            <Link href="/" className="auth-back-btn">
              <ArrowLeftOutlined /> Trang chủ
            </Link>
            <div className="auth-steps">
              <span className="auth-steps__label">Bước 1/2</span>
              <span className="auth-steps__dot auth-steps__dot--active" />
              <span className="auth-steps__dot" />
            </div>
            <View style={styles.subContainer}>
              <Text
                style={isMobile ? typography.titleMMobile : typography.titleM}>
                Đăng ký
              </Text>
              <Text
                style={isMobile ? typography.body2Mobile : typography.body2}>
                Truy cập hàng nghìn bài học miễn phí ngay hôm nay.
              </Text>
            </View>

            <Form<FieldType>
              name="signUp"
              onFinish={data => handleSendOtp(data.email)}
              layout="vertical"
              requiredMark={false}
              form={form}>
              <Form.Item<FieldType>
                label={
                  <Text style={styles.labelText}>
                    <Text style={{ color: 'red' }}>*</Text> Email
                  </Text>
                }
                name={'email'}
                labelCol={{ span: 24 }}
                style={{ width: '100%', marginBottom: 16 }}
                rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                <AppInput
                  prefix={<MailOutlined style={{ color: '#9aa5b8' }} />}
                  placeholder="Nhập email của bạn"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item<FieldType> shouldUpdate>
                {({ getFieldsValue }) => {
                  const { email } = getFieldsValue();
                  return (
                    <AppButton
                      type="primary"
                      disabled={!email}
                      htmlType="submit"
                      style={styles.primaryButton}>
                      Tiếp tục với Email
                    </AppButton>
                  );
                }}
              </Form.Item>

              <View style={styles.driverContainer}>
                <View style={styles.driver}></View>
                <Text style={styles.driverText}>hoặc</Text>
                <View style={styles.driver}></View>
              </View>

              <View style={styles.btnContainer}>
                <AppButton
                  onClick={handleLoginOauth}
                  disabled={isGoogleLoading}
                  style={styles.googleButton}>
                  <Icon name="google" />
                  Đăng nhập bằng Google
                </AppButton>
              </View>
            </Form>

            <View style={styles.footer}>
              <Text>Đã có tài khoản? </Text>
              <Link href={`/login`}>Đăng nhập</Link>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
};

export default SignUpPage;
