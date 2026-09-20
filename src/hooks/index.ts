'use client';
import { message } from 'antd';
import { toastMessageApi } from './toastStore';
import { useEffect, useState } from 'react';
export * from './pagination';

// `messageApi` giờ đẩy vào hệ toast dùng chung (ToastProvider), cùng chữ ký với
// antd nên các chỗ gọi cũ không đổi.
export const messageApi = toastMessageApi;
export * from './toastStore';

export const useMessage = () => {
  const [mounted, setMounted] = useState(false);
  const [, context] = message.useMessage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return context;
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
