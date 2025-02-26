import React, { useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { MenuProps, UploadProps } from 'antd';
import { Dropdown, Modal, Space, Upload } from 'antd';
import { messageApi } from '@hooks';
import api from '@services/api';

const { Dragger } = Upload;

type MoreDropdownProps = {
  title?: string;
  isVisible?: boolean;
  setIsVisible?: any;
  onOk: (data: FormData) => void;
};
const ModalBulkData: React.FC<MoreDropdownProps> = ({
  title,
  onOk,
  isVisible,
  setIsVisible,
}) => {
  const closeModal = () => {
    setIsVisible(false);
    formData.current = null;
  };
  const formData = useRef<FormData>(null);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Bulk daily Self-Care',
      onClick: () => setIsVisible(true),
    },
  ];
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: '.json',
    onChange: async info => {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        messageApi.success(`${info.file.name} file uploaded successfully.`);
        formData.current = new FormData();
        formData.current.append('file', info.file.originFileObj);
      } else if (status === 'error') {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return (
    <>
      <Dropdown menu={{ items }}>
        <a onClick={e => e.preventDefault()}>
          <Space>...</Space>
        </a>
      </Dropdown>
      <Modal
        title={title}
        open={isVisible}
        onClose={closeModal}
        onCancel={closeModal}
        onOk={() => {
          onOk(formData.current);
        }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
      </Modal>
    </>
  );
};

export default ModalBulkData;
