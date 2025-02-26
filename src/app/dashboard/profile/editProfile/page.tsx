'use client';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native-web';
import { Avatar, Form, Upload } from 'antd';
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
    <View style={styles.container}>
      <Form
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
        initialValues={userProfile}
        onFinish={values => dispatch(authAction.updateCurrentInfo(values))}>
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
          <AppInput style={{ flex: 1 }} type="TextArea" placeholder="Bio" />
        </Form.Item>

        {/* Nút lưu */}
        <AppButton type="primary" htmlType="submit">
          Save Profile
        </AppButton>
      </Form>
    </View>
  );
};

export default EditProfile;
