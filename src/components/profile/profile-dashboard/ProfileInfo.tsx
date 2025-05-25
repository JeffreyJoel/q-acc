"use client";

import { Fingerprint } from "lucide-react";
import { CopyButton } from "../../shared/CopyButton";
import Image from "next/image";
import { useFetchUser } from "@/hooks/useFetchUser";
import { Address } from "viem";
import { roundPoints } from "@/helpers/points";
import { GitcoinVerificationBadge } from "../../verification-badges/GitcoinVerificationBadge";
import { PrivadoVerificationBadge } from "../../verification-badges/PrivadoVerificationBadge";

export default function ProfileInfo({ userAddress }: { userAddress: Address }) {
  const { data: user, isLoading } = useFetchUser(
    !!userAddress,
    userAddress as Address
  );

  return (
    <div className="p-6 bg-neutral-800 rounded-2xl">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="w-[140px] h-[140px] bg-black rounded-lg overflow-hidden mr-4">
            <img
              src={user?.avatar || "/images/user.png"}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="text-2xl font-bold">{user?.fullName}</p>
            <p className="text-neutral-300">{user?.email}</p>

            <div className="flex items-center text-neutral-300">
              <span className="font-mono">
                {" "}
                {userAddress.slice(0, 8)}...
                {userAddress.slice(userAddress.length - 8, userAddress.length)}
                <CopyButton text={userAddress} />
              </span>
            </div>
          </div>
        </div>

        {user?.isSignedIn && (
          <button className="text-peach-400 font-medium hover:text-peach-300 transition-colors">
            Edit Profile
          </button>
        )}
      </div>

      <div className="mt-8 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center border-peach-100/30 border-[1px] border-r-4 border-b-4 shadow-sm rounded-xl px-4 py-2">
          <span className="text-neutral-300 mr-2">Your q/acc points</span>
          <div className="bg-black rounded-full w-5 h-5 flex items-center justify-center mr-1">
            <Image
              src="/images/logos/round_logo.png"
              alt="Q"
              width={16}
              height={16}
              priority
            />
          </div>
          <span className="font-bold ml-3">
            {roundPoints(user?.qaccPoints || 0).toLocaleString("en-US")}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <GitcoinVerificationBadge userAddress={userAddress} />
          <PrivadoVerificationBadge userAddress={userAddress} />
        </div>
      </div>
    </div>
  );
}
