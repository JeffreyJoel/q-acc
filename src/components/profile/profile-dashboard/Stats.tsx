"use client";

import { useDonorContext } from "@/contexts/donor.context";
import { Medal, Target, CheckCircle } from "lucide-react";
import StatsCard from "./StatsCard";
import TokenStat from "./TokenStat";
import Achievement from "./Achievement";
import { formatAmount } from "@/helpers/donations";

function Stats() {
  const {
    donationsGroupedByProject,
    totalUserContributionsUsd,
    contributedProjectsCount,
    contributedRoundsCount,
    loading,
    error,
  } = useDonorContext();


  console.log(donationsGroupedByProject);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="PROJECTS FUNDED" value={contributedProjectsCount} />
        <StatsCard title="ROUNDS PARTICIPATED" value={contributedRoundsCount} />
        <StatsCard title="TOTAL VALUE LOCKED" value={`$${formatAmount(totalUserContributionsUsd)}`} />
      </div>

      <div className="bg-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Tokens Per Project
        </h2>
        <div className="divide-y divide-neutral-700">
          {Object.entries(donationsGroupedByProject).map(([projectId, donationsArray]: [string, any[]]) => {
            if (!donationsArray || donationsArray.length === 0) return null;
            
            const totalAmountForProject = donationsArray.reduce((sum: number, donation: any) => sum + donation.valueUsd, 0);
            const firstDonation = donationsArray[0];
            const tokenName = firstDonation.project?.abc?.tokenName || 'N/A';
            const tokenTicker = firstDonation.project?.abc?.tokenTicker || 'N/A';

            return (
              <TokenStat 
                key={projectId} 
                tokenName={tokenName} 
                tokenTicker={tokenTicker} 
                amount={totalAmountForProject} 
              />
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Q/ACC Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {
            contributedRoundsCount > 1 && (
              <Achievement
                icon={<Medal size={24} />}
                title="MULTI-SEASONS"
                description="Supporting projects across multiple seasons"
              />
            )
          }
          {
            contributedProjectsCount > 1 && (
              <Achievement
                icon={<Target size={24} />}
                title="MULTI-PROJECTS"
                description="Supported multiple projects in one round!"
              />
            )
          }
          {/* <Achievement
            icon={<CheckCircle size={24} />}
            title="CLAIMED!"
            description="Only for users who have claimed their tokens"
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Stats;
