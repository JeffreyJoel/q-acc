"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState, useEffect } from "react";
import Stats from "./Stats";
import { MyVerifications } from "./MyVerification";
import { Address } from "viem";
import { useAccount } from "wagmi";
import DonorSupports from "./DonorSupports";
import { useSearchParams } from "next/navigation";
import { useAddressWhitelist } from "@/hooks/useAddressWhitelist";
import MyProjects from "./MyProjects";

interface ProfileTabProps {
  userAddress: Address;
}

export default function ProfileTab({ userAddress }: ProfileTabProps) {
  const { data: addrWhitelist } = useAddressWhitelist();
  const { address: ConnectedUserAddress } = useAccount();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    
    if (addrWhitelist) {
      switch (urlTab) {
        case "contributions":
          setActiveTab("tokens");
          break;
        case "verification":
          setActiveTab("verifications");
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
          setActiveTab("tokens");
          break;
        default:
          setActiveTab("stats");
          break;
      }
    }
  }, [searchParams, addrWhitelist]);

  return (
    <div className="mt-12 rounded-2xl">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="bg-transparent p-0 h-auto mb-8">
          <TabsTrigger
            value="stats"
            className={`px-6 py-3 rounded-full ${
              activeTab === "stats"
                ? "bg-neutral-800 shadow-sm text-peach-400"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            My Stats
          </TabsTrigger>

          <TabsTrigger
            value="projects"
            className={`px-6 py-3 rounded-full ${
              activeTab === "projects"
                ? "bg-neutral-800 shadow-sm text-peach-400"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("projects")}
          >
            My Projects
          </TabsTrigger>

          <TabsTrigger
            value="tokens"
            className={`px-6 py-3 rounded-full ${
              activeTab === "tokens"
                ? "bg-neutral-800 shadow-sm text-peach-400"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("tokens")}
          >
            My Tokens
          </TabsTrigger>
          {userAddress === ConnectedUserAddress && (
            <TabsTrigger
              value="verifications"
              className={`px-6 py-3 rounded-full ${
                activeTab === "verifications"
                  ? "bg-neutral-800 shadow-sm text-peach-400"
                  : "bg-transparent"
              }`}
              onClick={() => setActiveTab("verifications")}
            >
              My Verifications
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="stats" className="">
          <Stats />
        </TabsContent>

        <TabsContent value="projects" className="">
          <MyProjects />
        </TabsContent>

        <TabsContent value="tokens" className="">
          <DonorSupports />
        </TabsContent>

        {userAddress === ConnectedUserAddress && (
          <TabsContent value="verifications" className="">
            <MyVerifications />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
