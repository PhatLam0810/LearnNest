'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Avatar, Button, Card, Form, Modal, Upload } from 'antd';
import { CameraOutlined, UserOutlined } from '@ant-design/icons';
import styles from './styles';
import { AppButton, AppInput, AppUploadToServer } from '@components';
import { useAppDispatch, useAppSelector } from '@redux';
import { authAction, authQuery } from '~mdAuth/redux';
import './styles.css';
import { useRouter } from 'next/navigation';

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [deleteAccount] = authQuery.useDeleteAccountMutation();
  const [avatar, setAvatar] = useState(userProfile?.avatar);
  const router = useRouter();
  const [modelDelete, setModalDelete] = useState(false);

  const onCloseDelete = () => {
    setModalDelete(false);
  };
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
                  <Avatar
                    src={avatar}
                    size={100}
                    icon={<UserOutlined />}
                    style={{
                      borderWidth: 1,
                      borderColor: '#000',
                      backgroundColor: '#ef405c',
                    }}
                  />
                  <View style={styles.cameraWrap}>
                    <CameraOutlined />
                  </View>
                </View>
              </AppUploadToServer>
            </Form.Item>
            <Form.Item
              label={<Text style={styles.labelText}>First Name</Text>}
              name="firstName"
              labelCol={{ span: 24 }} // Đặt label chiếm toàn bộ hàng
              style={{ width: '100%', margin: 0 }} // Đảm bảo Form.Item full width
            >
              <AppInput placeholder="First Name" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={<Text style={styles.labelText}>Last Name</Text>}
              name="lastName"
              labelCol={{ span: 24 }} // Đặt label chiếm toàn bộ hàng
              style={{ width: '100%', margin: 0 }} // Đảm bảo Form.Item full width
            >
              <AppInput placeholder="Last Name" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={<Text style={styles.labelText}>User Name</Text>}
              name="username"
              labelCol={{ span: 24 }} // Đặt label chiếm toàn bộ hàng
              style={{ width: '100%', margin: 0 }} // Đảm bảo Form.Item full width
            >
              <AppInput placeholder="Username" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={<Text style={styles.labelText}>Bio Name</Text>}
              name="bio"
              labelCol={{ span: 24 }} // Đặt label chiếm toàn bộ hàng
              style={{ width: '100%', margin: 0 }} // Đảm bảo Form.Item full width
            >
              <AppInput
                style={{ flex: 1, minHeight: '150px', width: '100%' }}
                type="TextArea"
                placeholder="Enter a bio (max 250 chars.)"
              />
            </Form.Item>
            <View style={styles.buttonDeleteContainer}>
              <Button
                onClick={() => {
                  setModalDelete(true);
                }}
                style={styles.buttonDelete}>
                Delete Account
              </Button>
            </View>
          </View>
          {/* Nút lưu */}
          <Button type="primary" htmlType="submit" style={styles.saveButton}>
            Save Profile
          </Button>
        </Form>
      </View>
      <Modal
        title="Delete Lesson"
        open={modelDelete}
        onCancel={onCloseDelete}
        onClose={onCloseDelete}
        onOk={() => {
          deleteAccount({ Userid: userProfile._id })
            .unwrap()
            .then(res => {
              router.replace('/login');
            });
        }}>
        <Text>Do you want delete this account ?</Text>
      </Modal>
    </Card>
  );
};

export default EditProfile;
