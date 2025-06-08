'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RewardsBreakDown from './RewardsBreakDown';
import DonorSupportedProjects from './DonorSupportedProjects';
import { useDonorContext } from '@/contexts/donor.context';
import { Spinner } from '@/components/loaders/Spinner';
import { useAccount } from 'wagmi';
import { ArrowLeftIcon } from 'lucide-react';

const DonarSupports = () => {
  const [showBreakDown, setShowBreakDown] = useState<boolean>(false);
  const {
    donationsGroupedByProject,
    projectDonorData,
    totalCount,
    loading,
    error,
  } = useDonorContext();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const projectId = searchParams.get('projectId');

  useEffect(() => {
    if (projectId) {
      setShowBreakDown(true);
    } else {
      setShowBreakDown(false);
    }
  }, [projectId]);

  if (loading)
    return (
      <div className='container flex justify-center items-center min-h-80'>
        <Spinner />
      </div>
    );
  if (error) return <p>{error}</p>;

  if (!totalCount) {
    return (
      <div className='container'>
        <div className='bg-neutral-800 rounded-xl py-40 text-center text-neutral-300 text-2xl font-bold'>
          You didn’t support any project.
        </div>
      </div>
    );
  }

  if (!showBreakDown) {
    return (
      <div className='container flex flex-col gap-10 mb-10'>
        {Object.entries(donationsGroupedByProject).map(
          ([projectId, projectDonations]: [string, any]) => {
            const project = projectDonations[0].project;

            const donationData = projectDonorData[Number(projectId)] || {
              uniqueDonors: 0,
              totalContributions: 0,
              donationCount: 0,
              userProjectContributionSum: 0,
            };
            const totalRewardTokens = projectDonations.reduce(
              (sum: any, donation: { rewardTokenAmount: number }) =>
                sum + (donation.rewardTokenAmount || 0),
              0,
            );

            return (
              <div key={projectId}>
                <DonorSupportedProjects
                  projectId={projectId}
                  project={project}
                  uniqueDonors={donationData.uniqueDonors}
                  totalClaimableRewardTokens={0}
                  totalContributions={donationData.totalContributions}
                  projectDonations={donationData.donationCount}
                  totalContribution={donationData.userProjectContributionSum}
                  totalRewardTokens={totalRewardTokens}
                  onClickBreakdown={() => {
                    setShowBreakDown(true);
                  }}
                />
              </div>
            );
          },
        )}
      </div>
    );
  } else {
    return (
      <>
        <Link href={`/profile/${address}?tab=contributions`}>
          <button
            onClick={() => {
              setShowBreakDown(false);
            }}
            className='bg-neutral-800 text-neutral-100 container p-6 rounded-2xl flex items-center gap-3'
          >
            <ArrowLeftIcon
              className='w-6 h-6'
            />
            <h1 className='text-lg font-bold'>Go Back</h1>
          </button>
        </Link>
        <RewardsBreakDown />
      </>
    );
  }
};

export default DonarSupports;
