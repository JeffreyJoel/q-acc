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
  const { signMessage: privySignMessage } = usePrivy();
  const { wallets } = useWallets();
  const chainId = useChainId();

  const userAddress = address;

  const { refetch } = useFetchUser(!!userAddress, userAddress as Address);

  return useQuery({
    queryKey: ["token", userAddress],
    queryFn: async () => {
      if (!userAddress || !privySignMessage || !wallets || wallets.length === 0)
        return null;

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

      // Find the active wallet to check its type
      const activeWallet = wallets.find(
        (w) => w.address.toLowerCase() === userAddress.toLowerCase()
      );

      if (!activeWallet) {
        console.error("Active wallet not found in Privy's wallet list.");
        return null;
      }

      try {
        const checkSumAddress = ethers.getAddress(userAddress);
        let newToken;

        if (activeWallet.walletClientType === "privy") {
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
          const { data: newUser } = await refetch();
          if (newUser) {
            onSigned?.(newUser as IUser);
          }
          return newToken;
        }
        return null;
      } catch (error) {
        console.log("Error generating token:", error);
        return null;
      }
    },
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
