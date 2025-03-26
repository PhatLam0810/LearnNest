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
import { Document, Page, pdfjs } from 'react-pdf';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import LoadingScreen from '~mdAuth/components/Loading';
import './styles.css';

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

  const imageUrl = `https://drive.google.com/uc?id=1LzuAWTcRc9vE9Q14SK8qb92hBiqd7-Ns&export=preview`;

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {/* <View style={{ width: 300, height: 300 }}>
          <Document
            file={
              'http://localhost:9999/proxy/pdf?fileId=1n2bIfItzhhVBC6jFK8-SAq0FrimS79rV'
            }>
            <Page pageNumber={1} scale={0.99} />
          </Document>
        </View>

        <View style={{ width: 300, height: 300 }}>
          <iframe
            src={
              'https://drive.google.com/file/d/18pqaAYqmyEkYNtayouJvduPag1Zfsv0v/preview'
            }
            width="300"
            height="300"
          />
          <Image
            alt=""
            width={300}
            height={300 * (9 / 16)}
            src={
              'https://drive.google.com/uc?export=view&id=1LzuAWTcRc9vE9Q14SK8qb92hBiqd7-Ns'
            }
            style={{ objectFit: 'contain' }}
          />
        </View> */}

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

            <Authentication />
          </Provider>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
