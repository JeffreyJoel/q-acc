"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
// import DonateNavbar from './DonatePageNavbar';
import DonatePageBody from './DonatePageBody';
import { checkUserOwnsNFT } from "@/helpers/token";

import { useDonateContext } from "@/contexts/donation.context";
import { useFetchActiveRoundDetails } from "@/hooks/useRounds";
import { InfoModal } from "../modals/InfoModal";
// import { ConnectModal } from '../ConnectModal';

const DonateIndex = () => {
  const [ownsNFT, setOwnsNFT] = useState(false);
  const { address, isConnected } = useAccount();
  const { projectData } = useDonateContext();
  const { data: activeRoundDetails } = useFetchActiveRoundDetails();
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  useEffect(() => {
    const checkNFT = async () => {
      setLoading(true);
      if (projectData?.abc?.nftContractAddress && address) {
        const res = await checkUserOwnsNFT(
          projectData.abc.nftContractAddress,
          address
        );
        setOwnsNFT(res);
      }
      setLoading(false);
    };
    checkNFT();
  }, [projectData?.abc?.nftContractAddress, address, ownsNFT]);

  //   if (!isConnected) {
  //     return (
  //       <>
  //         <ConnectModal
  //           isOpen={true}
  //           onClose={function (): void {
  //             throw new Error('Function not implemented.');
  //           }}
  //         />
  //       </>
  //     );
  //   }
  if (loading) {
    return;
  }
  if (activeRoundDetails?.__typename === "EarlyAccessRound" && !ownsNFT) {
    return (
      <InfoModal
        isOpen={true}
        onClose={() => true}
        title="Missing Required NFT"
        description="You're logged in with an address that does not have the early-access NFT for this q/acc project. Early access is invite-only, and you need to be invited directly by the project team."
      />
    );
  }

  return (
    <div className="mt-32 px-4 md:px-0 mx-auto w-full max-w-7xl">
      {/* <DonateNavbar isConfirming={isConfirming} /> */}
      <DonatePageBody setIsConfirming={setIsConfirming} />
    </div>
  );
};

export default DonateIndex;
