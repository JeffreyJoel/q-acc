import { usePublicClient, useWalletClient } from "wagmi";
import { Address, getContract } from "viem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { claimTokensABI } from "@/lib/abi/inverter";

export const useClaimRewards = ({
  paymentProcessorAddress,
  paymentRouterAddress,
  onSuccess = () => {},
  onError = () => {},
}: {
  paymentProcessorAddress: string;
  paymentRouterAddress: string;
  streamId?: bigint;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const contract = getContract({
    address: paymentProcessorAddress as Address,
    abi: claimTokensABI,
    client: walletClient!,
  });

  const claim = useMutation({
    mutationFn: async () => {
      const tx = await contract.write.claimAll([paymentRouterAddress], {
        gas: 1000000,
      });

      await publicClient!.waitForTransactionReceipt({
        hash: tx,
      });
    },
    onSuccess,
  });

  return { claim };
};

export const useReleasableForStream = ({
  paymentProcessorAddress,
  client,
  receiver,
  streamId,
}: {
  paymentProcessorAddress: string;
  client: string;
  receiver: `0x${string}` | undefined;
  streamId: bigint;
}) => {
  const publicClient = usePublicClient();

  return useQuery<bigint>({
    queryKey: ["releasableForStream", client, receiver, streamId.toString()],
    queryFn: async (): Promise<bigint> => {
      const contract = getContract({
        address: paymentProcessorAddress as Address,
        abi: claimTokensABI,
        client: publicClient!,
      });

      const res = await contract.read.releasableForSpecificStream([
        client,
        receiver,
        streamId,
      ]);

      return res as bigint;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60,
    enabled: !!receiver && !!client,
  });
};

export const useIsActivePaymentReceiver = ({
  paymentProcessorAddress,
  client,
  receiver,
}: {
  paymentProcessorAddress: string;
  client: string;
  receiver: `0x${string}` | undefined;
}) => {
  const publicClient = usePublicClient();
  return useQuery({
    queryKey: ["isActivePaymentReceiver", paymentProcessorAddress],
    queryFn: async (): Promise<boolean> => {
      const contract = getContract({
        address: paymentProcessorAddress as Address,
        abi: claimTokensABI,
        client: publicClient!,
      });

      const res = await contract.read.isActivePaymentReceiver([
        client,
        receiver,
      ]);

      return res as boolean;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60,
    enabled: !!receiver && !!client,
  });
};

export const useReleasedForStream = ({
  paymentProcessorAddress,
  client,
  receiver,
  streamId,
}: {
  paymentProcessorAddress: string;
  client: string;
  receiver: `0x${string}` | undefined;
  streamId: bigint;
}) => {
  const publicClient = usePublicClient();

  return useQuery<bigint>({
    queryKey: ["releasedForStream", client, receiver, streamId.toString()],
    queryFn: async (): Promise<bigint> => {
      const contract = getContract({
        address: paymentProcessorAddress as Address,
        abi: claimTokensABI,
        client: publicClient!,
      });

      const res = await contract.read.releasedForSpecificStream([
        client,
        receiver,
        streamId,
      ]);
      return res as bigint;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60,
    enabled: !!receiver && !!client,
  });
};

// Add this helper hook for network condition checks
export const useNetworkHealth = () => {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["networkHealth"],
    queryFn: async () => {
      if (!publicClient) return false;

      try {
        // Check if we can get the latest block
        const block = await publicClient.getBlockNumber();
        const currentTime = Date.now();
        const blockInfo = await publicClient.getBlock({ blockNumber: block });

        // Check if the latest block is recent (within 1 minute)
        const blockAge = currentTime - Number(blockInfo.timestamp) * 1000;
        const isHealthy = blockAge < 60000; // 1 minute

        return { isHealthy, blockAge, blockNumber: block };
      } catch (error) {
        return { isHealthy: false, error };
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 15000, // Consider stale after 15 seconds
  });
};

// Enhanced version with network health check
export const useClaimRewardsEnhanced = ({
  paymentProcessorAddress,
  paymentRouterAddress,
  streamId,
  onSuccess = () => {},
  onError = () => {},
  requireNetworkHealth = true,
}: {
  paymentProcessorAddress: string;
  paymentRouterAddress: string;
  streamId?: bigint;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  requireNetworkHealth?: boolean;
}) => {
  const { data: networkHealth } = useNetworkHealth();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const claim = useMutation({
    mutationFn: async () => {
      // Network health check
      if (
        requireNetworkHealth &&
        networkHealth &&
        typeof networkHealth === "object" &&
        !networkHealth.isHealthy
      ) {
        throw new Error(
          "Network conditions are not optimal. Please try again later."
        );
      }

      // All previous validation and transaction logic...
      // (keeping the same implementation as before)

      // Validation checks
      if (!walletClient) {
        throw new Error("Wallet not connected");
      }
      if (!publicClient) {
        throw new Error("Public client not available");
      }
      if (!streamId) {
        throw new Error("Stream ID is required");
      }
      if (!paymentProcessorAddress || !paymentRouterAddress) {
        throw new Error("Payment addresses are required");
      }

      const contract = getContract({
        address: paymentProcessorAddress as Address,
        abi: claimTokensABI,
        client: walletClient,
      });

      // Check if there are claimable rewards first
      const releasableAmount = await contract.read.releasableForSpecificStream([
        paymentRouterAddress,
        await walletClient.getAddresses().then((addrs) => addrs[0]),
        streamId,
      ]);

      if (releasableAmount === BigInt(0)) {
        throw new Error("No rewards available to claim");
      }

      // Estimate gas before executing
      let gasEstimate: bigint;
      try {
        gasEstimate = await contract.estimateGas.claimForSpecificStream([
          paymentRouterAddress,
          streamId,
        ]);
      } catch (error) {
        console.error("Gas estimation failed:", error);
        gasEstimate = BigInt(500000);
      }

      const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);

      // Execute the transaction with retry logic
      let tx: `0x${string}`;
      let retries = 3;

      while (retries > 0) {
        try {
          tx = await contract.write.claimForSpecificStream(
            [paymentRouterAddress, streamId],
            {
              gas: gasLimit,
            }
          );
          break;
        } catch (error: any) {
          retries--;
          if (retries === 0) {
            throw error;
          }

          if (error.message?.includes("insufficient funds")) {
            throw new Error("Insufficient funds for gas fees");
          }
          if (error.message?.includes("user rejected")) {
            throw new Error("Transaction rejected by user");
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      const receipt = (await Promise.race([
        publicClient.waitForTransactionReceipt({
          hash: tx!,
          confirmations: 2,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Transaction timeout")), 300000)
        ),
      ])) as any;

      if (receipt.status === "reverted") {
        throw new Error("Transaction was reverted");
      }

      return receipt;
    },
    onSuccess,
    onError,
    retry: (failureCount, error: any) => {
      if (
        error.message?.includes("user rejected") ||
        error.message?.includes("insufficient funds") ||
        error.message?.includes("Network conditions")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    claim,
    isNetworkHealthy:
      networkHealth && typeof networkHealth === "object"
        ? networkHealth.isHealthy
        : false,
    canClaim:
      walletClient &&
      publicClient &&
      streamId &&
      (requireNetworkHealth
        ? networkHealth && typeof networkHealth === "object"
          ? networkHealth.isHealthy
          : false
        : true),
  };
};
