import React, { useEffect } from 'react';
import { Modal, Input, Button, Form } from 'antd';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { authQuery } from '~mdAuth/redux';
import { messageApi } from '@hooks';
import { error } from 'console';

type VerifyOtpModalProps = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  email: string;
};

const VerifyOtpModal: React.FC<VerifyOtpModalProps> = ({
  email,
  isVisible,
  setIsVisible,
}) => {
  const [form] = Form.useForm();
  const [verifyOtp, { isError, isSuccess, data }] =
    authQuery.useVerifyTransactionOtpMutation();

  const onClose = () => {
    setIsVisible(false);
    form.resetFields(); // Reset form khi đóng modal
  };

  const onFinish = (values: { otp: number }) => {
    console.log({ email, otp: values.otp });
    verifyOtp({ email: email, otp: values.otp });

    console.log(isError);
    console.log(data);
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}>
      <View style={styles.modalContainer}>
        {/* Header */}
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.description}>
          Enter the OTP code we just sent to your email{' '}
          <Text style={styles.email}>{email}</Text> to verify.
        </Text>

        {/* Form */}
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label={<Text style={styles.label}>OTP Code</Text>}
            name="otp"
            rules={[
              { required: true, message: 'Please enter your OTP code' },
              { min: 6, message: 'OTP must be at least 6 characters' },
            ]}>
            <Input
              placeholder="Enter your OTP code"
              maxLength={6}
              style={styles.input}
            />
          </Form.Item>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button onClick={onClose} style={styles.cancelButton}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={styles.verifyButton}
              // icon={<PlusOutlined />}
              // onClick={() => setIsVisibleModalAdd(true)}
            >
              Verify
            </Button>
          </View>
        </Form>
      </View>
    </Modal>
  );
};

export default VerifyOtpModal;
