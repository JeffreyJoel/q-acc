"use client";

import { DonorProvider } from "@/contexts/donor.context";
import ProfileInfo from "@/components/profile/profile-dashboard/ProfileInfo";
import ProfileTab from "@/components/profile/profile-dashboard/ProfileTab";
import { Address } from "viem";
import { ProjectCreationProvider } from "@/contexts/projectCreation.context";

interface ProfileViewProps {
  userAddress: Address;
}

export default function ProfileDashboardView({ userAddress }: ProfileViewProps) {
  return (
    <>
      <ProjectCreationProvider>
        <DonorProvider address={userAddress}>
          <ProfileInfo userAddress={userAddress} />
          <ProfileTab userAddress={userAddress} />
        </DonorProvider>
      </ProjectCreationProvider>
    </>
  );
}
