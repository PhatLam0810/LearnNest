'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Space, Table, TableProps, Tag } from 'antd';
import { useAppPagination } from '@hooks';
import { UserItem } from '~mdDashboard/types';
import { MoreDropdown } from './_components';

const UserManage = () => {
  const { listItem, currentData } = useAppPagination<UserItem>({
    apiUrl: 'user/getListUser',
  });

  const columns: TableProps<UserItem>['columns'] = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (value: UserItem['role']) => <Text>{value?.name}</Text>,
    },
  ];
  return (
    <View style={styles.container}>
      <Table
        columns={columns}
        dataSource={listItem}
        pagination={{
          current: currentData?.pageNum,
          pageSize: currentData?.pageSize,
          total: currentData?.totalRecords,
        }}
      />
    </View>
  );
};

export default UserManage;
