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
        // `key` cố định - antd thay message cũ thay vì chồng thêm cái mới mỗi
        // lần sự kiện 'uploading' bắn lại (progress), trước đây gọi
        // messageApi.loading không kèm key nên upload càng lâu càng chồng
        // nhiều toast "Uploading..." không tự tắt.
        if (info.file.status === 'uploading') {
          messageApi.loading({
            content: 'Uploading...',
            key: 'app-upload',
            duration: 0,
          });
          return;
        }
        messageApi.destroy('app-upload');
        if (info.file.status === 'done') {
          const responseUrl = info.file.response?.data;
          if (responseUrl) {
            onChange(responseUrl);
          } else {
            messageApi.error('Tải ảnh lên thất bại');
          }
        } else if (info.file.status === 'error') {
          messageApi.error('Tải ảnh lên thất bại');
        }
      }}
    />
  );
};

export default AppUploadToServer;
