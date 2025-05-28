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
import { useLogout } from "@privy-io/react-auth";
import { shortenAddress } from "@/helpers/address";
import { useDisconnect } from "wagmi";
import { getLocalStorageToken } from "@/helpers/generateJWT";
// import { WalletsDialog } from "@privy-io/react-auth/ui";

interface WalletDisplayProps {
  walletAddress?: string;
}

export const WalletDisplay = ({ walletAddress }: WalletDisplayProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { logout } = useLogout();
  const { disconnect } = useDisconnect();
  const toggleDropdown = () => setIsMenuOpen(!isMenuOpen);

  function handleLogout() {
    logout();
    disconnect();
    const localStorageToken = getLocalStorageToken(walletAddress!);
    if (localStorageToken) {
      localStorage.removeItem('token');
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
