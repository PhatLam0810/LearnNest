'use client';
import { persistor, store } from '@redux';
import type { ReactNode } from 'react';
import { View } from 'react-native-web';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Authentication } from '~mdAuth/components';
import { pdfjs } from 'react-pdf';
import LoadingScreen from '~mdAuth/components/Loading';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FeedbackWidget from '@components/FeedbackWidget';
import AiAdvisorWidget from '@components/AiAdvisorWidget';
import Footer from '@components/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MessageProvider from '@components/MessageProvider';
import PageViewTracker from '@components/PageViewTracker';
import styles from './layoutStyles';
import { Analytics } from '@vercel/analytics/next';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

const queryClient = new QueryClient();

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  dayjs.extend(relativeTime);
  const pathname = usePathname();
  const showFooter = pathname === '/dashboard/home';

  return (
    <>
      {/* locale={viVN}: antd trước đây không set locale nào - mọi text mặc
          định của antd (nút OK/Cancel trong Modal không tự đặt okText/
          cancelText, chữ "No data" khi bảng rỗng, phân trang "X-Y of Z",
          v.v.) hiện tiếng Anh xen giữa 1 app hoàn toàn tiếng Việt. Set 1
          lần ở gốc để sửa toàn bộ, thay vì vá từng chỗ lẻ tẻ. */}
      <ConfigProvider locale={viVN}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <PersistGate persistor={persistor}>
              <MessageProvider />
              <PageViewTracker />
              <View style={styles.appShell}>{children}</View>
              <AiAdvisorWidget />
              {showFooter && <Footer />}
              <Authentication />
              <LoadingScreen />
            </PersistGate>
          </QueryClientProvider>
        </Provider>
      </ConfigProvider>
      <Analytics />
    </>
  );
}
