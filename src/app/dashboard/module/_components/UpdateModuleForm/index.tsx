'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Card, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles';
import { adminAction } from '@/modules/admin/redux';
import { UpdateModule, UpdateModuleFormData } from './types';
import './styles.css';
import { FlatList, ScrollView } from 'react-native-web';
import { useAppDispatch } from '@redux';
import { ModalSelectSubLesson } from '~mdAdmin/components/AddModuleContent/components';
import { SubLessonItem } from '@/app/dashboard/subLesson/_components';
import { AddModuleContent } from '~mdAdmin/components';
import { useWindowSize } from '@hooks';
import { Module } from '~mdDashboard/redux/saga/type';

type UpdateModuleFormProps = {
  data: Module;
  isVisible: boolean;
  setIsVisible?: (isVisible: boolean) => void;
  setSelectedItem?: (data: any) => void;
  setIsVisibleModalAdd?: (isVisible: boolean) => void;
  refresh: () => void;
};

const UpdateModuleForm: React.FC<UpdateModuleFormProps> = ({
  data,
  isVisible,
  setIsVisible,
  setIsVisibleModalAdd,
  setSelectedItem,
  refresh,
}) => {
  const dispatch = useAppDispatch();
  const { width } = useWindowSize();
  const onFinish = (values: any) => {
    dispatch(
      adminAction.updateModule({
        params: {
          _id: data._id,
          ...values,
        },
        callback() {
          refresh();
          setSelectedItem(null);
          setIsVisible(false);
        },
      }),
    );
  };

  const onCloseModalAdd = () => {
    setSelectedItem(null);
    setIsVisibleModalAdd(false);
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onCloseModalAdd}
      onClose={onCloseModalAdd}
      footer={null}
      width={'80%'}
      centered>
      <ScrollView style={{ height: (width * 0.8 * 9) / 16 }}>
        <AddModuleContent initialValues={data} onFinish={onFinish} />
      </ScrollView>
    </Modal>
  );
};

export default UpdateModuleForm;
