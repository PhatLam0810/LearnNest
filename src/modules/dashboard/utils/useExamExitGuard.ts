'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Chặn rời trang khi đang làm bài (đề thi thử MOS, bài trắc nghiệm AI...):
// đóng tab/tải lại, nút Back của trình duyệt, router.push/replace và link <a>
// (vd thanh bên) đều hiện hộp thoại xác nhận thay vì rời ngay. Dùng chung để
// mọi trang làm bài có cùng hành vi.
// `stayKey`: chuỗi có trong URL của chính trang làm bài (điều hướng nội bộ
// trong trang thì không chặn).
export function useExamExitGuard(
  active: boolean,
  stayKey: string,
  fallbackUrl: string,
) {
  const router = useRouter();
  const [showExitWarning, setShowExitWarning] = useState(false);
  const allowExitRef = useRef(false);
  const pendingNavUrl = useRef<string | null>(null);

  // 1. Đóng tab / tải lại
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (allowExitRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [active]);

  // 2. Nút Back / Forward của trình duyệt
  useEffect(() => {
    if (!active) return;
    window.history.pushState({ examGuard: true }, '', window.location.href);
    const onPopState = () => {
      if (allowExitRef.current) return;
      window.history.pushState({ examGuard: true }, '', window.location.href);
      pendingNavUrl.current = fallbackUrl;
      setShowExitWarning(true);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [active, fallbackUrl]);

  // 3. router.push/replace và click link <a>
  useEffect(() => {
    if (!active) return;
    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(
      window.history,
    );
    const intercept = (
      originalFn: (
        data: any,
        unused: string,
        url?: string | URL | null,
      ) => void,
      data: any,
      unused: string,
      url?: string | URL | null,
    ) => {
      if (!allowExitRef.current && url) {
        const dest = typeof url === 'string' ? url : url.toString();
        if (dest && !dest.includes(stayKey)) {
          pendingNavUrl.current = dest;
          setShowExitWarning(true);
          return;
        }
      }
      return originalFn(data, unused, url);
    };
    window.history.pushState = (data, unused, url) =>
      intercept(originalPushState, data, unused, url);
    window.history.replaceState = (data, unused, url) =>
      intercept(originalReplaceState, data, unused, url);

    const handleAnchorClick = (e: MouseEvent) => {
      if (allowExitRef.current) return;
      const target = (e.target as HTMLElement).closest('a');
      if (!target?.href) return;
      // Không chặn tải file, link blob, hoặc mở tab mới
      if (
        target.hasAttribute('download') ||
        target.getAttribute('target') === '_blank' ||
        target.protocol === 'blob:'
      ) {
        return;
      }
      try {
        const url = new URL(target.href);
        if (!url.pathname.includes(stayKey)) {
          e.preventDefault();
          e.stopPropagation();
          pendingNavUrl.current = url.pathname + url.search;
          setShowExitWarning(true);
        }
      } catch {
        // ignore invalid URLs
      }
    };
    document.addEventListener('click', handleAnchorClick, true);
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      document.removeEventListener('click', handleAnchorClick, true);
    };
  }, [active, stayKey]);

  return {
    showExitWarning,
    // Nút "← Thoát" của trang.
    requestExit: () => {
      pendingNavUrl.current = fallbackUrl;
      setShowExitWarning(true);
    },
    confirmExit: () => {
      allowExitRef.current = true;
      setShowExitWarning(false);
      router.push(pendingNavUrl.current || fallbackUrl);
    },
    cancelExit: () => {
      pendingNavUrl.current = null;
      setShowExitWarning(false);
    },
    // Gọi trước khi tự điều hướng hợp lệ (vd sau khi nộp bài).
    allowExit: () => {
      allowExitRef.current = true;
    },
  };
}
