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
import { Spinner } from "@/components/loaders/Spinner";
import {
  ProjectsTokensSkeleton,
  TabContentSkeleton,
  VerificationsSkeleton,
} from "@/components/loaders/ProfilePageLoaders";

interface ProfileTabProps {
  userAddress: Address;
}

export default function ProfileTab({ userAddress }: ProfileTabProps) {
  const [activeTab, setActiveTab] = useState("stats");

  const { data: addrWhitelist, isLoading: whitelistLoading } =
    useAddressWhitelist();
  const { loading: donorContextLoading } = useDonorContext();
  const { address: wagmiAddress } = useAccount();
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

  // Function to handle tab changes and update URL
  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);

      const params = new URLSearchParams(searchParams.toString());

      // Map internal tab names to URL-friendly names
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
        // default:
        //   params.set("tab", "stats");
        //   break;
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Initialize tab from URL params
  useEffect(() => {
    const urlTab = searchParams.get("tab");

    // Map URL-friendly names back to internal tab names (reverse of handleTabChange)
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
        setActiveTab("stats"); // Default tab when no tab param or unrecognized tab
        break;
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
            onClick={() => handleTabChange("stats")}
            disabled={isLoading}
          >
            {profileLabel} Stats
          </TabsTrigger>

          {isOwnProfile && addrWhitelist && (
            <TabsTrigger
              value="projects"
              className={`px-6 py-3 rounded-full ${
                activeTab === "projects"
                  ? "bg-neutral-800 shadow-sm text-peach-400"
                  : "bg-transparent"
              }`}
              onClick={() => handleTabChange("projects")}
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
            onClick={() => handleTabChange("tokens")}
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
