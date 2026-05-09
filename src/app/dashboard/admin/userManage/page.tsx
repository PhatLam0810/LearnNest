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
  const isAdmin = userProfile?.role?.level <= 1;
  const [isModalRoleOpen, setIsModalRoleOpen] = useState(false);

  const [roleForm] = Form.useForm();

  const [setAdminRole, { isLoading: isLoadingSetRole }] =
    adminQuery.useSetAdminRoleMutation();
  const [deleteAdminRole, { isLoading: isLoadingDeleteRole }] =
    adminQuery.useDeleteAdminRoleMutation();
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
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (value: string) => <Text>{value}</Text>,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
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
        <Text>{dayjs(value).format('DD/MM/YYYY HH:mm')}</Text>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: UserItem) => (
        <Space>
          {isAdmin ? (
            <View>
              {record.role?.level <= 1 ? (
                <Button
                  danger
                  loading={isLoadingDeleteRole}
                  onClick={() =>
                    handleDeleteAdminRole(record._id, record.role._id)
                  }>
                  Remove Admin {record.role.level}
                </Button>
              ) : (
                <Button
                  type="primary"
                  loading={isLoadingSetRole}
                  onClick={() => handleSetAdminRole(record._id, 2)}>
                  Set Admin {record.role?.level}
                </Button>
              )}
            </View>
          ) : null}
        </Space>
      ),
    },
  ];
  return (
    <View style={styles.container}>
      {contextHolder}
      <Button type="primary" onClick={() => setIsModalRoleOpen(true)}>
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
              <b>First Name:</b> {userInfo.firstName}
            </Text>
            <Text>
              <b>Email:</b> {userInfo.email}
            </Text>
          </Space>
        )}
      </Modal>
      <Modal
        title="Add User Account"
        open={isModalRoleOpen}
        onCancel={() => setIsModalRoleOpen(false)}
        // onOk={handleAddRole}
        // confirmLoading={isLoadingAddRole}
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item
            label="Role Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Nhập role name',
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Permissions"
            name="permissions"
            rules={[
              {
                required: true,
                message: 'Nhập permissions',
              },
            ]}>
            <Input placeholder="fa, user, admin" />
          </Form.Item>
        </Form>
      </Modal>
    </View>
  );
};

export default UserManage;
