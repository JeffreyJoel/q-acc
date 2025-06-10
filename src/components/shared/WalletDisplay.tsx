"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  LogOut,
  UserCircle2,
  UserCircleIcon,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogout } from "@privy-io/react-auth";
import { shortenAddress } from "@/helpers/address";
import { useDisconnectAndLogout } from "@/hooks/useDisconnectAndLogout";
import { getLocalStorageToken } from "@/helpers/generateJWT";
import { useQueryClient } from "@tanstack/react-query";
// import { WalletsDialog } from "@privy-io/react-auth/ui";

interface WalletDisplayProps {
  walletAddress?: string;
}

export const WalletDisplay = ({ walletAddress }: WalletDisplayProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const { logout } = useLogout();
  const { disconnect } = useDisconnectAndLogout();
  const queryClient = useQueryClient();
  const toggleDropdown = () => setIsMenuOpen(!isMenuOpen);

  async function handleLogout() {
    try {
      // Close dropdown first
      setIsMenuOpen(false);
      
      // Disconnect all wagmi connectors first
      await disconnect();
      
      // Then logout from Privy
      await logout();
      
      // Clear React Query cache to remove all user-specific cached data
      queryClient.clear();
      
      // Clean up localStorage - be more thorough
      if (walletAddress) {
        const localStorageToken = getLocalStorageToken(walletAddress);
        if (localStorageToken) {
          localStorage.removeItem('token');
        }
      } else {
        // If no specific wallet address, remove token anyway as a safety measure
        localStorage.removeItem('token');
      }
      
      // Clean up any other auth-related localStorage items
      const authRelatedKeys = ['token'];
      authRelatedKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove ${key} from localStorage:`, error);
        }
      });
      
      // Clean up session storage for cached data like leaderboard
      const sessionStorageKeys = ['leaderboardData'];
      sessionStorageKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove ${key} from sessionStorage:`, error);
        }
      });
      
      // Navigate to home page after successful logout
      router.push('/');
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Still try to clean up storage even if logout/disconnect fails
      try {
        queryClient.clear();
        localStorage.removeItem('token');
        sessionStorage.removeItem('leaderboardData');
        // Navigate to home even if logout had errors
        router.push('/');
      } catch (cleanupError) {
        console.warn('Failed to cleanup storage during error handling:', cleanupError);
      }
    }
  }

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-neutral-800 px-4 py-3 rounded-full border border-peach-400/30 shadow-sm"
      >
        <UserCircleIcon />
        <span className="hidden sm:block text-sm font-medium">
          {walletAddress ? shortenAddress(walletAddress) : "0x0000...0000"}
        </span>
        <ChevronDown className="h-4 w-4 hidden sm:block" />
      </button>

      {isMenuOpen && (
        <div className="absolute block right-0 left-0 mx-auto mt-2 pt-3 w-60 dark bg-neutral-800 rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 ">
          <div
            className="hover:bg-peach-400/10 flex items-center gap-2 mx-2 px-4 py-3 rounded-xl cursor-pointer text-base ext-gray-200"
            // onClick={() => openModal()}
          >
            <Wallet /> Wallet
          </div>
          {/* <UserPill /> */}
          {/* <WalletsDialog /> */}
          <div className="mx-2" />
          <ul className="py-2 px-2 flex flex-col gap-3 text-base text-gray-200">
            <Link href={`/profile/${walletAddress}`}>
              <li className="hover:bg-peach-400/10 flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer">
                <UserCircle2 />
                My Account
              </li>
            </Link>
            <li className="hover:bg-peach-400/10 px-4 py-3 rounded-xl cursor-pointer">
              Do You Need Help?
            </li>
            <li
              className="hover:bg-peach-400/10 flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="" />
              <span className="font-semibold">Sign out</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
