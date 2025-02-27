'use client';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native-web';
import { Avatar, Card, Form, Upload } from 'antd';
import { CameraOutlined, UserOutlined } from '@ant-design/icons';
import styles from './styles';
import { AppButton, AppInput, AppUploadToServer } from '@components';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction } from '~mdAuth/redux';

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector(state => state.authReducer.tokenInfo);

  const [avatar, setAvatar] = useState(userProfile?.avatar);
  return (
    <Card style={styles.container}>
      <View style={{ flex: 1 }}>
        <Form
          style={styles.formContainer}
          initialValues={userProfile}
          onFinish={values => dispatch(authAction.updateCurrentInfo(values))}>
          <View style={styles.formItemLayout}>
            <Form.Item name="avatar" noStyle>
              <AppUploadToServer showUploadList={false} onChange={setAvatar}>
                <View>
                  <Avatar src={avatar} size={100} icon={<UserOutlined />} />
                  <View style={styles.cameraWrap}>
                    <CameraOutlined />
                  </View>
                </View>
              </AppUploadToServer>
            </Form.Item>
            <Form.Item name="firstName" noStyle>
              <AppInput placeholder="First Name" />
            </Form.Item>

            <Form.Item name="lastName" noStyle>
              <AppInput placeholder="Last Name" />
            </Form.Item>

            <Form.Item name="username" noStyle>
              <AppInput placeholder="Username" />
            </Form.Item>
            <Form.Item name="bio" noStyle>
              <AppInput
                style={{ flex: 1, minHeight: '150px' }}
                type="TextArea"
                maxLength={250}
                placeholder="Enter a bio (max 250 chars.)"
              />
            </Form.Item>
          </View>
          {/* Nút lưu */}
          <AppButton type="primary" htmlType="submit">
            Save Profile
          </AppButton>
        </Form>
      </View>
    </Card>
  );
};

export default EditProfile;
