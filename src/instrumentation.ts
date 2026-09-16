import * as Sentry from '@sentry/nextjs';

// Next.js App Router tự gọi register() một lần khi server khởi động (cả
// runtime Node lẫn Edge) - quy ước chính thức để khởi tạo Sentry phía
// server, thay cho sentry.server.config.ts/sentry.edge.config.ts kiểu cũ.
// Dự án này chưa có middleware.ts nào chạy Edge runtime, nhưng vẫn khai báo
// nhánh Edge cho đầy đủ, đúng mẫu Sentry sinh ra.
export async function register() {
  const dsn = process.env.SENTRY_DSN;
  const environment = process.env.SENTRY_ENVIRONMENT || 'development';

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({ dsn, environment, tracesSampleRate: 0 });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({ dsn, environment, tracesSampleRate: 0 });
  }
}

// Bắt lỗi ném ra trong Server Component/Route Handler mà Next.js tự xử lý
// nội bộ (không qua try/catch của mình) - không có hook này thì các lỗi đó
// không bao giờ tới Sentry dù client-side đã bắt được.
export const onRequestError = Sentry.captureRequestError;
