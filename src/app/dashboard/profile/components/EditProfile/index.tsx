'use client';
import React from 'react';
import { View, Text } from 'react-native-web';
import { Form } from 'antd';
import { AppButton, AppInput } from '@components';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';
import styles from './styles';

// Card "Thông tin cá nhân" trong trang Cài Đặt - chỉ giữ 4 trường theo
// design (Họ và tên/Email/Số điện thoại/Mã sinh viên), bỏ username/bio/
// avatar khỏi form này - avatar giờ nằm ở card hồ sơ bên sidebar.
const EditProfile = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <Form
        form={form}
        style={styles.formContainer}
        initialValues={userProfile}
        onFinish={values => dispatch(authAction.updateCurrentInfo(values))}>
        <View style={styles.fieldGrid}>
          <Form.Item
            label={<Text style={styles.labelText}>Họ và tên</Text>}
            name="fullName"
            labelCol={{ span: 24 }}
            style={styles.fieldItem}>
            <AppInput style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label={<Text style={styles.labelText}>Email</Text>}
            name="email"
            labelCol={{ span: 24 }}
            style={styles.fieldItem}>
            <AppInput disabled style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label={<Text style={styles.labelText}>Số điện thoại</Text>}
            name="phoneNumber"
            labelCol={{ span: 24 }}
            style={styles.fieldItem}>
            <AppInput style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label={<Text style={styles.labelText}>Mã sinh viên</Text>}
            name="studentId"
            labelCol={{ span: 24 }}
            style={styles.fieldItem}>
            <AppInput disabled style={{ width: '100%' }} />
          </Form.Item>
        </View>
        <View style={styles.actionsRow}>
          <AppButton
            style={styles.cancelButton}
            onClick={() => form.resetFields()}>
            Hủy
          </AppButton>
          <AppButton htmlType="submit" style={styles.saveButton}>
            Lưu thay đổi
          </AppButton>
        </View>
      </Form>
    </View>
  );
};

export default EditProfile;
