import { messageApi } from '@hooks';
import api from '@services/api';
import { Upload, UploadProps } from 'antd';
import React from 'react';

type AppUploadProps = Omit<UploadProps, 'onChange'> & {
  onChange?: (url: string) => void;
};
const AppUploadToServer: React.FC<AppUploadProps> = ({
  onChange,
  ...props
}) => {
  return (
    <Upload
      {...props}
      action={api.defaults.baseURL + '/upload'}
      onChange={info => {
        messageApi.loading('Uploading...', 0);
        if (info.file.status === 'done') {
          const responseUrl = info.file.response?.data;
          if (responseUrl) {
            messageApi.destroy();
            onChange(responseUrl);
          }
        }
      }}
    />
  );
};

export default AppUploadToServer;
