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

type ModuleItemProps = {
  title: string;
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
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  const [isVisibleEditModal, setIsVisibleEditModal] = useState(false);
  const data = { title, description, id, subLessonsData };

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

  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e.key === 'Delete') {
      setIsVisibleDeleteModal(true);
    } else {
      onEditClick(data);
    }
  };

  const handleDelete = () => {
    deleteModule({ _id: id });
    setIsVisibleDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setIsVisibleDeleteModal(false);
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      <Card
        style={{ ...styles.container, ...style }}
        hoverable
        onClick={onClick}
        actions={[<Text key="Library">Total SubLesson: {subLessons}</Text>]}>
        {haveMenu && (
          <Dropdown menu={menuProps} trigger={['click']}>
            <Button style={styles.btn}>
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{description}</Text>
          <Text style={styles.desc}>{durations}</Text>
        </View>
      </Card>
      <Modal
        title="Delete Module"
        open={isVisibleDeleteModal}
        onOk={handleDelete}
        onCancel={handleCancelDelete}>
        <Text>Do you want delete this module</Text>
      </Modal>
    </>
  );
};

export default ModuleItem;
