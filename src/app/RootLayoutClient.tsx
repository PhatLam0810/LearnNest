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
      <Analytics />
    </>
  );
}
