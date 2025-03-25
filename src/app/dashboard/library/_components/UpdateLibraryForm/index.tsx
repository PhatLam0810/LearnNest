'use client';
import React, { useState } from 'react';
import styles from './styles';
import { Text, View } from 'react-native-web';
import {
  Form,
  Input,
  Select,
  Upload,
  message,
  Image,
  UploadFile,
  UploadProps,
  Modal,
} from 'antd';
import api from '@services/api';
import { adminAction } from '@/modules/admin/redux';
import { useAppDispatch } from '@redux';
import { PlusOutlined } from '@ant-design/icons';
import { UpdateLibraryFormData } from './types';
import { Library } from '~mdDashboard/types';
import { AddLibraryContent } from '~mdAdmin/components';

type UpdateLibraryFormProps = {
  data: Library;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  setSelectedItem?: (data: any) => void;
  setIsVisibleModalAdd?: (isVisible: boolean) => void;
  refresh?: () => void;
};

const UpdateLibraryForm: React.FC<UpdateLibraryFormProps> = ({
  data,
  isVisible,
  setIsVisible,
  setSelectedItem,
  setIsVisibleModalAdd,
  refresh,
}) => {
  const dispatch = useAppDispatch();

  const onFinish = (values: any) => {
    dispatch(
      adminAction.updateLibrary({
        params: {
          _id: data?._id,
          ...values,
        },
        callback() {
          refresh();
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
      title="Add Library">
      <AddLibraryContent initialValues={data} onFinish={onFinish} />
    </Modal>
  );
};

export default UpdateLibraryForm;
