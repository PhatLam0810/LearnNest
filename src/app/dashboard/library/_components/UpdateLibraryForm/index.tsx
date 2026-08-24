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
import { adminAction, adminQuery } from '@/modules/admin/redux';
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

  // getAllLibrary (nguồn của `data`) cố tình bỏ questionList để bảng danh
  // sách nhẹ hơn — fetch lại đầy đủ document khi mở form Cập nhật để không
  // mất câu hỏi đã gắn sẵn cho bài học này.
  const { data: fullLibrary } = adminQuery.useGetLibraryByIdQuery(
    data?._id ?? '',
    { skip: !isVisible || !data?._id },
  );
  const formInitialValues = fullLibrary ? { ...data, ...fullLibrary } : data;

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
      footer={null}
      title="Thêm bài học">
      <AddLibraryContent
        initialValues={formInitialValues}
        onFinish={onFinish}
      />
    </Modal>
  );
};

export default UpdateLibraryForm;
