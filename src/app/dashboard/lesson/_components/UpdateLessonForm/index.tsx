'use client';
import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import { UpdateLesson } from './types';
import CreateLessonForm from '@/app/dashboard/admin/addLesson/page';

type UpdateLessonFormProps = {
  data: UpdateLesson;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onUpdateFinish: (data: any) => void;
};

const UpdateLessonForm: React.FC<UpdateLessonFormProps> = ({
  data,
  isVisible,
  setIsVisible,
  onUpdateFinish,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleEditCancel = () => {
    setIsVisible(false);
  };

  const handleEditOk = () => {
    form.submit();
    setConfirmLoading(true);
  };

  return (
    <Modal
      open={isVisible}
      onCancel={handleEditCancel}
      onOk={handleEditOk}
      confirmLoading={confirmLoading}
      footer={null}
      width={'100%'}
      height={'90%'}
      styles={{
        content: {
          height: '90vh',
          overflow: 'scroll',
        },
      }}
      centered>
      <CreateLessonForm initialValues={data} onFormFinish={onUpdateFinish} />
    </Modal>
  );
};

export default UpdateLessonForm;
