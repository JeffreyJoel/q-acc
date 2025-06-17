"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState, useMemo, useCallback, useEffect } from "react";
import Stats from "./Stats";
import { MyVerifications } from "./MyVerification";
import { Address } from "viem";
import { useAccount } from "wagmi";
import DonorSupports from "./DonorSupports";
import { useSearchParams, useRouter } from "next/navigation";
import { useAddressWhitelist } from "@/hooks/useAddressWhitelist";
import MyProjects from "./MyProjects";
import { usePrivy } from "@privy-io/react-auth";
import { useDonorContext } from "@/contexts/donor.context";
import {
  ProjectsTokensSkeleton,
  TabContentSkeleton,
  VerificationsSkeleton,
} from "@/components/loaders/ProfilePageLoaders";
import { useFetchProjectByUserId } from "@/hooks/useProjects";
import { fetchUserDonationsCount } from "@/services/donation.service";

interface ProfileTabProps {
  userAddress: Address;
}

export default function ProfileTab({ userAddress }: ProfileTabProps) {
  const [activeTab, setActiveTab] = useState("stats");
  const [donationCount, setDonationCount] = useState(0);

  const { data: addrWhitelist, isLoading: whitelistLoading } =
    useAddressWhitelist();
  const { loading: donorContextLoading, user } = useDonorContext();
  const { address: wagmiAddress } = useAccount();
  const { data: projectData } = useFetchProjectByUserId(
    user?.id ? parseInt(user.id) : 0
  );
  const { user: privyUser } = usePrivy();
  const searchParams = useSearchParams();
  const router = useRouter();

  const ConnectedUserAddress = privyUser?.wallet?.address || wagmiAddress;

  const isOwnProfile = useMemo(() => {
    return (
      ConnectedUserAddress &&
      userAddress.toLowerCase() === ConnectedUserAddress.toLowerCase()
    );
  }, [ConnectedUserAddress, userAddress]);

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);

      const params = new URLSearchParams(searchParams.toString());

      switch (tab) {
        case "tokens":
          params.set("tab", "contributions");
          break;
        case "verifications":
          params.set("tab", "verification");
          break;
        case "stats":
          params.set("tab", "stats");
          break;
        case "projects":
          params.set("tab", "projects");
          break;
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    const urlTab = searchParams.get("tab");

    switch (urlTab) {
      case "contributions":
        setActiveTab("tokens");
        break;
      case "verification":
        setActiveTab(isOwnProfile ? "verifications" : "stats");
        break;
      case "projects":
        setActiveTab(isOwnProfile && addrWhitelist ? "projects" : "stats");
        break;
      case "stats":
        setActiveTab("stats");
        break;
      default:
        setActiveTab("stats");
        break;
    }
  }, [searchParams, isOwnProfile]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        return;
      }
      try {
        const res = await fetchUserDonationsCount(parseInt(user?.id));
        if (res) {
          setDonationCount(res.totalCount);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  });

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
            onClick={() => handleTabChange("stats")}
            disabled={isLoading}
          >
            {profileLabel} Stats
          </TabsTrigger>

          {isOwnProfile && addrWhitelist && (
            <TabsTrigger
              value="projects"
              className={`px-6 py-3 flex gap-2 items-center rounded-full ${
                activeTab === "projects"
                  ? "bg-neutral-800 shadow-sm text-peach-400"
                  : "bg-transparent"
              }`}
              onClick={() => handleTabChange("projects")}
              disabled={isLoading}
            >
              <span>{profileLabel} Projects</span>
              <span
                className={`inline-flex items-center text-xs  min-w-6 min-h-6 font-medium rounded-full justify-center ${
                  activeTab === "projects"
                    ? "bg-peach-400 text-neutral-900"
                    : "bg-neutral-700 text-white"
                }`}
              >
                {!projectData ? 0 : 1}
              </span>
            </TabsTrigger>
          )}

          <TabsTrigger
            value="tokens"
            className={`px-6 py-3 flex gap-2 items-center rounded-full ${
              activeTab === "tokens"
                ? "bg-neutral-800 shadow-sm text-peach-400"
                : "bg-transparent"
            }`}
            onClick={() => handleTabChange("tokens")}
            disabled={isLoading}
          >
            <span>{profileLabel} Tokens</span>
            <span
              className={`inline-flex items-center text-xs  min-w-6 min-h-6 font-medium rounded-full justify-center ${
                activeTab === "tokens"
                  ? "bg-peach-400 text-neutral-900"
                  : "bg-neutral-700 text-white"
              }`}
            >
              {donationCount}
            </span>
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger
              value="verifications"
              className={`px-6 py-3 rounded-full ${
                activeTab === "verifications"
                  ? "bg-neutral-800 shadow-sm text-peach-400"
                  : "bg-transparent"
              }`}
              onClick={() => handleTabChange("verifications")}
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
            {isLoading ? (
              <ProjectsTokensSkeleton />
            ) : (
              <MyProjects projectData={projectData!} />
            )}
          </TabsContent>
        )}
        <TabsContent value="tokens" className="">
          {isLoading ? <ProjectsTokensSkeleton /> : <DonorSupports isOwnProfile={!!isOwnProfile} />}
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
