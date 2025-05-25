import React from 'react';
import Link from 'next/link';
import { IconGitcoinPassport } from '../icons/IconGitcoin';
import {
  GitcoinVerificationStatus,
  useGitcoinScore,
} from '@/hooks/useGitcoinScore';
// import Routes from '@/lib/constants/Routes';
import { getBadgeClasses } from './common';
import { Address } from 'viem';

export const GitcoinVerificationBadge = ({ userAddress }: { userAddress: Address }) => {
  const { status } = useGitcoinScore(userAddress);
  const isVerified =
    status === GitcoinVerificationStatus.ANALYSIS_PASS ||
    status === GitcoinVerificationStatus.SCORER_PASS;

  return (
    <Link href="#">
      <div className={getBadgeClasses(isVerified)}>
        <IconGitcoinPassport size={24} />
        <span>Human Passport {isVerified ? 'Verified' : 'Not Verified'}</span>
      </div>
    </Link>
  );
};
