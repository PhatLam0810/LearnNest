import { messageApi } from '@hooks';
import { UploadProps } from 'antd';
import React, { useRef } from 'react';

const AddDragUploadFile = () => {
  const formData = useRef<FormData>(null);
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
  return <div>AddDragUploadFile</div>;
};

export default AddDragUploadFile;
