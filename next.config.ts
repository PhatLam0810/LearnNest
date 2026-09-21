import type { NextConfig } from 'next';
import path from 'path';
import { withSentryConfig } from '@sentry/nextjs';
import bundleAnalyzer from '@next/bundle-analyzer';

// ANALYZE=true yarn next build -> báo cáo kích thước bundle ở .next/analyze/.
// Không đặt biến thì plugin tắt hoàn toàn, build thường không bị ảnh hưởng.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Ignore react-native modules that are not needed for web
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    // Ignore optional dependencies that are not needed for production build
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };

    // Ignore warnings for optional dependencies
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules\/@metamask\/sdk/,
      },
      {
        module: /node_modules\/pino/,
      },
      {
        module: /node_modules\/react-native-web/,
      },
    ];

    return config;
  },
  reactStrictMode: false,
  // Security headers cho mọi route. HSTS đã do Vercel tự set; ở đây bổ sung
  // chống clickjacking (X-Frame-Options + CSP frame-ancestors), chặn MIME
  // sniffing, siết referrer và tắt các quyền trình duyệt không dùng tới.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      'storage.googleapis.com',
      'drive.google.com',
      'img.youtube.com',
      'www.youtube.com',
      'www.servermania.com',
      'miro.medium.com',
    ], // Thêm hostname vào đây
  },
};

export default withBundleAnalyzer(
  withSentryConfig(nextConfig, {
    // Chưa cấu hình SENTRY_AUTH_TOKEN trên Vercel -> plugin tự bỏ qua bước
    // upload source map (không làm fail build), lỗi vẫn báo về Sentry bình
    // thường, chỉ là stack trace sẽ trỏ tới code đã build thay vì code gốc
    // cho tới khi thêm token. silent: true để không in log ồn ào mỗi lần
    // build local khi không có token.
    silent: true,
    disableLogger: true,
    // Chỉ bắt lỗi (tracesSampleRate: 0, không replay) -> cắt phần không dùng.
    bundleSizeOptimizations: {
      excludeDebugStatements: true,
      excludeTracing: true,
      excludeReplayIframe: true,
      excludeReplayShadowDom: true,
    },
  }),
);
