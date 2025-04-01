'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Avatar, Button, Card, Form, Upload } from 'antd';
import { CameraOutlined, UserOutlined } from '@ant-design/icons';
import styles from './styles';
import { AppButton, AppInput, AppUploadToServer } from '@components';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction, authQuery } from '~mdAuth/redux';
import './styles.css';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector(state => state.authReducer.tokenInfo);
  const [form] = Form.useForm();
  return (
    <Card style={styles.container}>
      <View style={{ flex: 1 }}>
        <Form
          form={form}
          style={styles.formContainer}
          initialValues={userProfile}
          onFinish={values => {
            dispatch(authAction.changePassword(values));
            form.resetFields();
          }}>
          <View style={styles.formItemLayout}>
            <Form.Item
              label={<Text style={styles.labelText}>Old Password </Text>}
              name={'password'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', margin: 0 }} // Đảm bảo Form.Item full width
              rules={[{ required: true, message: 'OldPassword required' }]}>
              <AppInput type="Password" placeholder="Old password" />
            </Form.Item>

            <Form.Item
              label={<Text style={styles.labelText}>New Password </Text>}
              name={'newPassword'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', margin: 0 }} // Đảm bảo Form.Item full width
              rules={[{ required: true, message: 'Password required' }]}>
              <AppInput type="Password" placeholder="New password" />
            </Form.Item>
            <Form.Item
              label={<Text style={styles.labelText}>Confirm Password </Text>}
              name={'confirmPassword'}
              labelCol={{ span: 24 }}
              style={{ width: '100%', margin: 0 }} // Đảm bảo Form.Item full width
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}>
              <AppInput type="Password" placeholder="Confirm your password" />
            </Form.Item>
          </View>
          {/* Nút lưu */}
          <Button type="primary" htmlType="submit" style={styles.saveButton}>
            Change Password
          </Button>
        </Form>
      </View>
    </Card>
  );
};

export default ChangePassword;
