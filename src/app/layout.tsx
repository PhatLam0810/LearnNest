'use client';
import { useMessage } from '@/hooks';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { persistor, store } from '@redux';
import React from 'react';
import { View } from 'react-native-web';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Authentication } from '~mdAuth/components';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import LoadingScreen from '~mdAuth/components/Loading';
import './styles.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Chatbox from '@components/ChatboxAi';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = useMessage();
  dayjs.extend(relativeTime);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
            currency: 'USD',
            intent: 'capture',
          }}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <View
                style={{
                  flex: 1,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: '#F9F9F9',
                }}>
                {context}
                {children}
              </View>
              <LoadingScreen />
            </PersistGate>
            <Chatbox />
            <Authentication />
          </Provider>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
