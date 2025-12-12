import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
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
