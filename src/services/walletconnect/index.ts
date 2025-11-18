import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

const walletConnectConfig = createConfig({
  chains: [sepolia], // ✅ chỉ cần 1 lần
  connectors: [
    walletConnect({
      projectId: '3155a65758f7b38413655d9bb5c16e37',
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
    [sepolia.id]: http(
      'https://eth-sepolia.g.alchemy.com/v2/I_eQ0rIIHwfehJQpC3ZGx',
    ),
  },
});
export default walletConnectConfig;
