'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Card, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles';
import { adminAction } from '@/modules/admin/redux';
import { LibraryItem } from '@/app/dashboard/library/_components';
import { UpdateSubLesson } from './types';
import './styles.css';
import { FlatList, ScrollView } from 'react-native-web';
import { useAppDispatch } from '@redux';
import { ModalSelectLibrary } from '~mdAdmin/components/AddSubLessonContent/components';
import { UpdateSubLessonData } from './types copy';
import { AppRichTextInput } from '@components';
import { AddSubLessonContent } from '~mdAdmin/components';
import { Sublesson } from '~mdDashboard/redux/saga/type';

type UpdateSubLessonFormProps = {
  data: Sublesson;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  setSelectedItem: (data: any) => void;
  setIsVisibleModalAdd: (isVisible: boolean) => void;
  refresh: () => void;
};

const UpdateSubLessonForm: React.FC<UpdateSubLessonFormProps> = ({
  data,
  isVisible,
  setIsVisible,
  setIsVisibleModalAdd,
  setSelectedItem,
  refresh,
}) => {
  const dispatch = useAppDispatch();

  const onFinish = (values: any) => {
    const { title, description, libraries, durations } = values;
    dispatch(
      adminAction.updateSubLesson({
        params: {
          _id: data._id,
          title: title,
          description: description,
          libraries: libraries.map(item => item._id),
          duration: durations,
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
      title="Add SubLesson">
      <AddSubLessonContent initialValues={data} onFinish={onFinish} />
    </Modal>
  );
};

export default UpdateSubLessonForm;
