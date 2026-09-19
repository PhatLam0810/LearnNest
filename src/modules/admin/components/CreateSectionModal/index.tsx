'use client';
import React from 'react';
import { Modal, Spin } from 'antd';
import { ScrollView } from 'react-native-web';
import dynamic from 'next/dynamic';
import { messageApi } from '@hooks';
import { Module } from '~mdDashboard/redux/saga/type';
import { adminQuery } from '~mdAdmin/redux';

// dynamic + ssr:false: tách @dnd-kit/AddModuleContent ra khỏi bundle chính -
// modal này chỉ mở khi admin bấm "Thêm/Cập nhật phần học", không cần tải sẵn
// lúc vào trang.
const AddModuleContent = dynamic(() => import('../AddModuleContent'), {
  ssr: false,
  loading: () => <Spin style={{ margin: 24 }} />,
});

interface CreateSectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  // Có initialValues -> chế độ cập nhật phần học đã có, ngược lại là tạo mới.
  initialValues?: Module;
  // Có thể trả Promise (VD: bước gắn phần vào khóa) - modal chỉ đóng SAU khi
  // xong. Nơi gọi tự xử lý lỗi/toast của bước đó, modal vẫn đóng để tránh
  // admin bấm tạo lần nữa và sinh phần học trùng.
  onCreated?: (section: Module) => void | Promise<void>;
  onUpdated?: () => void;
  // Mặc định antd Modal zIndex=1000 - bằng đúng z-index của Drawer/Modal cha,
  // nên khi modal này mở LỒNG bên trong 1 Drawer hoặc modal khác (VD modal
  // "Thêm khóa học", PracticeLessonManage) thì bị vẽ đè xuống dưới dù đã mở
  // (đã kiểm chứng: DOM có mặt, opacity 1, nhưng nằm dưới). Caller tự nâng
  // zIndex khi cần.
  zIndex?: number;
}

const CreateSectionModal: React.FC<CreateSectionModalProps> = ({
  isVisible,
  onClose,
  initialValues,
  onCreated,
  onUpdated,
  zIndex,
}) => {
  const [updateModule] = adminQuery.useUpdateModuleMutation();

  return (
    <Modal
      // Luôn có title để antd render header riêng, nút đóng (X) không đè lên
      // thanh scroll dọc của ScrollView bên dưới.
      title={
        initialValues
          ? initialValues.title
            ? `Cập nhật: ${initialValues.title}`
            : 'Cập nhật phần học'
          : 'Thêm phần học'
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      zIndex={zIndex}
      destroyOnClose>
      <ScrollView style={{ height: 560 }}>
        {initialValues ? (
          <AddModuleContent
            initialValues={initialValues}
            onFinish={values => {
              updateModule({ _id: initialValues._id, ...values })
                .unwrap()
                .then(() => {
                  onUpdated?.();
                  onClose();
                })
                .catch((e: { data?: { message?: string } }) => {
                  messageApi.error(
                    e?.data?.message || 'Cập nhật phần học thất bại',
                  );
                });
            }}
          />
        ) : (
          <AddModuleContent
            onDone={async section => {
              try {
                await onCreated?.(section);
              } finally {
                onClose();
              }
            }}
          />
        )}
      </ScrollView>
    </Modal>
  );
};

export default CreateSectionModal;
