'use client';
import { useEffect, useState } from 'react';
import { useMessage } from '@/hooks';

/**
 * Client-only message provider component
 * Prevents SSR issues with Ant Design message hook
 */
export default function MessageProvider() {
  const [mounted, setMounted] = useState(false);
  const messageContext = useMessage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render message context after client mount
  if (!mounted) {
    return null;
  }

  return messageContext;
}
