'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, Card, Dropdown, MenuProps, Modal, Space } from 'antd';
import { messageApi } from '@hooks';
import {
  SignatureOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { adminQuery } from '@/modules/admin/redux';
import styles from './styles';

type SubLessonItemProps = {
  title: string;
  description?: string;
  libraries?: number;
  id?: string;
  haveMenu?: boolean;
  durations?: number;
  onClick?: () => void;
  onEditClick?: (data: any) => void;
  refresh?: () => void;
  style?: any;
  librariesData?: any[];
};
const SubLessonItem: React.FC<SubLessonItemProps> = ({
  libraries,
  title,
  description,
  id,
  haveMenu = false,
  librariesData,
  durations,
  onClick,
  onEditClick,
  refresh,
  style,
}) => {
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  const dataUpdate = { title, id, description, durations, librariesData };
  const [deleteSubLesson, { isSuccess: isSuccessDelete }] =
    adminQuery.useDeleteSubLessonMutation();

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
      onEditClick(dataUpdate);
    }
  };

  const handleDelete = () => {
    deleteSubLesson({ _id: id });
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
        actions={[<Text key="Library">Total Library: {libraries}</Text>]}>
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
        title="Delete SubLesson"
        open={isVisibleDeleteModal}
        onOk={handleDelete}
        onCancel={handleCancelDelete}>
        <Text>Do you want delete this subLesson</Text>
      </Modal>
    </>
  );
};

export default SubLessonItem;
