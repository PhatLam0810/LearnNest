'use client';
import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import { UpdateLesson } from './types';
import CreateLessonForm from '@/app/dashboard/admin/addLesson/page';
import { ScrollView } from 'react-native-web';
import { AddLessonContent } from '~mdAdmin/components';
import { Lesson } from '~mdDashboard/redux/saga/type';
import { messageApi, useWindowSize } from '@hooks';
import { updateLessonApi } from '~mdAdmin/services/api';
type UpdateLessonFormProps = {
  data: Lesson;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  setSelectedItem: (data: any) => void;
  setIsVisibleModalAdd: (isVisible: boolean) => void;
  refresh: () => void;
};

const UpdateLessonForm: React.FC<UpdateLessonFormProps> = ({
  data,
  isVisible,
  setIsVisible,
  setIsVisibleModalAdd,
  setSelectedItem,
  refresh,
}) => {
  const { width } = useWindowSize();
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
      <ScrollView
        style={{ height: (width * 0.8 * 9) / 16, scrollbarWidth: 'none' }}>
        <AddLessonContent
          initialValues={data}
          onFormFinish={res => {
            updateLessonApi({ _id: data._id, ...res }).then(res => {
              setIsVisible(false);
              messageApi.success('Update Successfully');
              refresh();
            });
          }}
        />
      </ScrollView>
    </Modal>
  );
};

export default UpdateLessonForm;
