"use client";

import { useAccount } from "wagmi";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useFetchLeaderBoard } from "@/hooks/useFetchLeaderBoard";
import { Address } from "viem";
import { LeaderboardItem } from "./LeaderboardItem";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { LeaderboardUser } from "@/types/leaderboard";

export const UserInfo = () => {
  const { address: wagmiAddress } = useAccount();
  const { authenticated, user: privyUser } = usePrivy();

  const ConnectedUserAddress = privyUser?.wallet?.address || wagmiAddress;
  const { data: user } = useFetchUser(!!ConnectedUserAddress, ConnectedUserAddress as Address);
  const router = useRouter();

  const { data: leaderboardInfo, isLoading } = useFetchLeaderBoard(2000, 0, {
    field: "Rank",
    direction: "ASC",
  });

  // Check if user is authenticated and has a connected wallet
  const shouldShowUserInfo = useMemo(() => {
    return authenticated && ConnectedUserAddress && user;
  }, [authenticated, ConnectedUserAddress, user]);

  // Create user info object for display
  const userInfo = useMemo(() => {
    if (!shouldShowUserInfo || !user) return null;

    // Try to find user in leaderboard data first
    const leaderboardUser = leaderboardInfo?.users.find(
      (lbUser) => lbUser.id === user.id
    );

    if (leaderboardUser) {
      // User is in the leaderboard, use their actual ranking and data
      return leaderboardUser;
    }

    // User is not in leaderboard, create fallback object
    return {
      id: user.id,
      name: user.fullName || 'Anonymous User',
      email: user.email,
      avatar: user.avatar,
      qaccPoints: user.qaccPoints || 0,
      qaccPointsMultiplier: user.qaccPointsMultiplier || null,
      projectsFundedCount: user.projectsFundedCount || 0,
      walletAddress: user.walletAddress || ConnectedUserAddress,
      rank: 0, // 0 means unranked - will show as "N/A" in LeaderboardItem
      username: user.username,
    } as LeaderboardUser;
  }, [shouldShowUserInfo, user, leaderboardInfo?.users, ConnectedUserAddress]);

  const handleUserClick = (userAddress: string) => {
    router.push(`/profile/${userAddress}`);
  };

  // Show user info if they're authenticated and we have user data
  if (shouldShowUserInfo && userInfo) {
    return (
      <div className="my-6">
        <h2 className="text-base font-medium mb-3 font-tusker-8">
          Your Ranking
        </h2>
        <LeaderboardItem user={userInfo} onUserClick={handleUserClick} />
      </div>
    );
  }

  // Don't render anything if user is not authenticated or no user data
  return null;
};
