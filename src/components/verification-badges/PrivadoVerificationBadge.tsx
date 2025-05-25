import React from 'react';
import Link from 'next/link';
import { usePrivado } from '@/hooks/usePrivado';
import { IconPrivado } from '../icons/IconPrivado';
// import Routes from '@/lib/constants/Routes';
import { getBadgeClasses } from './common';
import { Address } from 'viem';

export const PrivadoVerificationBadge = ({ userAddress }: { userAddress: Address }) => {
  const { isVerified } = usePrivado(userAddress);

  return (
    <Link href="#">
      <div className={getBadgeClasses(isVerified)}>
        <IconPrivado size={24} />
        <span>Privado zkID {isVerified ? 'Verified' : 'Not Verified'}</span>
      </div>
    </Link>
  );
};
