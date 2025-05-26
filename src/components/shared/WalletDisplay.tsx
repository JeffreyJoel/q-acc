"use client";

import { useState } from "react";
import { ChevronDown, LogOut, UserCircle2, UserCircleIcon, Wallet } from "lucide-react";
import Link from "next/link";
import { useModal, useLogout } from "@getpara/react-sdk";
import { shortenAddress } from "@/helpers/address";

interface WalletDisplayProps {
  walletAddress?: string;
}

export const WalletDisplay = ({ walletAddress }: WalletDisplayProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useModal();
  const { logout } = useLogout();
  const toggleDropdown = () => setIsMenuOpen(!isMenuOpen);

  function handleLogout() {
    logout();
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
          {/* <div className="px-2 py-3 text-sm text-gray-700"> */}
          {/* <div className="font-bold text-sm text-peach-400 mb-2">WALLET</div> */}
          <div
            className="hover:bg-peach-400/10 flex items-center gap-2 mx-2 px-4 py-3 rounded-xl cursor-pointer text-base ext-gray-200"
            onClick={() => openModal()}
          >
            <Wallet /> Wallet
          </div>
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
