'use client';
import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { useEffect, useState } from 'react';
export * from './pagination';

export let messageApi: MessageInstance | null = null;

export const useMessage = () => {
  const [mounted, setMounted] = useState(false);
  const [api, context] = message.useMessage();

  useEffect(() => {
    setMounted(true);
    messageApi = api;
  }, [api]);

  // Return null context during SSR to avoid hydration issues
  // This prevents the hook from being called during SSR
  if (!mounted) {
    return null;
  }

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
