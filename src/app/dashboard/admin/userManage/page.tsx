'use client';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Space, Table, TableProps, Modal, Avatar } from 'antd';
import { useAppPagination } from '@hooks';
import { UserItem } from '~mdDashboard/types';
import { adminQuery } from '~mdAdmin/redux';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
const UserManage = () => {
  const { listItem, currentData } = useAppPagination<UserItem>({
    apiUrl: 'user/getListUser',
  });

  const [getUserInfoById, { data: userInfo }] =
    adminQuery.useGetUserInfoByIdMutation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    if (userInfo) {
      setIsModalOpen(true);
    }
  }, [userInfo]);

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
            backgroundColor: '#ef405c',
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
  ];

  return (
    <View style={styles.container}>
      <Table
        columns={columns}
        dataSource={listItem}
        rowKey={record => record._id}
        pagination={{
          current: currentData?.pageNum,
          pageSize: currentData?.pageSize,
          total: currentData?.totalRecords,
        }}
        onRow={record => ({
          onClick: () => getUserInfoById({ _id: record._id }), // Gọi API
        })}
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
                backgroundColor: '#ef405c',
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
    </View>
  );
};

export default UserManage;
