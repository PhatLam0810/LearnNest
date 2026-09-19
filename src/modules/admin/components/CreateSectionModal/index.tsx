'use client';
import React from 'react';
import { Modal, Spin } from 'antd';
import { ScrollView } from 'react-native-web';
import dynamic from 'next/dynamic';
import { Module } from '~mdDashboard/redux/saga/type';

// dynamic + ssr:false: tách @dnd-kit/AddModuleContent ra khỏi bundle chính,
// giống hệt pattern UpdateModuleForm đang dùng cho modal "Cập nhật phần
// học" - modal này chỉ mở khi admin bấm "Thêm phần học" bên trong modal
// tạo khóa học, không cần tải sẵn lúc vào trang.
const AddModuleContent = dynamic(() => import('../AddModuleContent'), {
  ssr: false,
  loading: () => <Spin style={{ margin: 24 }} />,
});

interface CreateSectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreated: (section: Module) => void;
  // Modal "Thêm khóa học" đã mở sẵn khi modal này mở lồng bên trong - antd
  // Modal mặc định zIndex=1000 cho mọi modal, nên modal con cần zIndex cao
  // hơn modal cha để không bị vẽ đè xuống dưới (xem giải thích gốc ở
  // UpdateModuleForm).
  zIndex?: number;
}

const CreateSectionModal: React.FC<CreateSectionModalProps> = ({
  isVisible,
  onClose,
  onCreated,
  zIndex,
}) => (
  <Modal
    title="Thêm phần học"
    open={isVisible}
    onCancel={onClose}
    footer={null}
    width={1000}
    centered
    zIndex={zIndex}
    destroyOnClose>
    <ScrollView style={{ height: 560 }}>
      <AddModuleContent
        onDone={section => {
          onCreated(section);
          onClose();
        }}
      />
    </ScrollView>
  </Modal>
);

export default CreateSectionModal;
