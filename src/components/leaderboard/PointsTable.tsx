"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { LeaderboardItem } from "./LeaderboardItem";

import { useFetchLeaderBoard } from "@/hooks/useFetchLeaderBoard";
import { SortDirection, SortField } from "@/services/points.service";
import { ArrowDownUp } from "lucide-react";
import { Pagination } from "./Pagination";
import { useFetchUser } from "@/hooks/useFetchUser";
import { Spinner } from "../loaders/Spinner";

export function PointsTable() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("Rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("ASC");
  const [page, setPage] = useState(0);
  const LIMIT = 15;

  const { data: user } = useFetchUser();

  const { data: leaderboardInfo, isLoading } = useFetchLeaderBoard(
    LIMIT,
    page * LIMIT,
    {
      field: sortField,
      direction: sortDirection,
    }
  );

  const userInfo = leaderboardInfo?.users?.find(
    (cuser) => cuser.id === user?.id
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortField(field);
      setSortDirection("DESC");
    }
    setPage(0);
  };

  const handleUserClick = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  const total = leaderboardInfo?.totalCount ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {userInfo && (
        <div className="my-6">
          <h2 className="text-base font-medium mb-3 font-tusker-8">
            Your Ranking
          </h2>
          <LeaderboardItem user={userInfo} onUserClick={handleUserClick} />
        </div>
      )}

      <div className="space-y-3 my-6">
        <h2 className="text-xl font-medium mb-6 font-tusker-8">Leaderboard</h2>

        <div className="grid grid-cols-[40px_1fr_120px_120px] sm:grid-cols-[50px_1fr_150px_150px] gap-4 px-4 py-2">
          <div className="text-xs sm:text-sm font-bold text-neutral-400 text-center">
            Rank
          </div>
          <div className="text-xs sm:text-sm font-bold text-neutral-400">
            User
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs sm:text-sm font-bold text-gray-400">
              <span className="hidden sm:inline">q/acc </span>Points
            </span>
            <button
              onClick={() => toggleSort("QaccPoints")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowDownUp className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs sm:text-sm font-bold text-gray-400">
              <span className="hidden sm:inline">Projects </span>Funded
            </span>
            <button
              onClick={() => toggleSort("ProjectsFundedCount")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowDownUp className="w-3 h-3" />
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Spinner size={64} />
          </div>
        )}

        {leaderboardInfo?.users.map((item) => (
          <LeaderboardItem
            key={item.id}
            user={item}
            onUserClick={handleUserClick}
          />
        ))}

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
