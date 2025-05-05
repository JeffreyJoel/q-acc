"use client";

import React, { useEffect, useState } from "react";
import "@getpara/react-sdk/styles.css";
import { WalletDisplay } from "./WalletDisplay";
import { ExternalWallet, OAuthMethod, ParaModal, useAccount, useWallet } from "@getpara/react-sdk";
import { para } from "@/client/para";
import { NavbarButton } from "../ui/resizable-navbar";

function WalletConnect() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { data: account } = useAccount();
  const { data: wallet } = useWallet();

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  console.log("wallet", wallet);
  const handleCloseModal = async () => {
    // handleCheckIfAuthenticated();
    setIsOpen(false);
  };
  return (
    <div>
      {account?.isConnected ? (
        wallet &&
        <WalletDisplay walletAddress={para.getDisplayAddress(wallet.id, {
            truncate: true,
            addressType: wallet.type,
          })} />
      ) : (
        <NavbarButton
          disabled={isLoading}
          onClick={handleOpenModal}
          variant="primary"
          className="rounded-full px-4 py-2 bg-peach-400"
        >
          Sign In
        </NavbarButton>
      )}

      <ParaModal
        para={para}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        authLayout={["EXTERNAL:FULL", "AUTH:FULL"]}
        oAuthMethods={[OAuthMethod.GOOGLE, OAuthMethod.TWITTER]}
        externalWallets={[
          ExternalWallet.METAMASK,
          ExternalWallet.COINBASE,
          ExternalWallet.WALLETCONNECT,
          ExternalWallet.RAINBOW,
          ExternalWallet.ZERION,
          ExternalWallet.RABBY,
        ]}
        theme={{
          foregroundColor: "#FFFFFF",
          backgroundColor: "#171717",
          accentColor: "#FBBA80",
          mode: "dark",
          borderRadius: "full",
          font: "Inter",
        }}
        appName="Quadratic Acceleration"
        logo="/images/logos/logo-light.png"
        recoverySecretStepEnabled
        onRampTestMode={true}
      />
    </div>
  );
}
export default WalletConnect;
