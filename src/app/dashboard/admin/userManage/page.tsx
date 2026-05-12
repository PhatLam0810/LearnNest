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
} from 'antd';
import { messageApi, useAppPagination } from '@hooks';
import { UserItem } from '~mdDashboard/types';
import { adminQuery } from '~mdAdmin/redux';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAppSelector } from '@redux';
import { CreateUserParams } from '~mdAdmin/redux/RTKQuery/type';
const UserManage = () => {
  const { listItem, currentData, refresh } = useAppPagination<UserItem>({
    apiUrl: 'user/getListUser',
  });
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [getUserInfoById, { data: userInfo }] =
    adminQuery.useGetUserInfoByIdMutation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    if (userInfo) {
      setIsModalOpen(true);
    }
  }, [userInfo]);
  const [isModalCreateUserOpen, setIsModalCreateUserOpen] = useState(false);
  const [createUserForm] = Form.useForm<CreateUserParams>();

  const [setAdminRole, { isLoading: isLoadingSetRole }] =
    adminQuery.useSetAdminRoleMutation();
  const [deleteAdminRole, { isLoading: isLoadingDeleteRole }] =
    adminQuery.useDeleteAdminRoleMutation();
  const [createUser, { isLoading: isLoadingCreateUser }] =
    adminQuery.useCreateUserMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const handleSetAdminRole = async (userId: string, role: number) => {
    try {
      await setAdminRole({
        userId,
        role,
      });
      refresh();
      messageApi.success('Cập nhật role thành công');
    } catch (error) {
      messageApi.error('Cập nhật role thất bại');
    }
  };

  const handleDeleteAdminRole = async (_id: string, roleId: string) => {
    try {
      await deleteAdminRole({
        _id,
        roleId,
      });
      refresh();
      messageApi.success('Cập nhật role thành công');
    } catch (error) {
      messageApi.error('Cập nhật role thất bại');
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
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (value: string) => (
        <Avatar
          src={value}
          size={48}
          icon={<UserOutlined />}
          style={{
            borderWidth: 1,
            borderColor: '#000',
            backgroundColor: 'var(--color-vhu-primary)',
          }}
        />
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (record: any) => <Text>{record ? record?.name : 'User'}</Text>,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Student ID ',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Date Created',
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
          {record.role?.level === 1 ? null : (
            <View>
              {record.role?.level ? (
                <Button
                  danger
                  loading={isLoadingDeleteRole}
                  onClick={() =>
                    handleDeleteAdminRole(record._id, record.role._id)
                  }>
                  Remove Admin
                </Button>
              ) : (
                <Button
                  type="primary"
                  loading={isLoadingSetRole}
                  onClick={() => handleSetAdminRole(record._id, 2)}>
                  Set Admin
                </Button>
              )}
            </View>
          )}
        </Space>
      ),
    },
  ];
  return (
    <View style={styles.container}>
      {contextHolder}
      <Button type="primary" onClick={() => setIsModalCreateUserOpen(true)}>
        Add User Account
      </Button>
      <Table
        columns={columns}
        dataSource={listItem}
        rowKey={record => record._id}
        pagination={{
          current: currentData?.pageNum,
          pageSize: currentData?.pageSize,
          total: currentData?.totalRecords,
        }}
      />

      {/* Modal hiện thông tin user */}
      <Modal
        title="User Info"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}>
        {userInfo && (
          <Space direction="vertical" size="middle">
            <Avatar
              src={userInfo?.avatar}
              size={100}
              icon={<UserOutlined />}
              style={{
                borderWidth: 1,
                borderColor: '#000',
                backgroundColor: 'var(--color-vhu-primary)',
              }}
            />

            <Text>
              <b>ID:</b> {userInfo._id}
            </Text>
            <Text>
              <b>Username:</b> {userInfo.username}
            </Text>
            <Text>
              <b>Full Name:</b> {userInfo.fullName}
            </Text>
            <Text>
              <b>Student ID:</b> {userInfo.studentId}
            </Text>
            <Text>
              <b>Email:</b> {userInfo.email}
            </Text>
          </Space>
        )}
      </Modal>
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
    </View>
  );
};

export default UserManage;
