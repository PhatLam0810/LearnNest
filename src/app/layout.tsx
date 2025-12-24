'use client';
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
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import walletConnectConfig from '@services/walletconnect';
import MessageProvider from '@components/MessageProvider';
import '@mysten/dapp-kit/dist/index.css';
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from '@mysten/dapp-kit';

import { getFullnodeUrl } from '@mysten/sui/client';
const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

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
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
            currency: 'USD',
            intent: 'capture',
          }}>
          <Provider store={store}>
            <WagmiProvider config={walletConnectConfig}>
              <QueryClientProvider client={queryClient}>
                <SuiClientProvider
                  networks={networkConfig}
                  defaultNetwork="devnet">
                  <WalletProvider>
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
                  </WalletProvider>
                </SuiClientProvider>
              </QueryClientProvider>
            </WagmiProvider>
            <Chatbox />
            <Authentication />
          </Provider>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
