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
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const claim = useMutation({
    mutationFn: async () => {
      if (!walletClient) throw new Error("Wallet not connected");

      const contract = getContract({
        address: paymentProcessorAddress as Address,
        abi: claimTokensABI,
        client: walletClient,
      });

      const tx = await contract.write.claimAll([paymentRouterAddress]);

      await publicClient!.waitForTransactionReceipt({
        hash: tx,
      });
    },
    onSuccess,
    onError,
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

