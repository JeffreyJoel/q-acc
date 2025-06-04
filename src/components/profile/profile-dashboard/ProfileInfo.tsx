"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "../../shared/CopyButton";
import Image from "next/image";
import { useFetchUser } from "@/hooks/useFetchUser";
import { Address } from "viem";
import { roundPoints } from "@/helpers/points";
import { GitcoinVerificationBadge } from "../../verification-badges/GitcoinVerificationBadge";
import { PrivadoVerificationBadge } from "../../verification-badges/PrivadoVerificationBadge";
import { useAccount } from "wagmi";
import { ProjectCreationModal } from "../../project/create/ProjectCreationModal";
import { ProjectFormData } from "../../project/create/ProjectCreationForm";
import { useRouter } from "next/navigation";
import { useModal } from "@/contexts/ModalContext";
import { useAddressWhitelist } from "@/hooks/useAddressWhitelist";
import { getIpfsAddress } from "@/helpers/image";

export default function ProfileInfo({ userAddress }: { userAddress: Address }) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const { data: user, isLoading } = useFetchUser(
    !!userAddress,
    userAddress as Address
  );
  const useWhitelist = useAddressWhitelist();
  const { address: ConnectedUserAddress, isConnected } = useAccount();

  const handleProjectSuccess = (projectData: ProjectFormData) => {
    console.log("Project created successfully:", projectData);
    // Example: redirect to projects page or show success message
    // router.push('/projects'); // uncomment if you want to redirect
  };

  const { openUpdateProfileModal } = useModal();

  const openProjectModal = () => {
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
  };

  useEffect(() => {
    if (isConnected && userAddress === ConnectedUserAddress) {
      setIsUserLoggedIn(true);
    }
  }, [isConnected, userAddress, ConnectedUserAddress]);

  console.log(user);

  let avatar;
  if (user?.avatar && !user.avatar.includes("https://gateway.pinata.cloud")) {
    avatar = getIpfsAddress(user.avatar);
  } else {
    avatar = user?.avatar;
  }

  return (
    <>
      <div className="p-6 bg-neutral-800 rounded-2xl">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="w-[140px] h-[140px] bg-black rounded-lg overflow-hidden mr-4">
              <img
                src={avatar || "/images/user.png"}
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
                  {userAddress.slice(
                    userAddress.length - 8,
                    userAddress.length
                  )}
                  <CopyButton text={userAddress} />
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {isUserLoggedIn && (
              <button
                className="text-peach-400 font-medium hover:text-peach-300 transition-colors"
                onClick={() => openUpdateProfileModal(user)}
              >
                Edit Profile
              </button>
            )}
            {isUserLoggedIn && useWhitelist.data && (
              <button
                onClick={openProjectModal}
                className="bg-peach-400 text-black px-4 py-2 rounded-md font-medium hover:bg-peach-300 transition-colors"
              >
                Create Project
              </button>
            )}
          </div>
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

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        onSuccess={handleProjectSuccess}
      />
    </>
  );
}
