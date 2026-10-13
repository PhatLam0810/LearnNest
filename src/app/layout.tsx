import { safeJsonLd } from '@/utils/jsonLd';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/variables.css';
import './styles.css';
import '../styles/animations.css';
import RootLayoutClient from './RootLayoutClient';

// www. — domain thật đang serve (apex learnestvhu.com chỉ 308-redirect sang
// đây). Trước đó metadataBase/OG url dùng domain trần, lệch với domain thật
// -> tín hiệu canonical sai, một phần lý do Google chưa index trang.
const SITE_URL = 'https://www.learnestvhu.com';
const SITE_NAME = 'LearnNest';
// Thêm "learnestvhu.com" + "Văn Hiến (VHU)" vào mô tả — trang chỉ hiện chữ
// "LearnNest" ở mọi nơi, không hề có chữ khớp với domain "learnestvhu" nên
// tìm đúng domain (không kèm .com) không ra kết quả nào.
const SITE_DESCRIPTION =
  'LearnNest VHU (learnestvhu.com) - nền tảng học trực tuyến của Trường Đại học Văn Hiến (VHU): học nhanh, luyện tập hiệu quả và theo dõi tiến độ học tập mọi lúc, mọi nơi.';
// "LearnNest VHU" (có dấu cách) + "học trực tuyến" + "VHU" để khớp các cách gõ
// tìm kiếm: "learnest vhu", "nền tảng học trực tuyến vhu".
const DEFAULT_TITLE = `${SITE_NAME} VHU - Nền tảng học trực tuyến Đại học Văn Hiến`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
};

// schema.org: nói rõ đây là nền tảng học của một trường đại học, kèm ô tìm kiếm
// -> Google hiểu đúng thực thể thay vì coi như một website chung chung.
const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: `${SITE_NAME} - Trung tâm Tin học, Trường Đại học Văn Hiến (VHU)`,
  alternateName: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  sameAs: [SITE_URL],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          // Hằng số do chính chúng ta định nghĩa, không phải dữ liệu người dùng.
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(ORGANIZATION_JSON_LD),
          }}
        />
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
