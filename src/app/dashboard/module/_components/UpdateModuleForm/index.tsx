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
  // Mặc định antd Modal zIndex=1000 — bằng đúng z-index của Drawer, nên khi
  // form này mở LỒNG bên trong 1 Drawer khác (VD PracticeLessonManage) thì
  // bị Drawer đè lên, không thấy gì dù đã mở (đã kiểm chứng: DOM có mặt,
  // opacity 1, nhưng nằm dưới). Cho phép caller tự nâng zIndex khi cần.
  zIndex?: number;
};

const UpdateModuleForm: React.FC<UpdateModuleFormProps> = ({
  data,
  isVisible,
  setIsVisible,
  setIsVisibleModalAdd,
  setSelectedItem,
  refresh,
  zIndex,
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
      // Không có title -> antd không render header riêng, nút đóng (X) nằm
      // đè thẳng lên góc trên-phải của vùng ScrollView bên dưới — đúng chỗ
      // thanh scroll dọc render (đã đo thực tế: đè nhau ~20x24px). Thêm
      // title để có header riêng, tách hẳn khỏi vùng cuộn, giống modal
      // "Thêm phần học" bên ModuleManage vốn không bị lỗi này.
      title={data?.title ? `Cập nhật: ${data.title}` : 'Cập nhật phần học'}
      open={isVisible}
      onCancel={onCloseModalAdd}
      footer={null}
      width={'80%'}
      centered
      zIndex={zIndex}
      destroyOnClose>
      <ScrollView style={{ height: height }}>
        <AddModuleContent initialValues={data} onFinish={onFinish} />
      </ScrollView>
    </Modal>
  );
};

export default UpdateModuleForm;
