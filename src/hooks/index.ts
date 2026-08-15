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
