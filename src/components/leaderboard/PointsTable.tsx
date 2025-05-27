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

const LEADERBOARD_STORAGE_KEY = 'leaderboardData';
const MAX_CACHE_AGE_MS = 1000 * 60 * 7; // 7 minutes (a bit more than refetch interval to allow for active tab)

// Type for the data returned by fetchLeaderBoard and used by the query
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
    // Also check if sort order matches, otherwise initialData might be incorrectly sorted for the first render
    // This part is tricky if we want to reuse cache across different initial sorts.
    // For simplicity, let's assume we only use cache if sort is also the same or rely on hook to fetch if sort mismatches.
    // Or, we could store separate caches per sort order, but that adds complexity.

    if (Date.now() - parsedItem.timestamp < MAX_CACHE_AGE_MS) {
      // We could also check here if parsedItem.sortField and parsedItem.sortDirection match the initial state
      // to ensure the cache is relevant for the current view. For now, let's keep it simpler.
      return parsedItem.data;
    }
  } catch (error) {
    console.error("Error reading leaderboard from session storage:", error);
    sessionStorage.removeItem(LEADERBOARD_STORAGE_KEY); // Clear corrupted item
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

  // Get initial data from session storage for the hook
  // Note: This function runs once on component initialization for useState.
  const [initialData] = useState<LeaderboardQueryData>(() => getInitialLeaderboardData());

  const { data: user } = useFetchUser(!!address, address as Address);

  const { data: leaderboardInfo, isLoading } = useFetchLeaderBoard(
    FETCH_ALL_LIMIT,
    0,
    {
      field: sortField,
      direction: sortDirection,
    },
    initialData // Pass initial data to the hook
  );

  const userInfo = leaderboardInfo?.users?.find(
    (cuser) => cuser.id === user?.id
  );

  useEffect(() => {
    setPage(0);
    // When sortField or sortDirection changes, the hook will refetch.
    // Session storage is updated by the hook on successful fetch.
    // We don't strictly need to clear session storage here if hook handles it,
    // but if initial sort criteria changes, the cached `initialData` might be for a different sort order.
    // The hook's queryKey includes sortField/Direction, so it will fetch new data if they change.
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
            <Spinner size={32} />
          </div>
        )}

        {paginatedUsers.map((item) => (
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
