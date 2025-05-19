"use client";

import {
  ParaEvmProvider,
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
  zerionWallet,
} from "@getpara/evm-wallet-connectors";
import {
  ExternalWallet,
  OAuthMethod,
  ParaModal,
  ParaModalProps,
} from "@getpara/react-sdk";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { paraConnector } from "@getpara/wagmi-v2-integration";

import { polygon, polygonAmoy } from "wagmi/chains";

import { para } from "@/client/para";
import {
  createConfig,
  CreateConfigParameters,
  http,
  WagmiProvider,
} from "wagmi";
type Props = {
  children: React.ReactNode;
};

const config: ParaModalProps = {
  para: para,
  authLayout: ["EXTERNAL:FULL", "AUTH:FULL"],
  oAuthMethods: [OAuthMethod.GOOGLE, OAuthMethod.TWITTER],
  externalWallets: [
    ExternalWallet.METAMASK,
    ExternalWallet.COINBASE,
    // ExternalWallet.WALLETCONNECT,
    ExternalWallet.RAINBOW,
    ExternalWallet.ZERION,
    ExternalWallet.RABBY,
    // ExternalWallet.PHANTOM,
  ],
  theme: {
    foregroundColor: "#FFFFFF",
    backgroundColor: "#171717",
    accentColor: "#FBBA80",
    darkForegroundColor: "#FFFFFF",
    darkBackgroundColor: "#171717",
    darkAccentColor: "#FBBA80",
    mode: "dark" as const,
    borderRadius: "xl",
    font: "Inter",
  },
  appName: "Quadratic Acceleration",
  logo: "/images/logos/logo-light.png",
  recoverySecretStepEnabled: true,
  onRampTestMode: true,
  disableEmailLogin: false,
  disablePhoneLogin: false,
};

const connector = paraConnector({
  ...config,
  para: para,
  appName: config.appName!,
  options: {},
  disableModal: true,
  chains: [polygon, polygonAmoy],
});

const wagmiConfigOpts = {
  chains: [polygon, polygonAmoy],
  // connectors: [connector],
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
} as CreateConfigParameters;


const queryClient = new QueryClient();
export const wagmiConfig = createConfig(wagmiConfigOpts);

export const ParaProviders: React.FC<Props> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ParaEvmProvider
          config={{
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "",
            appName: config.appName || "",
            chains: [polygon, polygonAmoy],
            wallets: [
              metaMaskWallet,
              rainbowWallet,
              // walletConnectWallet,
              zerionWallet,
              coinbaseWallet,
              rabbyWallet,
            ],
            para: para,
          }}
        >
          <ParaModal
            para={para}
            authLayout={config.authLayout}
            oAuthMethods={config.oAuthMethods}
            externalWallets={config.externalWallets}
            theme={config.theme}
            appName={config.appName}
            logo={config.logo}
            recoverySecretStepEnabled={config.recoverySecretStepEnabled}
            onRampTestMode={config.onRampTestMode}
          />
          {children}
        </ParaEvmProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
