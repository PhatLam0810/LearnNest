'use client';
import React, { useState } from 'react';
import { Form, Modal, Spin } from 'antd';
import { UpdateLesson } from './types';
import { ScrollView } from 'react-native-web';
import dynamic from 'next/dynamic';
import { Lesson } from '~mdDashboard/redux/saga/type';
import { messageApi, useWindowSize } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';

// Modal này chỉ admin mới mở ("Cập nhật" trên bảng khóa học) nhưng
// AddLessonContent (kéo theo @dnd-kit + AppUploadImageCrop) trước đây import
// tĩnh - bundle vào cả trang /dashboard/lesson công khai cho mọi học viên dù
// 99% không bao giờ mở modal này. Tách bằng next/dynamic, chỉ tải khi Modal
// thật sự mở (isVisible=true).
const AddLessonContent = dynamic(
  () => import('~mdAdmin/components/AddLessonContent'),
  { ssr: false, loading: () => <Spin style={{ margin: 24 }} /> },
);
type UpdateLessonFormProps = {
  data: Lesson;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  setSelectedItem?: (data: any) => void;
  setIsVisibleModalAdd?: (isVisible: boolean) => void;
  refresh?: () => void;
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
  const [updateLesson] = adminQuery.useUpdateLessonMutation();
  const onCloseModalAdd = () => {
    setSelectedItem(null);
    setIsVisibleModalAdd(false);
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onCloseModalAdd}
      footer={null}
      width={'80%'}
      centered>
      <ScrollView
        style={{ height: (width * 0.8 * 9) / 16, scrollbarWidth: 'none' }}>
        <AddLessonContent
          initialValues={data}
          onFormFinish={res => {
            updateLesson({ _id: data._id, ...res })
              .unwrap()
              .then(() => {
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
