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
  phantomWallet,
  backpackWallet,
  ParaSolanaProvider,
} from "@getpara/solana-wallet-connectors";
import { ExternalWallet, OAuthMethod, ParaModal } from "@getpara/react-sdk";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { sepolia, celo, mainnet, polygon } from "wagmi/chains";

// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

import { para } from "@/client/para";
type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

// const solanaNetwork = WalletAdapterNetwork.Mainnet;
// const solanaConfig = {
//   endpoint: clusterApiUrl("mainnet-beta"),
//   wallets: [phantomWallet, backpackWallet],
//   chain: "mainnet-beta",
//   appIdentity: {
//     name: "Quadratic Accelerator",
//     uri: `${location.protocol}//${location.host}`,
//   },
//   multiChain: true,
// };



export const ParaProviders: React.FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ParaEvmProvider
        config={{
          projectId: process.env.NEXT_PUBLIC_PARA_API_KEY || "",
          appName: "Quadratic Accelerator",
          chains: [mainnet, polygon, sepolia, celo],
          wallets: [
            metaMaskWallet,
            rainbowWallet,
            walletConnectWallet,
            zerionWallet,
            coinbaseWallet,
            rabbyWallet,
          ],
          para: para,
        }}
      >
        {/* <ParaSolanaProvider {...solanaConfig}> */}
          <ParaModal
            para={para}
            authLayout={["EXTERNAL:FULL", "AUTH:FULL"]}
            oAuthMethods={[OAuthMethod.GOOGLE, OAuthMethod.TWITTER]}
            externalWallets={[
              ExternalWallet.METAMASK,
              ExternalWallet.COINBASE,
              ExternalWallet.WALLETCONNECT,
              ExternalWallet.RAINBOW,
              ExternalWallet.ZERION,
              ExternalWallet.RABBY,
              // ExternalWallet.PHANTOM,
            ]}
            theme={{
              foregroundColor: "#FFFFFF",
              backgroundColor: "#171717",
              accentColor: "#FBBA80",
              mode: "dark",
              borderRadius: "xl",
              font: "Inter",
            }}
            appName="Quadratic Acceleration"
            logo="/images/logos/logo-light.png"
            recoverySecretStepEnabled
            onRampTestMode={true}
          />
          {children}
        {/* </ParaSolanaProvider> */}
      </ParaEvmProvider>
    </QueryClientProvider>
  );
};
