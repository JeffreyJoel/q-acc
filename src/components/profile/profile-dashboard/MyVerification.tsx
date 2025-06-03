import React from 'react';
import { GitcoinVerifySection } from '@/components/verification/GitcoinVerification';
import { ZkidVerifySection } from '@/components/verification/ZkIdVerification';
import SkipVerification from '@/components/verification/SkipVerification';

//TODO: Match the design of the profile dashboard
export const MyVerifications = () => {
  return (
    <div className='container'>
      <div className='w-full flex flex-col p-8 gap-10 rounded-2xl  text-xl font-redHatText leading-9 mb-14 md:mb-48 mt-14'>
        <GitcoinVerifySection />
        <ZkidVerifySection />

        <SkipVerification />
      </div>
    </div>
  );
};
