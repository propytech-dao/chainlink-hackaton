import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { mainnet, optimism, sepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia, optimism],
  connectors: [
    injected(),

    metaMask({
      dappMetadata: {
        name: 'propytech',
        url: 'https://propytech.org',
      },
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
