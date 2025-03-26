'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Button, Card, Dropdown, MenuProps, Modal, Space } from 'antd';
import { messageApi } from '@hooks';
import {
  SignatureOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { adminQuery } from '@/modules/admin/redux';
import UpdateModuleForm from '../UpdateModuleForm';
import { Module } from '~mdDashboard/redux/saga/type';

type ModuleItemProps = {
  title: string;
  data: Module;
  description?: string;
  durations?: number;
  subLessons?: number;
  onClick?: () => void;
  refresh?: () => void;
  onEditClick?: (data: any) => void;
  id?: string;
  subLessonsData?: any[];
  haveMenu?: boolean;
  style?: any;
};
const ModuleItem: React.FC<ModuleItemProps> = ({
  subLessons,
  data,
  title,
  durations,
  description,
  refresh,
  id,
  subLessonsData,
  haveMenu = false,
  onClick,
  onEditClick,
  style,
}) => {
  const [deleteModule, { isSuccess: isSuccessDelete }] =
    adminQuery.useDeleteModuleMutation();

  useEffect(() => {
    if (isSuccessDelete) {
      refresh();
      messageApi.success('Delete library successfully');
    }
  }, [isSuccessDelete]);

  const items: MenuProps['items'] = [
    {
      label: 'Edit',
      key: 'Edit',
      icon: <SignatureOutlined />,
    },
    {
      label: 'Delete',
      key: 'Delete',
      icon: <DeleteOutlined />,
    },
  ];

  return (
    <>
      <Card
        style={{ ...styles.container, ...style }}
        hoverable
        onClick={onClick}
        actions={[
          <Text key="Library">Total Libraries: {data.libraries.length}</Text>,
        ]}>
        <View>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
        </View>
      </Card>
    </>
  );
};

export default ModuleItem;
