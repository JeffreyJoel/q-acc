import { useQuery } from '@tanstack/react-query';
import { useAccount, useChainId } from 'wagmi';
import { ethers } from 'ethers';

import { getLocalStorageToken, signWithEVM } from '@/helpers/generateJWT';
import { IUser } from '@/types/user.type';
import { useFetchUser } from './useFetchUser';
// import { useWallet } from '@getpara/react-sdk';

import { Address } from 'viem';


export const useSignUser = (onSigned?: (user: IUser) => void) => {
  const { address, chain, connector } = useAccount();
  // const { data: wallet } = useWallet();
  // con
  const  chainId  = useChainId();

  const userAddress =  address;

  const { refetch } = useFetchUser(!!userAddress, userAddress as Address);

  return useQuery({
    queryKey: ['token', userAddress],
    queryFn: async () => {
      if (!userAddress) return null;

      // Check if token exists in localStorage
      const localStorageToken = getLocalStorageToken(userAddress);
      console.log('localStorageToken', localStorageToken);
      if (localStorageToken) {
        const { data: newUser } = await refetch();
        if (newUser) {
          onSigned?.(newUser); // Pass the latest user data to the callback
        }
        return localStorageToken;
      }
      
      console.log('chainId', chainId);
      
      // Token generation logic
      if (!chain?.id || !connector) return null;
      try {
        const checkSumAddress = ethers.getAddress(userAddress);
        const newToken = await signWithEVM(
          checkSumAddress,
          chain?.id,
          connector,
        );
        if (newToken) {
          localStorage.setItem('token', JSON.stringify(newToken));
          const { data: newUser } = await refetch();
          if (newUser) {
            onSigned?.(newUser as IUser);
          }
          return newToken;
        }
        return null;
      } catch (error) {
        console.log('Error generating token:', error);
        return null;
      }
    },
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
