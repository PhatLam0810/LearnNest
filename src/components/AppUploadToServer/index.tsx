import { messageApi } from '@hooks';
import api from '@services/api';
import { useAppSelector } from '@redux';
import { Upload, UploadProps } from 'antd';
import React from 'react';

type AppUploadProps = Omit<UploadProps, 'onChange'> & {
  onChange?: (url: string) => void;
};
const AppUploadToServer: React.FC<AppUploadProps> = ({
  onChange,
  ...props
}) => {
  // /upload đòi hỏi đăng nhập (JwtAuthGuard) - antd Upload tự làm request
  // riêng (không qua instance axios `api` vốn tự đính token), nên phải tự
  // gắn header Authorization ở đây, không thì luôn nhận 401.
  const accessToken = useAppSelector(
    state => state.authReducer.tokenInfo?.accessToken,
  );
  return (
    <Upload
      {...props}
      action={api.defaults.baseURL + '/upload'}
      headers={
        accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
      }
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
