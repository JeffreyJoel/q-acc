"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { shortenAddress } from "@/helpers/address";
import { roundPoints } from "@/helpers/points";
import type { LeaderboardUser } from "@/types/leaderboard";

interface LeaderboardItemProps {
  user: LeaderboardUser;
  onUserClick?: (userAddress: string) => void;
}

export function LeaderboardItem({ user, onUserClick }: LeaderboardItemProps) {
  return (
    <div
      className="grid grid-cols-[40px_1fr_120px_120px] sm:grid-cols-[50px_1fr_150px_150px] gap-4 bg-neutral-800 rounded-3xl p-4 cursor-pointer items-center"
      onClick={() => onUserClick?.(user.walletAddress)}
    >
      <div className="flex justify-center">
        <div
          className={`
            flex items-center justify-center 
            w-8 h-8 sm:w-12 sm:h-12 rounded-full 
            ${user.rank > 0 && user.rank <= 3 ? "bg-peach-400 text-black" : "bg-[#3a3a3a] text-white"}
            font-bold ${user.rank > 0 ? "text-lg sm:text-2xl" : "text-xs sm:text-sm"}
          `}
        >
          {user.rank > 0 ? user.rank : "N/A"}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <Avatar className="h-8 w-8 sm:h-12 sm:w-12 border-2 border-[#3a3a3a]">
            <AvatarImage src={user.avatar ?? ''} />
       
              <AvatarFallback className="text-xs sm:text-base">{user.username?.charAt(0) || user.name?.charAt(0)}</AvatarFallback>
            
          </Avatar>
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-sm sm:text-lg">{user?.username}</span>
          <span className="text-xs sm:text-sm text-gray-400">{shortenAddress(user.walletAddress)}</span>
        </div>
      </div>

      <div className="text-right md:text-center">
        <span className="text-lg sm:text-xl font-mono font-semibold">
          {roundPoints(user.qaccPoints)}
        </span>
      </div>

      <div className="text-right md:text-center">
        <span className="text-lg sm:text-xl font-mono font-semibold">
          {user.projectsFundedCount}
        </span>
      </div>
    </div>
  );
} 