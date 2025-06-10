"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState, useMemo, useCallback } from "react";
import Stats from "./Stats";
import { MyVerifications } from "./MyVerification";
import { Address } from "viem";
import { useAccount } from "wagmi";
import DonorSupports from "./DonorSupports";
import { useSearchParams } from "next/navigation";
import { useAddressWhitelist } from "@/hooks/useAddressWhitelist";
import MyProjects from "./MyProjects";
import { usePrivy } from "@privy-io/react-auth";
import { useDonorContext } from "@/contexts/donor.context";
import { Spinner } from "@/components/loaders/Spinner";

interface ProfileTabProps {
  userAddress: Address;
}

// Loading skeleton component for tab content
const TabContentSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-24 bg-neutral-800 rounded-lg animate-pulse"></div>
      <div className="h-24 bg-neutral-800 rounded-lg animate-pulse"></div>
      <div className="h-24 bg-neutral-800 rounded-lg animate-pulse"></div>
    </div>
    <div className="space-y-4">
      <div className="h-32 bg-neutral-800 rounded-lg animate-pulse"></div>
      <div className="h-32 bg-neutral-800 rounded-lg animate-pulse"></div>
      <div className="h-32 bg-neutral-800 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

// Loading skeleton for projects/tokens content
const ProjectsTokensSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-6 bg-neutral-800 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-neutral-700 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-neutral-700 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-neutral-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-700 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-neutral-700 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Loading skeleton for verifications
const VerificationsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neutral-700 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-700 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-neutral-700 rounded w-16 animate-pulse"></div>
            </div>
          </div>
          <div className="h-8 bg-neutral-700 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function ProfileTab({ userAddress }: ProfileTabProps) {
  const [activeTab, setActiveTab] = useState("stats");

  const { data: addrWhitelist, isLoading: whitelistLoading } = useAddressWhitelist();
  const { loading: donorContextLoading } = useDonorContext();
  const { address: wagmiAddress } = useAccount();
  const { user: privyUser } = usePrivy();
  const searchParams = useSearchParams();

  const ConnectedUserAddress = privyUser?.wallet?.address || wagmiAddress;

  const isOwnProfile = useMemo(() => {
    return (
      ConnectedUserAddress &&
      userAddress.toLowerCase() === ConnectedUserAddress.toLowerCase()
    );
  }, [ConnectedUserAddress, userAddress]);

  useCallback(() => {
    const urlTab = searchParams.get("tab");
    if (addrWhitelist) {
      switch (urlTab) {
        case "contributions":
          setActiveTab("tokens");
          break;
        case "verification":
          setActiveTab(isOwnProfile ? "verifications" : "stats");
          break;
        default:
          setActiveTab("stats");
          break;
      }
    } else {
      switch (urlTab) {
        case "contributions":
          setActiveTab("stats");
          break;
        case "verification":
          setActiveTab(isOwnProfile ? "verifications" : "tokens");
          break;
        default:
          setActiveTab("stats");
          break;
      }
    }
  }, [searchParams, isOwnProfile]);

  const profileLabel = isOwnProfile ? "My" : "User";
  const isLoading = donorContextLoading || whitelistLoading;

  return (
    <div className="mt-12 rounded-2xl">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="bg-transparent flex flex-nowrap p-0 h-auto mb-8">
          <TabsTrigger
            value="stats"
            className={`px-3 py-2 sm:py-3 sm:px-6 flex-none rounded-full ${
              activeTab === "stats"
                ? "bg-neutral-800 shadow-sm text-peach-400"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("stats")}
            disabled={isLoading}
          >
            {profileLabel} Stats
          </TabsTrigger>

          {isOwnProfile && (
            <TabsTrigger
              value="projects"
              className={`px-6 py-3 rounded-full ${
                activeTab === "projects"
                  ? "bg-neutral-800 shadow-sm text-peach-400"
                  : "bg-transparent"
              }`}
              onClick={() => setActiveTab("projects")}
              disabled={isLoading}
            >
              {profileLabel} Projects
            </TabsTrigger>
          )}

          <TabsTrigger
            value="tokens"
            className={`px-6 py-3 rounded-full ${
              activeTab === "tokens"
                ? "bg-neutral-800 shadow-sm text-peach-400"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("tokens")}
            disabled={isLoading}
          >
            {profileLabel} Tokens
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger
              value="verifications"
              className={`px-6 py-3 rounded-full ${
                activeTab === "verifications"
                  ? "bg-neutral-800 shadow-sm text-peach-400"
                  : "bg-transparent"
              }`}
              onClick={() => setActiveTab("verifications")}
              disabled={isLoading}
            >
              {profileLabel} Verifications
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="stats" className="">
          {isLoading ? <TabContentSkeleton /> : <Stats />}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="projects" className="">
            {isLoading ? <ProjectsTokensSkeleton /> : <MyProjects />}
          </TabsContent>
        )}

        <TabsContent value="tokens" className="">
          {isLoading ? <ProjectsTokensSkeleton /> : <DonorSupports />}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="verifications" className="">
            {isLoading ? <VerificationsSkeleton /> : <MyVerifications />}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
