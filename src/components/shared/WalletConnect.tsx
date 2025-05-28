"use client";

import { useEffect, useState } from "react";
import { useLogin, useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import { WalletDisplay } from "./WalletDisplay";
import { NavbarButton } from "../ui/resizable-navbar";

function WalletConnect() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, ready, authenticated } = usePrivy();

  const [isClient, setIsClient] = useState(false);
  const { login } = useLogin({});

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <div>
      {isClient && authenticated && user && user.wallet?.address ? (
        <WalletDisplay walletAddress={user?.wallet?.address} />
      ) : (
        <>
          {ready ? (
            <NavbarButton
              disabled={isLoading}
              onClick={() => login()}
              variant="primary"
              className="rounded-full px-4 py-2 bg-peach-400"
            >
              Sign In
            </NavbarButton>
          ) : (
            <NavbarButton
              as="button"
              disabled={true}
              variant="primary"
              className="rounded-full px-4 py-2 bg-peach-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Loading...
            </NavbarButton>
          )}
        </>
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
