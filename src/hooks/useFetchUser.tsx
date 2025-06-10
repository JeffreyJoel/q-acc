import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo } from '@/services/user.service';
import { Address } from 'viem';

export const useFetchUser = (enabled: boolean = false, address: Address) => {

  return useQuery({
    queryKey: ['user', address],
    queryFn: async () => {
      if (!address) return;
      return await fetchUserInfo(address);
    },
    enabled: enabled && !!address,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
