'use client';
import { persistor, store } from '@redux';
import type { ReactNode } from 'react';
import { View } from 'react-native-web';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Authentication } from '~mdAuth/components';
import LoadingScreen from '~mdAuth/components/Loading';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FeedbackWidget from '@components/FeedbackWidget';
import AiAdvisorWidget from '@components/AiAdvisorWidget';
import Footer from '@components/Footer';
import MessageProvider from '@components/MessageProvider';
import ToastProvider from '@components/ToastProvider';
import PageViewTracker from '@components/PageViewTracker';
import styles from './layoutStyles';
import { Analytics } from '@vercel/analytics/next';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Màu chữ phụ mặc định của antd (#8c8c8c) chỉ đạt 3.36:1 trên nền trắng; dùng
// đúng token chữ phụ của dự án (#6b7280, 4.83:1).
// Link mặc định #1677ff chỉ đạt ~3.9:1 trên nền nhạt -> dùng xanh VHU (9.65:1).
const ANTD_THEME = {
  token: { colorTextDescription: '#6b7280', colorLink: '#1d418a' },
};

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  dayjs.extend(relativeTime);
  const pathname = usePathname();
  const showFooter = pathname === '/dashboard/home';

  // Trang khóa học công khai phải render được HOÀN TOÀN phía server để Google
  // đọc được nội dung. PersistGate (redux-persist) chỉ render children SAU khi
  // rehydrate ở trình duyệt -> khi SSR nó trả về rỗng, HTML gửi cho crawler
  // không có chữ nào. Các trang này không dùng state đã lưu nên cho đi vòng
  // qua PersistGate; phần còn lại của app giữ nguyên như cũ.
  const isPublicCoursePage = pathname?.startsWith('/khoa-hoc');
  if (isPublicCoursePage) {
    return (
      <>
        <ConfigProvider locale={viVN} theme={ANTD_THEME}>
          <Provider store={store}>
            <View style={styles.appShell}>{children}</View>
          </Provider>
        </ConfigProvider>
        <Analytics />
      </>
    );
  }

  return (
    <>
      {/* locale={viVN}: antd trước đây không set locale nào - mọi text mặc
          định của antd (nút OK/Cancel trong Modal không tự đặt okText/
          cancelText, chữ "No data" khi bảng rỗng, phân trang "X-Y of Z",
          v.v.) hiện tiếng Anh xen giữa 1 app hoàn toàn tiếng Việt. Set 1
          lần ở gốc để sửa toàn bộ, thay vì vá từng chỗ lẻ tẻ. */}
      <ConfigProvider locale={viVN} theme={ANTD_THEME}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <MessageProvider />
            <ToastProvider />
            <PageViewTracker />
            <View style={styles.appShell}>{children}</View>
            <AiAdvisorWidget />
            {showFooter && <Footer />}
            <Authentication />
            <LoadingScreen />
          </PersistGate>
        </Provider>
      </ConfigProvider>
      <Analytics />
    </>
  );
}
