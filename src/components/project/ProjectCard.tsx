"use client";

import Link from "next/link";
import type React from "react";
import { IProject } from "@/types/project.type";
import { getMarketCap } from "@/services/tokenPrice.service";
import { useEffect } from "react";
import { useState } from "react";
import { fetchProjectDonationsById } from "@/services/donation.service";
import {
  useFetchActiveRoundDetails,
  useFetchAllRoundDetails,
} from "@/hooks/useRounds";
import {
  calculateTotalDonations,
  formatAmount,
  formatNumber,
} from "@/helpers/donations";
import { useFetchPOLPriceSquid } from "@/hooks/useTokens";
import { Spinner } from "../loaders/Spinner";
import { calculateCapAmount } from "@/helpers/round";
import { getIpfsAddress } from "@/helpers/image";
import { getUpcomingRound } from "@/helpers/date";
import { getPoolAddressByPair } from "@/helpers/getTokensListedData";
import config from "@/config/configuration";
import Image from "next/image";
import { SupportButton } from "./SupportButton";

interface ProjectCardProps {
  project: IProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [maxPOLCap, setMaxPOLCap] = useState(0);
  const [totalPOLDonated, setTotalPOLDonated] = useState<number>(0);
  const [isTokenListed, setIsTokenListed] = useState(false);
  const [marketCap, setMarketCap] = useState<number>();
  const [marketCapLoading, setMarketCapLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [amountDonatedInRound, setAmountDonatedInRound] = useState(0);
  const [currentTokenPrice, setCurrentTokenPrice] = useState(0);
  const [roundStatus, setRoundStatus] = useState("ended");

  const { data: POLPrice } = useFetchPOLPriceSquid();
  const { data: activeRoundDetails } = useFetchActiveRoundDetails();
  const { data: allRounds } = useFetchAllRoundDetails();

  const polPriceNumber = Number(POLPrice);

  // Fetch pool address and token price
  useEffect(() => {
    if (!project?.abc?.issuanceTokenAddress) return;

    const fetchPoolAddress = async () => {
      try {
        if (!project.abc?.issuanceTokenAddress) return;

        const { price, isListed } = await getPoolAddressByPair(
          project.abc.issuanceTokenAddress,
          config.WPOL_TOKEN_ADDRESS
        );
        console.log(price, isListed);

        setIsTokenListed(isListed);

        if (
          project.abc.issuanceTokenAddress ===
          "0x0b7a46e1af45e1eaadeed34b55b6fc00a85c7c68"
        ) {
          // Check for prismo token address only
          setCurrentTokenPrice(Number(price));
        } else {
          setCurrentTokenPrice(1 / Number(price));
        }
      } catch (error) {
        console.error("Error fetching pool address:", error);
      }
    };

    fetchPoolAddress();
  }, [project?.abc?.issuanceTokenAddress]);

  // Fetch project donations and calculate market cap
  useEffect(() => {
    if (!project?.id) return;

    setMarketCapLoading(true);
    const fetchProjectDonations = async () => {
      try {
        const data = await fetchProjectDonationsById(
          parseInt(project.id),
          1000,
          0
        );

        let donations: any[] = [];
        if (data && project?.abc?.fundingManagerAddress) {
          donations = data.donations || [];
          setTotalPOLDonated(calculateTotalDonations(donations));
        }

        if (
          project.abc?.issuanceTokenAddress &&
          project.abc?.fundingManagerAddress
        ) {
          const marketCapData = await getMarketCap(
            isTokenListed,
            project.abc.issuanceTokenAddress,
            project.abc.fundingManagerAddress,
            donations
          );

          if (
            typeof marketCapData === "number" &&
            !isNaN(marketCapData) &&
            marketCapData !== undefined &&
            marketCapData > 0
          ) {
            if (isTokenListed) {
              setMarketCap(marketCapData);
            } else {
              if (!isNaN(polPriceNumber) && polPriceNumber > 0) {
                setMarketCap(marketCapData * polPriceNumber);
              }
            }
            setMarketCapLoading(false);
          } else {
            console.warn("Invalid market cap data received:", marketCapData);
            setMarketCapLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching project donations:", error);
        setMarketCapLoading(false);
      }
    };

    fetchProjectDonations();
  }, [polPriceNumber]);

  // Calculate POL cap and donation amounts
  useEffect(() => {
    if (!activeRoundDetails || !project?.id) return;

    const updatePOLCap = async () => {
      try {
        const { capAmount, totalDonationAmountInRound } =
          await calculateCapAmount(
            activeRoundDetails,
            Number(project.id),
            true
          );

        setMaxPOLCap(capAmount);
        setAmountDonatedInRound(totalDonationAmountInRound);
      } catch (error) {
        console.error("Error calculating POL cap:", error);
      }
    };

    updatePOLCap();
  }, [activeRoundDetails, project?.id]);

  // Calculate round status
  useEffect(() => {
    if (!allRounds) return;

    const calcRoundStatus = async () => {
      try {
        const upcomingRound = await getUpcomingRound(allRounds);
        setRoundStatus(upcomingRound?.startDate ? "starts" : "ended");
      } catch (error) {
        console.error("Error calculating round status:", error);
      }
    };

    calcRoundStatus();
  }, [allRounds]);

  const capitalizeFirstLetter = (str: string) => {
    return str
      .toLowerCase()
      .replace(/(?:^|\.\s*)([a-z])/g, (match) => match.toUpperCase());
  };

  return (
    <div className="relative cursor-pointer p-4 w-full h-[650px] rounded-xl bg-neutral-800 overflow-hidden shadow-gray-200">
      <div className="relative h-[250px]">
        <Image
          alt={`${project.title} Cover`}
          loading="lazy"
          decoding="async"
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-xl h-full w-full object-cover object-center"
          src={project.image || ""}
        />

        {!activeRoundDetails
          ? (project.seasonNumber !== 1 ||
              (project.batchNumbersWithSafeTransactions?.length != 0 &&
                !isTokenListed)) && (
              <div className="absolute bg-[#262626]    right-[-2px] top-0   py-[2px]  pr-0 pl-2 rounded-tr-xl rounded-bl-2xl ">
                <svg
                  className="absolute left-[-18px] top-[-1px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M18 0V18C18 18 17.8462 7.84622 14 4C10.1538 0.153782 0 0 0 0H18Z"
                    fill="#262626"
                  />
                </svg>
                <span className=" text-white font-semibold">
                  {(project.batchNumbersWithSafeTransactions?.length !== 0 ||
                    roundStatus === "ended") &&
                  !isTokenListed
                    ? " DEX listing soon"
                    : "New!"}
                </span>

                <svg
                  className=" absolute bottom-[-18px] right-[1px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M18 0V18C18 18 17.8462 7.84622 14 4C10.1538 0.153782 0 0 0 0H18Z"
                    fill="#262626"
                  />
                </svg>
              </div>
            )
          : project.seasonNumber !== 1 && (
              <div className="absolute bg-[#262626] right-[-2px] top-0   py-[2px]  pr-0 pl-2 rounded-tr-xl rounded-bl-2xl ">
                <svg
                  className="absolute left-[-18px] top-[-1px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="#262626"
                >
                  <path
                    d="M18 0V18C18 18 17.8462 7.84622 14 4C10.1538 0.153782 0 0 0 0H18Z"
                    fill="#262626"
                  />
                </svg>
                <span className="text-white font-semibold">New!</span>

                <svg
                  className=" absolute bottom-[-18px] right-[1px]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="#262626"
                >
                  <path
                    d="M18 0V18C18 18 17.8462 7.84622 14 4C10.1538 0.153782 0 0 0 0H18Z"
                    fill="#262626"
                  />
                </svg>
              </div>
            )}
      </div>
      <div className="bg-neutral-800 absolute h-fit bottom-[-120px] hover:bottom-0 no-hover transition-bottom duration-500 ease-in-out left-4 right-4 py-4">
        <div className="absolute bg-neutral-800 left-0 -top-11 w-16 h-16 p-3 rounded-tr-xl rounded-bl-xl">
          <svg
            className="absolute top-[-18px] left-0"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="#262626"
          >
            <path
              d="M0 18V0C0 0 0.153782 10.1538 4 14C7.84622 17.8462 18 18 18 18H0Z"
              fill="#262626"
            ></path>
          </svg>
          <Image
            alt={`${project.title} Icon`}
            loading="lazy"
            width="50"
            height="50"
            decoding="async"
            data-nimg="1"
            src={project.icon || ""}
            style={{ color: "transparent" }}
          />
          <svg
            className="absolute bottom-5 right-[-18px]"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="#262626"
          >
            <path
              d="M0 18V0C0 0 0.153782 10.1538 4 14C7.84622 17.8462 18 18 18 18H0Z"
              fill="#262626"
            ></path>
          </svg>
        </div>
        <svg
          className="absolute -top-[18px] right-0"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="#262626"
        >
          <path
            d="M18 18V0C18 0 17.8462 10.1538 14 14C10.1538 17.8462 0 18 0 18H18Z"
            fill="#262626"
          ></path>
        </svg>
        <div className="relative flex flex-col gap-4 ">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-white">{project.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.categories?.map((categoryObj, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-neutral-700 text-neutral-300 rounded-full"
                >
                  {categoryObj.name}
                </span>
              ))}
            </div>
          </div>
          <div className="min-h-[100px] text-ellipsis">
            <p className="text-gray-300 text-base overflow-hidden line-clamp-4 leading-6 px-2">
              {project.descriptionSummary &&
                capitalizeFirstLetter(project.descriptionSummary)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {/* Amount in this Round or Total Receieved */}
            <div className="p-2 flex justify-between items-center bg-neutral-700 rounded-lg">
              <div className="text-white font-medium text-sm">
                {activeRoundDetails ? "Received this round" : "Total received"}
              </div>

              {activeRoundDetails ? (
                // Amount in this Round
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg">
                    {" "}
                    ~ ${" "}
                    {polPriceNumber
                      ? `${
                          " " +
                          formatNumber(polPriceNumber * amountDonatedInRound)
                        }`
                      : ""}
                  </span>
                  <span className="text-gray-400 font-medium text-right">
                    {formatNumber(amountDonatedInRound)} POL
                  </span>
                </div>
              ) : (
                // Total Receieved
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg">
                    {" "}
                    ~ ${" "}
                    {polPriceNumber
                      ? `${
                          " " + formatNumber(polPriceNumber * totalPOLDonated)
                        }`
                      : ""}
                  </span>
                  <span className="text-gray-400 font-medium text-right">
                    {formatNumber(totalPOLDonated)} POL
                  </span>
                </div>
              )}
            </div>

            {/* QuickSwap Price */}
            <div className="p-2 flex justify-between items-center  rounded-lg">
              <div className="flex gap-2 items-center justify-center">
                <div className="w-6 h-6 relative rounded-full overflow-hidden">
                  <Image
                    src={getIpfsAddress(project.abc?.icon!)}
                    alt=""
                    width={48}
                    height={48}
                  />
                </div>
                <span className="text-sm text-gray-300 font-bold">
                  {" "}
                  {project?.abc?.tokenTicker} price on Quickswap
                </span>
              </div>
              <div className="flex flex-col">
                {isTokenListed ? (
                  <>
                    <span className="text-white font-bold text-lg">
                      {" "}
                      ~ ${" "}
                      {polPriceNumber
                        ? `${
                            " " +
                            formatNumber(polPriceNumber * currentTokenPrice)
                          }`
                        : ""}
                    </span>
                    <span className="text-gray-400 font-medium">
                      {" "}
                      {currentTokenPrice.toFixed(2)} POL
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[#b2b5bc] font-semibold text-sm text-right">
                      Listing Soon
                    </span>
                  </>
                )}
              </div>
            </div>

            <hr />
            <div className="p-2 flex justify-between items-center rounded-lg">
              <span className="text-sm text-gray-300 font-bold">
                ${project.abc?.tokenTicker} Market Cap
              </span>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg text-right">
                  {marketCapLoading ? (
                    <Spinner />
                  ) : marketCap !== undefined ? (
                    <span>$ {formatAmount(marketCap)}</span>
                  ) : (
                    <span className="text-[#b2b5bc] font-semibold text-sm">
                      Data unavailable
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <Link
              href={`/project/${project.slug}`}
              className="px-6 py-4 text-white rounded-full text-sm font-bold flex gap-2 w-full justify-center items-center opacity-80 hover:opacity-100 hover:text-peach-400"
            >
              Review Project
            </Link>
            {activeRoundDetails ? (
              <SupportButton
                project={project}
                disabled={maxPOLCap === amountDonatedInRound}
              />
            ) : (
              isTokenListed && (
                <button
                  className="px-6 py-4 rounded-full text-sm font-bold items-center flex gap-2 bg-peach-400  text-black w-full justify-center "
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `https://dapp.quickswap.exchange/swap/best/ETH/${project?.abc?.issuanceTokenAddress}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                  }}
                >
                  Buy {project.abc?.tokenTicker} on Quickswap
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
