'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@redux';
import api from '@services/api';

// Ghi nhận mỗi lần đổi route để tự dựng biểu đồ lượt truy cập — Vercel
// Analytics bản Free không cho lấy dữ liệu qua API để vẽ biểu đồ riêng.
const PageViewTracker = () => {
  const pathname = usePathname();
  const userId = useAppSelector(
    (state: any) => state.authReducer?.tokenInfo?.userProfile?._id,
  );
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;
    api.post('/analytics/track', { path: pathname, userId }).catch(() => {
      // Best-effort — không cần báo lỗi cho người dùng nếu ghi nhận thất bại.
    });
  }, [pathname, userId]);

  return null;
};

export default PageViewTracker;
