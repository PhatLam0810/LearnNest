'use client';
import React from 'react';
import { View, Text } from 'react-native-web';
import { Form } from 'antd';
import { AppButton, AppInput } from '@components';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction, authQuery } from '~mdAuth/redux';
import { messageApi } from '@hooks';
import styles from './styles';

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [form] = Form.useForm();
  const [changePassword] = authQuery.useChangePasswordMutation();

  const handleChangePassword = async (value: any) => {
    try {
      dispatch(authAction.setIsShowLoading(true));
      const response = await changePassword(value);

      if (response.data) {
        messageApi.success('Đổi mật khẩu thành công');
        form.resetFields();
      } else {
        messageApi.error('Mật khẩu không đúng');
      }
    } catch (error) {
      console.error('Lỗi gửi OTP:', error);
      messageApi.error('Mật khẩu không đúng');
    } finally {
      dispatch(authAction.setIsShowLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>
      <Text style={styles.hint}>
        Mật khẩu mới cần ít nhất 8 ký tự, gồm chữ và số.
      </Text>
      <Form
        form={form}
        style={styles.formContainer}
        initialValues={userProfile}
        onFinish={values => handleChangePassword(values)}>
        <Form.Item
          label={<Text style={styles.labelText}>Mật khẩu hiện tại</Text>}
          name="password"
          labelCol={{ span: 24 }}
          style={styles.fullField}
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}>
          <AppInput
            type="Password"
            placeholder="Nhập mật khẩu hiện tại"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <View style={styles.fieldGrid}>
          <Form.Item
            label={<Text style={styles.labelText}>Mật khẩu mới</Text>}
            name="newPassword"
            labelCol={{ span: 24 }}
            style={styles.fieldItem}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}>
            <AppInput
              type="Password"
              placeholder="Nhập mật khẩu mới"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label={<Text style={styles.labelText}>Nhập lại mật khẩu mới</Text>}
            name="confirmPassword"
            labelCol={{ span: 24 }}
            style={styles.fieldItem}
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không trùng nhau'));
                },
              }),
            ]}>
            <AppInput
              type="Password"
              placeholder="Nhập lại mật khẩu mới"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </View>
        <View style={styles.actionsRow}>
          <AppButton htmlType="submit" style={styles.saveButton}>
            Cập nhật mật khẩu
          </AppButton>
        </View>
      </Form>
    </View>
  );
};

export default ChangePassword;
