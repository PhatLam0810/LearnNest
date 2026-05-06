'use client';
import { persistor, store } from '@redux';
import React from 'react';
import { View } from 'react-native-web';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Authentication } from '~mdAuth/components';
import { pdfjs } from 'react-pdf';
import LoadingScreen from '~mdAuth/components/Loading';
import './styles.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Chatbox from '@components/ChatboxAi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MessageProvider from '@components/MessageProvider';

const queryClient = new QueryClient();

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  dayjs.extend(relativeTime);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: 'auto' }}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <PersistGate persistor={persistor}>
              <MessageProvider />
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  minHeight: '100vh',
                  backgroundColor: '#F9F9F9',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                }}>
                {children}
              </View>
              <LoadingScreen />
            </PersistGate>
          </QueryClientProvider>
          <Chatbox />
          <Authentication />
        </Provider>
      </body>
    </html>
  );
}
