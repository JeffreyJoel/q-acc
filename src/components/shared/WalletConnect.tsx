"use client";

import React, { useState } from "react";
import "@getpara/react-sdk/styles.css";
import { WalletDisplay } from "./WalletDisplay";
import { useAccount, useModal, useWallet } from "@getpara/react-sdk";
import { NavbarButton } from "../ui/resizable-navbar";
import { para } from "@/client/para";

function WalletConnect() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: account } = useAccount();
  const { data: wallet } = useWallet();
  const { openModal } = useModal();

  return (
    <div>
      {account && account.isConnected ? (
        wallet && (
          <WalletDisplay
            walletAddress={para.getDisplayAddress(wallet.id, {
              truncate: true,
              addressType: wallet.type,
            })}
          />
        )
      ) : (
        <NavbarButton
          disabled={isLoading}
          onClick={() => openModal()}
          variant="primary"
          className="rounded-full px-4 py-2 bg-peach-400"
        >
          Sign In
        </NavbarButton>
      )}
    </div>
  );
}
export default WalletConnect;
