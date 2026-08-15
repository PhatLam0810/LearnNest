'use client';
import { useEffect, useState } from 'react';
import { useMessage } from '@/hooks';

export default function MessageProvider() {
  const [mounted, setMounted] = useState(false);
  const messageContext = useMessage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return messageContext;
}
