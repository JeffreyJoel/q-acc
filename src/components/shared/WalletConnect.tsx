"use client";

import { useState, useEffect } from "react";
import "@getpara/react-sdk/styles.css";
import { WalletDisplay } from "./WalletDisplay";
import { useAccount, useModal, useWallet } from "@getpara/react-sdk";
import { NavbarButton } from "../ui/resizable-navbar";

function WalletConnect() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: account } = useAccount();
  const { data: wallet } = useWallet();
  const { openModal } = useModal();
  
  useEffect(() => {
    if (account && account.isConnected && !account.email) {
      // openEmailModal();
    }
  }, [account]);


  return (
    <div>
      {account && account.isConnected ? (
        wallet && (
          <WalletDisplay
            walletAddress={wallet.address}
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
      {/* <ProfileCreationModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        onSubmit={handleSubmitProfile}
      /> */}
    </div>
  );
}
export default WalletConnect;
