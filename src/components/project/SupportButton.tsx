import { FC, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import useRemainingTime from "@/hooks/useRemainingTime";
import { Button } from "@/components/ui/button";
import { getAdjustedEndDate } from "@/helpers/date";
import { useFetchActiveRoundDetails } from "@/hooks/useRounds";
import { useModal } from "@/contexts/ModalContext";
import { checkUserOwnsNFT } from "@/helpers/token";
import { IProject } from "@/types/project.type";

interface ISupportButtonProps {
  project: IProject;
  disabled?: boolean;
}

export const SupportButton: FC<ISupportButtonProps> = ({
  project,
  disabled,
}) => {
  const { data: activeRoundDetails } = useFetchActiveRoundDetails();
  const { address } = useAccount();
  const router = useRouter();
  const { openInfoModal } = useModal();

  const adjustedEndDate = getAdjustedEndDate(activeRoundDetails?.endDate);
  const remainingTime = useRemainingTime(
    activeRoundDetails?.startDate,
    adjustedEndDate
  );
  const handleSupport = (e: any) => {
    e.stopPropagation();
    async function checkUser() {
      if (activeRoundDetails?.__typename !== "QfRound") {
        console.log(activeRoundDetails);
        const res = await checkUserOwnsNFT(
          project?.abc?.nftContractAddress || "",
          address || ""
        );
        if (res) {
          router.push(`/support/${project.slug}`);
        } else {
          openInfoModal(
            "Missing Required NFT",
            "You're logged in with an address that does not have the early-access NFT for this q/acc project. Early access is invite-only, and you need to be invited directly by the project team."
          );
        }
      } else {
        router.push(`/support/${project.slug}`);
      }
    }
    checkUser();
  };
  return (
    <>
      <button
        className={
          "cursor-pointer px-6 py-4 rounded-full text-sm font-bold items-center flex gap-2 bg-peach-400  text-black w-full justify-center"
        }
        onClick={handleSupport}
        disabled={
          remainingTime === "Time is up!" ||
          remainingTime === "--:--:--" ||
          disabled
        }
      >
        Buy Token
      </button>
    </>
  );
};
