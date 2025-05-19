"use client";

import { IconMoneybag } from "@tabler/icons-react";
import { Clock, Coins, ChartColumn } from "lucide-react";
import { IProject } from "@/types/project.type";
import { calculateTotalDonations, formatAmount } from "@/helpers/donations";
import { calculateMarketCapChange, getMarketCap } from "@/services/tokenPrice.service";
import { useState } from "react";
import { useEffect } from "react";
import { fetchProjectDonationsById } from "@/services/donation.service";
import { useFetchActiveRoundDetails } from "@/hooks/useRounds";
import { useFetchPOLPriceSquid } from "@/hooks/useTokens";
interface GeneralInfoProps {
  projectData: IProject;
}

export default function GeneralInfo({ projectData }: GeneralInfoProps) {

  // const [maxPOLCap, setMaxPOLCap] = useState(0);
  // const [totalPOLDonated, setTotalPOLDonated] = useState<number>(0);
  const { data: POLPrice } = useFetchPOLPriceSquid();
  const { data: activeRoundDetails } = useFetchActiveRoundDetails();
  const [isTokenListed, setIsTokenListed] = useState(false);
  const [marketCap, setMarketCap] = useState(0);
  const [marketCapLoading, setMarketCapLoading] = useState(false);
  const [marketCapChangePercentage, setMarketCapChangePercentage] = useState(0);

  const polPriceNumber = Number(POLPrice);

  useEffect(() => {
    if (projectData?.id) {
      const fetchProjectDonations = async () => {
        const data = await fetchProjectDonationsById(
          parseInt(projectData?.id),
          1000,
          0,
        );

        if (activeRoundDetails && data && projectData?.abc?.fundingManagerAddress) {
          const { donations, totalCount } = data;
          setMarketCapLoading(true);
          const { marketCap: newCap, change24h } =
            await calculateMarketCapChange(
              donations,
              projectData?.abc?.fundingManagerAddress,
              activeRoundDetails?.startDate,
            );

          setMarketCap(newCap * polPriceNumber);
          setMarketCapChangePercentage(change24h);
          setMarketCapLoading(false);

          // setTotalPOLDonated(calculateTotalDonations(donations));
        } else if (
          projectData.abc?.issuanceTokenAddress &&
          projectData.abc?.fundingManagerAddress
        ) {
          if (isTokenListed) {
            const marketCapData = await getMarketCap(
              isTokenListed,
              projectData?.abc.issuanceTokenAddress,
              projectData.abc.fundingManagerAddress,
            );
            setMarketCap(marketCapData);
          } else {
            const { donations, totalCount } = data;
            const { marketCap: newCap, change24h } =
              await calculateMarketCapChange(
                donations,
                projectData?.abc?.fundingManagerAddress,
              );
            setMarketCap(newCap * polPriceNumber);
            setMarketCapChangePercentage(change24h);
          }

          setMarketCapChangePercentage(0);
        }
      };
      fetchProjectDonations();
    }
  }, [projectData, marketCap, activeRoundDetails, isTokenListed]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-neutral-800 rounded-2xl p-6 backdrop-blur-lg bg-opacity-80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 mb-2">Total received</div>
              <div className="text-3xl font-bold">
                ${formatAmount(projectData.totalDonations)}
              </div>
            </div>
            <div>
              {/* <div className="text-gray-400 mb-2">Time Remaining</div>
              <div className="flex items-center gap-2">
                <Clock className="text-peach-400" size={24} />
                <span className="text-2xl font-bold">TBA</span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-2xl p-6 backdrop-blur-lg bg-opacity-80">
          <h2 className="text-xl font-bold mb-6">General Info</h2>
          <div className="space-y-4">
            {/* <div className="flex items-center gap-3">
              <Clock size={20} className="text-gray-400" />
              <span>Public sale will start in</span>
              <span className="font-bold">TBA</span>
            </div> */}
            {projectData.abc?.totalSupply && (
              <div className="flex items-center gap-3">
                <IconMoneybag className="text-gray-400" size={20} />
                <span>
                  Total tokens supply ={" "}
                  <span className="font-bold">
                    {formatAmount(projectData.abc?.totalSupply)}
                  </span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Coins className="text-gray-400" size={20} />
              <span>Token Price</span>
              <span className="font-bold">
                1 ${projectData.abc?.tokenTicker} 
              </span>
              <span>=</span>
              <span className="font-bold">
              ${formatAmount(projectData.abc?.tokenPrice)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ChartColumn size={20} className="text-gray-400" />
              <span><span className="font-bold text-white">${projectData.abc?.tokenTicker}</span> Market cap</span> =
              <span className="font-bold">
                ${formatAmount(marketCap)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 row-2">
        <div className="bg-neutral-800 rounded-2xl p-6 backdrop-blur-lg bg-opacity-80">
          <p className="text-gray-300 font-medium">
            Backed by{" "}
            <span className="text-white font-bold">
              {projectData.countUniqueDonors}
            </span>{" "}
            supporters
          </p>
          <div className="space-y-6">
            <div className="mt-6">
              {/* <div className="text-gray-400 mb-2">Wallet balance</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={20} />
                  <span className="text-neutral-300 font-semibold">
                    $500{" "}
                  </span>{" "}
                  / <span className="text-neutral-300 font-semibold">200 </span>{" "}
                  $POL
                </div>
              </div> */}
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-2">Token price</p>
              <div className="flex items-center gap-2">
                <p className="text-neutral-300 text-lg font-semibold">
                  ${projectData.abc?.tokenPrice}
                </p>{" "}
                <span className="text-sm text-green-400 font-medium">
                  + {marketCapChangePercentage}% (24h)
                </span>
              </div>
            </div>
            <button className="w-full bg-peach-400 text-black font-medium py-3 rounded-full hover:bg-peach-300 transition-colors flex items-center justify-center gap-2">
              <Coins size={20} />
              Buy ${projectData.abc?.tokenTicker}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
