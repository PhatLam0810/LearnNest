'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import {
  Space,
  Table,
  TableProps,
  Modal,
  Avatar,
  message,
  Button,
  Form,
  InputNumber,
  Input,
  App,
  Card,
} from 'antd';
import { messageApi, useAppPagination } from '@hooks';
import { UserItem } from '~mdDashboard/types';
import { adminQuery } from '~mdAdmin/redux';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAppSelector } from '@redux';
import { CreateUserParams } from '~mdAdmin/redux/RTKQuery/type';
import { authQuery } from '~mdAuth/redux/RTKQuery';
import { userInfo } from 'os';
const UserManage = () => {
  const { listItem, currentData, refresh, search, fetchData } =
    useAppPagination<UserItem>({
      apiUrl: 'user/getListUser',
    });
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const { modal } = App.useApp();
  const [isModalCreateUserOpen, setIsModalCreateUserOpen] = useState(false);
  const [createUserForm] = Form.useForm<CreateUserParams>();
  const [isModalDeleteUser, setModalDeleteUser] = useState(false);
  const [infoUser, setInfoUser] = useState<UserItem>(null);
  const [deleteAccount] = authQuery.useDeleteAccountMutation();
  const { Search } = Input;
  const [createUser, { isLoading: isLoadingCreateUser }] =
    adminQuery.useCreateUserMutation();
  const [messageApi, contextHolder] = message.useMessage();
  console.log('listItem', listItem, 'currentData', currentData);
  const handleDeleteUser = async (_id: string) => {
    try {
      await deleteAccount({
        Userid: _id,
      });
      messageApi.success('Xóa tài khoản thành công');
      refresh();
    } catch (error) {
      messageApi.error('Xóa tài khoản thất bại');
    }
  };
  const handleCreateUser = async (value: CreateUserParams) => {
    try {
      await createUser(value).unwrap();
      refresh();
      setIsModalCreateUserOpen(false);
      messageApi.success('Tạo user thành công thành công');
    } catch (error) {
      messageApi.error(error?.data?.message);
    }
  };
  const columns: TableProps<UserItem>['columns'] = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Khoa',
      dataIndex: 'faculty',
      key: 'faculty',
    },
    {
      title: 'Ngành',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => (
        <Text>{dayjs(value).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      key: 'action',
      render: (record: UserItem) => (
        <Space>
          <Button
            danger
            onClick={() => {
              setInfoUser(record);
              setModalDeleteUser(true);
            }}>
            Xóa Tài khoản
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <View style={styles.container}>
      {contextHolder}
      <Card
        style={{
          width: 280,
          padding: 24,
          borderRadius: 16,
          marginBottom: 16,
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
        }}>
        <Text
          style={{
            display: 'block',
            fontSize: 14,
            color: '#6b7280',
            marginBottom: 8,
          }}>
          Tổng số học viên
        </Text>
        <Text style={{ fontSize: 36, fontWeight: 700, color: '#111827' }}>
          {currentData?.totalRecords}
        </Text>
      </Card>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
        <Search
          placeholder="Input search text"
          onSearch={search}
          style={{ width: '100%' }}
        />
        <Button type="primary" onClick={() => setIsModalCreateUserOpen(true)}>
          Add User Account
        </Button>
      </View>
      <Table
        columns={columns}
        dataSource={listItem}
        rowKey={record => record._id}
        scroll={{ x: 'max-content' }}
        onChange={res => {
          fetchData({ pageNum: res.current });
        }}
        pagination={{
          current: currentData?.pageNum,
          pageSize: currentData?.pageSize,
          total: currentData?.totalRecords,
        }}
      />

      {/* Modal hiện thông tin user */}

      <Modal
        title="Add User Account"
        open={isModalCreateUserOpen}
        onCancel={() => setIsModalCreateUserOpen(false)}
        onOk={() => handleCreateUser(createUserForm.getFieldsValue())}
        confirmLoading={isLoadingCreateUser}>
        <Form form={createUserForm} layout="vertical">
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: 'Nhập họ và tên',
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Nhập email',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã sinh viên"
            name="studentId"
            rules={[
              {
                required: true,
                message: 'Nhập mã sinh viên',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Nhập password',
              },
            ]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xác nhận xóa tài khoản"
        open={isModalDeleteUser}
        onCancel={() => setModalDeleteUser(false)}
        // Thay footer={null} bằng các nút hành động
        footer={[
          <Button key="cancel" onClick={() => setModalDeleteUser(false)}>
            Hủy
          </Button>,
          <Button
            key="delete"
            danger
            type="primary"
            onClick={async () => {
              await handleDeleteUser(infoUser._id);
              setModalDeleteUser(false);
            }}>
            Xóa tài khoản
          </Button>,
        ]}>
        <div style={{ textAlign: 'center' }}>
          <p>Bạn có chắc chắn muốn xóa người dùng sau không?</p>
          <Space
            direction="vertical"
            size="small"
            style={{ width: '100%', alignItems: 'center' }}>
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
              <Text>
                <b>Họ tên:</b> {infoUser?.fullName}
              </Text>
              <br />
              <Text>
                <b>MSSV:</b> {infoUser?.studentId}
              </Text>
              <br />
              <Text>
                <b>Email:</b> {infoUser?.email}
              </Text>
            </div>
          </Space>
        </div>
      </Modal>
    </View>
  );
};

export default UserManage;
