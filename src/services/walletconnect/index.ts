import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

const walletConnectConfig = createConfig({
  chains: [sepolia], // ✅ chỉ cần 1 lần
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
      metadata: {
        name: 'LearnNest',
        description: 'Buy Lesson',
        url: 'https://learnnest-production.up.railway.app/dashboard/home',
        icons: ['https://learnnest-production.up.railway.app/favicon.ico'],
      },
      showQrModal: true, // bật QR khi connect ví
    }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_URL),
  },
});
export default walletConnectConfig;
