"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import {
  cookieStorage,
  createStorage,
  http,
  injected,
  type State,
} from "wagmi";

import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { polygon, polygonAmoy } from "viem/chains";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets"
  },
  loginMethods: ["wallet", "email", "google", "twitter"],
  appearance: {
    showWalletLoginFirst: false,
    theme: "dark",
    logo: "/images/logos/logo-light.png",
    accentColor: "#FBBA80",
  },
  defaultChain: polygon,
};

export const config = createConfig({
  chains: [polygon, polygonAmoy],
  connectors: [injected()],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
});

export default function Providers(props: {
    children: ReactNode;
    initialState?: State;
  }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={privyConfig}
      >
        <WagmiProvider config={config} initialState={props.initialState}>
          {props.children}
        </WagmiProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}
