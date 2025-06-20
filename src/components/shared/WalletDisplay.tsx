"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  LogOut,
  UserCircle2,
  UserCircleIcon,
  Wallet,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogout } from "@privy-io/react-auth";
import { shortenAddress } from "@/helpers/address";
import { useDisconnectAndLogout } from "@/hooks/useDisconnectAndLogout";
import { getLocalStorageToken } from "@/helpers/generateJWT";
import { useQueryClient } from "@tanstack/react-query";

import { UserPill } from "@privy-io/react-auth/ui";

interface WalletDisplayProps {
  walletAddress?: string;
}

export const WalletDisplay = ({ walletAddress }: WalletDisplayProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { disconnect } = useDisconnectAndLogout();
  const queryClient = useQueryClient();

  const { logout } = useLogout({
    onSuccess: () => {
      console.log("User successfully logged out");

      // Clear query cache
      queryClient.clear();

      // Clean up localStorage
      if (walletAddress) {
        const localStorageToken = getLocalStorageToken(walletAddress);
        if (localStorageToken) {
          localStorage.removeItem("token");
        }
      } else {
        localStorage.removeItem("token");
      }

      // Clean up any other auth-related localStorage items
      const authRelatedKeys = ["token"];
      authRelatedKeys.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove ${key} from localStorage:`, error);
        }
      });

      router.push("/");
    },
  });

  const toggleDropdown = () => setIsMenuOpen(!isMenuOpen);
  const closeDropdown = () => setIsMenuOpen(false);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Check if the click is on a UserPill modal or any modal with high z-index
        const target = event.target as Element;
        const isModalClick =
          target.closest("[data-radix-popper-content-wrapper]") ||
          target.closest('[role="dialog"]') ||
          target.closest('[data-state="open"]') ||
          target.closest(".privy-modal") ||
          target.closest("[data-privy-modal]");

        if (!isModalClick) {
          closeDropdown();
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  async function handleLogout() {
    try {
      closeDropdown();

      await disconnect();

      await logout();

      queryClient.clear();

      if (walletAddress) {
        const localStorageToken = getLocalStorageToken(walletAddress);
        if (localStorageToken) {
          localStorage.removeItem("token");
        }
      } else {
        localStorage.removeItem("token");
      }

      // Clean up any other auth-related localStorage items
      const authRelatedKeys = ["token"];
      authRelatedKeys.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove ${key} from localStorage:`, error);
        }
      });
    } catch (error) {
      console.error("Error during logout:", error);

      // Still try to clean up storage even if logout/disconnect fails
      try {
        queryClient.clear();
        localStorage.removeItem("token");
        sessionStorage.removeItem("leaderboardData");
        router.push("/");
      } catch (cleanupError) {
        console.warn(
          "Failed to cleanup storage during error handling:",
          cleanupError
        );
      }
    }
  }

  const handleMyAccountClick = () => {
    closeDropdown();
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {/* Ensure UserPill modals appear above dropdown */}
      <style jsx global>{`
        [data-radix-popper-content-wrapper],
        [role="dialog"],
        .privy-modal,
        [data-privy-modal] {
          z-index: 100 !important;
        }
      `}</style>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 bg-neutral-800 px-4 py-3 rounded-full border border-peach-400/30 shadow-sm hover:bg-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-peach-400/50"
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          <UserCircleIcon className="h-5 w-5" />
          <span className="hidden sm:block text-sm font-medium text-gray-200">
            {walletAddress ? shortenAddress(walletAddress) : "0x0000...0000"}
          </span>
          <ChevronDown
            className={`h-4 w-4 hidden sm:block transition-transform duration-200 ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-neutral-800 rounded-2xl shadow-xl ring-1 ring-white/10 z-40 animate-in slide-in-from-top-2 duration-200">
            {/* Header with UserPill */}
            <div className="py-2 border-b border-neutral-700 relative">
              <div className="cursor-pointer hover:bg-peach-400/10 [&_.privy-modal]:z-[100] [&_[role='dialog']]:z-[100] [&_[data-radix-popper-content-wrapper]]:z-[100]">
                <UserPill
                  expanded={true}
                  ui={{
                    minimal: false,
                    background: "secondary",
                  }}
                  label={
                    <span className="w-full flex items-center gap-3 text-left transition-colors duration-150 text-gray-200">
                      <Wallet className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Manage Wallets
                      </span>
                    </span>
                  }
                />
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href={`/profile/${walletAddress}`}
                onClick={handleMyAccountClick}
              >
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-peach-400/10 transition-colors duration-150 text-gray-200">
                  <UserCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">My Account</span>
                </div>
              </Link>
              {/* 
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-peach-400/10 transition-colors duration-150 text-gray-200"
              >
                <HelpCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Need Help?</span>
              </button> */}

              {/* Divider */}
              <div className="my-2 border-t border-neutral-700" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-500/10 transition-colors duration-150 text-red-400"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
