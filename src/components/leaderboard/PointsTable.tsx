"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { LeaderboardItem } from "./LeaderboardItem";
import { useFetchLeaderBoard } from "@/hooks/useFetchLeaderBoard";
import { SortDirection, SortField, ILeaderBoardInfo } from "@/services/points.service";
import { ArrowDownUp } from "lucide-react";
import { Pagination } from "./Pagination";
import { useFetchUser } from "@/hooks/useFetchUser";
import { Spinner } from "../loaders/Spinner";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { UserInfo } from "./UserInfo";
import { LeaderboardUser } from "@/types/leaderboard";

const LEADERBOARD_STORAGE_KEY = 'leaderboardData';
const MAX_CACHE_AGE_MS = 1000 * 60 * 7;

type LeaderboardQueryData = ILeaderBoardInfo['getUsersByQaccPoints'] | undefined;

interface StoredLeaderboardData {
  timestamp: number;
  data: LeaderboardQueryData;
  sortField: SortField;
  sortDirection: SortDirection;
}

const getInitialLeaderboardData = (): LeaderboardQueryData => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    const storedItem = sessionStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!storedItem) return undefined;

    const parsedItem: StoredLeaderboardData = JSON.parse(storedItem);

    if (Date.now() - parsedItem.timestamp < MAX_CACHE_AGE_MS) {
  
      return parsedItem.data;
    }
  } catch (error) {
    console.error("Error reading leaderboard from session storage:", error);
    sessionStorage.removeItem(LEADERBOARD_STORAGE_KEY);
  }
  return undefined;
};

export function PointsTable() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("Rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("ASC");
  const [page, setPage] = useState(0);
  const LIMIT = 15;
  const FETCH_ALL_LIMIT = 5000;
  const { address } = useAccount();


  const [initialData] = useState<LeaderboardQueryData>(() => getInitialLeaderboardData());

  const { data: user } = useFetchUser(!!address, address as Address);

  const { data: leaderboardInfo, isLoading } = useFetchLeaderBoard(
    FETCH_ALL_LIMIT,
    0,
    {
      field: sortField,
      direction: sortDirection,
    },
    initialData 
  );
  
  useEffect(() => {
    setPage(0);

  }, [searchQuery, sortField, sortDirection]);

  const filteredAndSortedUsers = useMemo(() => {
    if (!leaderboardInfo?.users) {
      return [];
    }

    let users = [...leaderboardInfo.users];

    if (searchQuery) {
      users = users.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.walletAddress?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return users;
  }, [leaderboardInfo?.users, searchQuery, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortField(field);
      setSortDirection("DESC");
    }
  };

  const handleUserClick = (userAddress: string) => {
    router.push(`/profile/${userAddress}`);
  };

  const total = filteredAndSortedUsers.length;
  const totalPages = Math.ceil(total / LIMIT);
  const paginatedUsers = useMemo(() => {
    const start = page * LIMIT;
    const end = start + LIMIT;
    return filteredAndSortedUsers.slice(start, end);
  }, [filteredAndSortedUsers, page, LIMIT]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <UserInfo/>

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
            <Spinner size={32} />
          </div>
        )}

        {paginatedUsers.map((item) => (
          <LeaderboardItem
            key={item.id}
            user={item as LeaderboardUser}
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
