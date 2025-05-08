"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { leaderboardData } from "@/data/leaderboard";

export function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = leaderboardData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full max-w-3xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <Input
            type="text"
            className="block w-full p-6 pl-10 text-sm text-white bg-neutral-800 rounded-full focus:ring-peach-400 focus:border-peach-400 outline-none"
            placeholder="Search users by username, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-neutral-600 hover:bg-neutral-500 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>

      {filteredData.find((item) => item.isCurrentUser) && (
        <div className="my-6">
          <h2 className="text-base font-medium mb-3 font-tusker-8">
            Your Ranking
          </h2>
          {filteredData
            .filter((item) => item.isCurrentUser)
            .map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-neutral-800 rounded-3xl p-4 border border-peach-400"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`
                  flex items-center justify-center 
                  w-12 h-12 rounded-full 
                  ${
                    item.rank <= 3
                      ? "bg-peach-400 text-black"
                      : "bg-[#3a3a3a] text-white"
                  }
                  font-bold text-2xl
                `}
                  >
                    {item.rank}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-[#3a3a3a]">
                        <AvatarImage
                          src={item.avatar}
                          alt={item.name}
                          className="object-cover h-full w-full rounded-full"
                        />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium text-lg">{item.name}</span>
                      <span className="text-sm text-gray-400">{item.role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                  </div>
                  <div className="text-xl font-mono font-semibold">
                    {item.points.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Leaderboard Section */}
      <div className="space-y-3 my-6">
        <h2 className="text-base font-medium mb-6 font-tusker-8">
          Leaderboard
        </h2>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-12">
            <span className="text-base text-center font-bold text-neutral-400">Rank</span>
            <span className="text-base text-center font-bold text-neutral-400">User</span>
          </div>

          <div className="flex items-center gap-10">
            <span className="text-base text-center font-bold text-gray-400">q/acc Points</span>
            <span className="text-base text-center font-bold text-gray-400">Projects Funded</span>
          </div>
        </div>
        {filteredData
          .filter((item) => !item.isCurrentUser)
          .map((item) => (
            <div
              key={item.id}
              className={`
              flex items-center justify-between 
              bg-neutral-800 rounded-3xl p-4
            `}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                flex items-center justify-center 
                w-12 h-12 rounded-full 
                ${
                  item.rank <= 3
                    ? "bg-peach-400 text-black"
                    : "bg-[#3a3a3a] text-white"
                }
                font-bold text-2xl
              `}
                >
                  {item.rank}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-[#3a3a3a]">
                      <AvatarImage
                        src={item.avatar}
                        alt={item.name}
                        className="object-cover h-full w-full rounded-full"
                      />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium text-lg">{item.name}</span>
                    <span className="text-sm text-gray-400">{item.role}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-36">
                <div className="flex flex-col items-end">
                  <span className="text-xl font-mono font-semibold">
                    {item.points.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-mono font-semibold">
                    {item.projectsFunded || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
