import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/variables.css';
import './styles.css';
import RootLayoutClient from './RootLayoutClient';

const SITE_URL = 'https://learnestvhu.com';
const SITE_NAME = 'LearnNest';
const SITE_DESCRIPTION =
  'LearnNest - nền tảng học tập trực tuyến giúp bạn học nhanh, luyện tập hiệu quả và theo dõi tiến độ học tập mọi lúc, mọi nơi.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Nền tảng học tập trực tuyến`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} - Nền tảng học tập trực tuyến`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
