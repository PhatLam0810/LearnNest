'use client';
import React from 'react';
import { Modal } from 'antd';
import { adminAction } from '@/modules/admin/redux';
import { ScrollView } from 'react-native-web';
import { useAppDispatch } from '@redux';
import { AddModuleContent } from '~mdAdmin/components';
import { useWindowSize } from '@hooks';
import { Module } from '~mdDashboard/redux/saga/type';

type UpdateModuleFormProps = {
  data: Module;
  isVisible: boolean;
  setIsVisible?: (isVisible: boolean) => void;
  setSelectedItem?: (data: Module) => void;
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
  const height = (width * 0.8 * 9) / 16;
  const onFinish = (values: Module) => {
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
      <ScrollView style={{ height: height }}>
        <AddModuleContent initialValues={data} onFinish={onFinish} />
      </ScrollView>
    </Modal>
  );
};

export default UpdateModuleForm;
