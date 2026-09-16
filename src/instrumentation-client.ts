// Next.js App Router tự động load file này ở client (browser) - quy ước
// riêng của @sentry/nextjs v10+, thay cho sentry.client.config.ts kiểu cũ.
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',
  // Chỉ bắt lỗi, không bật performance tracing/session replay - giữ bundle
  // nhẹ, đúng tinh thần dự án đã code-split kỹ trong session này.
  tracesSampleRate: 0,
});

// Bắt lỗi khi chuyển route (Next.js yêu cầu export tên này nếu dùng App
// Router navigation instrumentation) - export rỗng an toàn nếu SDK không
// cần, nhưng Sentry khuyến nghị khai báo tường minh.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
