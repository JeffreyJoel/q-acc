"use client";

import React, { useState, useEffect } from "react";
import "@getpara/react-sdk/styles.css";
import { WalletDisplay } from "./WalletDisplay";
import { useAccount, useModal, useWallet } from "@getpara/react-sdk";
import { NavbarButton } from "../ui/resizable-navbar";
import { para } from "@/client/para";
import ProfileCreationModal from "@/components/profile/CreateProfile";

function WalletConnect() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const { data: account } = useAccount();
  const { data: wallet } = useWallet();
  const { openModal } = useModal();

  useEffect(() => {
    if (account && account.isConnected) {
      setIsProfileModalOpen(true);
    }
  }, [account]);

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleSubmitProfile = async (data: any) => {
    console.log("Profile data submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

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
      <ProfileCreationModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        onSubmit={handleSubmitProfile}
      />
    </div>
  );
}
export default WalletConnect;
