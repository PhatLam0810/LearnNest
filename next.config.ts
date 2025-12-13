import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
