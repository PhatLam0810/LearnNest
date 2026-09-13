import type { NextConfig } from 'next';
import path from 'path';

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

export default nextConfig;
