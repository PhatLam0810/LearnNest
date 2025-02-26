'use client';
import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { createRef, useEffect, useState } from 'react';
export * from './pagination';

export let messageApi = createRef<MessageInstance>().current;

export const useMessage = () => {
  const [api, context] = message.useMessage();
  messageApi = api;
  return context;
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Hàm update kích thước cửa sổ
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Lắng nghe sự kiện resize khi cửa sổ thay đổi kích thước
    window.addEventListener('resize', handleResize);

    // Gọi hàm một lần khi component mount
    handleResize();

    // Dọn dẹp khi component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Chỉ chạy lần đầu tiên khi mount

  return windowSize;
};
