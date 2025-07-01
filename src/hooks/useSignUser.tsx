import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";
import { ethers } from "ethers";
import { usePrivy, useWallets } from "@privy-io/react-auth";

import {
  getLocalStorageToken,
  signChallengeWithPrivyEmbed,
  signChallengeWithExternalWallet,
} from "@/helpers/generateJWT";
import { IUser } from "@/types/user.type";
import { useFetchUser } from "./useFetchUser";

import { Address } from "viem";

export const useSignUser = (onSigned?: (user: IUser) => void) => {
  const { address, chain } = useAccount();
  const { signMessage: privySignMessage, ready, authenticated, user: privyUser } = usePrivy();
  const chainId = useChainId();


  // Standardize address format to checksum
  const rawUserAddress = privyUser?.wallet?.address || address;
  const userAddress = rawUserAddress ? ethers.getAddress(rawUserAddress) : undefined;
  console.log("userAddress", userAddress);

  const { refetch } = useFetchUser(true, userAddress as Address);

  return useQuery({
    queryKey: ["token", userAddress],
    queryFn: async () => {
      // Early return if Privy is not ready or user is not authenticated
      if (!ready || !authenticated) {
        console.log("Privy not ready or user not authenticated");
        return null;
      }

      if (!userAddress || !privySignMessage) {
        console.log("Missing required dependencies for signing");
        return null;
      }

      // Check if token exists in localStorage
      const localStorageToken = getLocalStorageToken(userAddress);
      if (localStorageToken) {
        const { data: newUser } = await refetch();
        if (newUser) {
          onSigned?.(newUser);
        }
        return localStorageToken;
      }

      // Token generation logic
      const currentChainId = chain?.id || chainId;
      if (!currentChainId) return null;

  
      

      // if (!activeWallet) {
      //   console.error("Active wallet not found in Privy's wallet list.");
      //   return null;
      // }

      // Check if the wallet is ready for signing
      // if (!isWalletReady(privyUser?.wallet)) {
      //   console.error("Embedded wallet not fully initialized");
      //   return null;
      // }

      // For Privy embedded wallets, add a small delay to ensure wallet proxy is ready
      if (privyUser?.wallet?.walletClientType === "privy") {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.log("privyUser?.wallet?.walletClientType", privyUser?.wallet);

      try {
        const checkSumAddress = ethers.getAddress(userAddress);
        let newToken;

        if (privyUser?.wallet?.walletClientType === "privy") {
          // Use Privy's native signing for embedded wallets
          console.log("Using Privy embedded wallet signing flow");
          newToken = await signChallengeWithPrivyEmbed(
            privySignMessage,
            checkSumAddress,
            currentChainId
          );
        } else {
          // Use wagmi/ethers for external wallets
          console.log("Using external wallet signing flow");
          newToken = await signChallengeWithExternalWallet(
            checkSumAddress,
            currentChainId
          );
        }

        if (newToken) {
          localStorage.setItem("token", JSON.stringify(newToken));
          console.log("Token saved for address:", checkSumAddress);
          const { data: newUser } = await refetch();
          if (newUser) {
            onSigned?.(newUser as IUser);
          }
          return newToken;
        }
        return null;
      } catch (error) {
        console.error("Error generating token:", error);
        
        // Handle specific Privy wallet initialization errors
        if (error instanceof Error && error.message.includes("Wallet proxy not initialized")) {
          console.error("Embedded wallet not ready. Please try again in a moment.");
        }
        
        return null;
      }
    },
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
