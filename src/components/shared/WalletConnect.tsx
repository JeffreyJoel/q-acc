"use client";

import { useEffect, useState } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { WalletDisplay } from "./WalletDisplay";
import { NavbarButton } from "../ui/resizable-navbar";
import { useAccount } from "wagmi";


function WalletConnect() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, authenticated } = usePrivy();

  const [isClient, setIsClient] = useState(false);
  const { login } = useLogin({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {  isClient && authenticated && user && user.wallet?.address ? (
        <WalletDisplay
          walletAddress={user?.wallet?.address}
        />
      ) : (
        <NavbarButton
          disabled={isLoading}
          onClick={() => login()}
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
