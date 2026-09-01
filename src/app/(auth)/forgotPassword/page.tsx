'use client';
import { Card, Form, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Text, View } from 'react-native-web';
import { AppButton, AppInput } from '@components';
import { useAppDispatch } from '@redux';
import { authAction, authQuery } from '~mdAuth/redux';
import styles from './styles';
import { useResponsive } from '@/styles/responsive';
import { typography } from '@/styles/typography';

type FieldType = {
  email: string;
};

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<FieldType>();
  const [sendOtp] = authQuery.useSendOtpMutation();

  const handleSendOtp = async (email: string) => {
    try {
      dispatch(authAction.setIsShowLoading(true));
      const response = await sendOtp({ email, type: 2 });
      if (response.data) {
        dispatch(authAction.sendOtpInfo({ email }));
        router.push('forgotPassword/changePassword');
      }
    } catch (error: any) {
      console.error('Lỗi gửi OTP:', error);
      messageApi.error(error.message || 'Gửi OTP thất bại.');
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

  const layoutStyle =
    isMobile || isTablet ? styles.layoutStacked : styles.layoutDesktop;

  return (
    <View style={styles.pageWrapper}>
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
              Đừng lo, chuyện này thường xảy ra thôi. Nhập email để chúng tôi
              giúp bạn lấy lại mật khẩu.
            </Text>
          </View>
        )}
        <Card style={containerStyle}>
          {contextHolder}
          <View>
            <Link href="/login" className="auth-back-btn">
              <ArrowLeftOutlined /> Quay lại đăng nhập
            </Link>
            <View style={styles.subContainer}>
              <Text
                style={isMobile ? typography.titleMMobile : typography.titleM}>
                Quên mật khẩu
              </Text>
              <Text
                style={isMobile ? typography.body2Mobile : typography.body2}>
                Nhập địa chỉ email của bạn, chúng tôi sẽ gửi mã OTP để đặt lại
                mật khẩu
              </Text>
            </View>

            <Form<FieldType>
              name="forgotPasswordForm"
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
                      style={styles.primaryButton}
                      htmlType="submit">
                      Tiếp tục xác minh
                    </AppButton>
                  );
                }}
              </Form.Item>
            </Form>
          </View>
        </Card>
      </View>
    </View>
  );
};

export default ForgotPasswordPage;
