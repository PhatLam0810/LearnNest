'use client';
import { persistor, store } from '@redux';
import React from 'react';
import { View } from 'react-native-web';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Authentication } from '~mdAuth/components';
import { pdfjs } from 'react-pdf';
import LoadingScreen from '~mdAuth/components/Loading';
import '../styles/variables.css';
import './styles.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Chatbox from '@components/ChatboxAi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MessageProvider from '@components/MessageProvider';
import styles from './layoutStyles';

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
      <body>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <PersistGate persistor={persistor}>
              <MessageProvider />
              <View style={styles.appShell}>{children}</View>
              <Authentication />
              <Chatbox />
              <LoadingScreen />
            </PersistGate>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
