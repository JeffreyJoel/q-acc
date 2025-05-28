import { useAccount } from "wagmi";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useFetchLeaderBoard } from "@/hooks/useFetchLeaderBoard";
import { Address } from "viem";
import { LeaderboardItem } from "./LeaderboardItem";
import { useRouter } from "next/navigation";

export const UserInfo = () => {
  const { address } = useAccount();
  const { data: user } = useFetchUser(!!address, address as Address);
  const router = useRouter();

  const { data: leaderboardInfo, isLoading } = useFetchLeaderBoard(2000, 0, {
    field: "Rank",
    direction: "ASC",
  });

  const userInfo = leaderboardInfo?.users.find(
    (cuser) => cuser.id === user?.id
  );

  const handleUserClick = (userAddress: string) => {
    router.push(`/profile/${userAddress}`);
  };

  if (userInfo) {
    return (
      <div className="my-6">
        <h2 className="text-base font-medium mb-3 font-tusker-8">
          Your Ranking
        </h2>
        <LeaderboardItem user={userInfo} onUserClick={handleUserClick} />
      </div>
    );
  }
};
