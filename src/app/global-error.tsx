'use client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Thay cả root layout khi nó lỗi nên không dùng được provider/CSS của app -
// giữ giao diện tối giản, chỉ báo lỗi về Sentry và cho phép tải lại.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontFamily: 'system-ui, sans-serif',
          color: '#111827',
        }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>Đã có lỗi xảy ra</h1>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Vui lòng tải lại trang. Nếu lỗi vẫn còn, hãy báo cho quản trị viên.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            height: 40,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 8,
            border: 0,
            background: '#1d418a',
            color: '#fff',
            cursor: 'pointer',
          }}>
          Tải lại trang
        </button>
      </body>
    </html>
  );
}
