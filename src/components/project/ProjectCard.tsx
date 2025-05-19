import Link from "next/link";
import type React from "react";
import { IProject } from "@/types/project.type";
import { calculateMarketCapChange, getMarketCap } from "@/services/tokenPrice.service";
import { useEffect } from "react";
import { useState } from "react";
import { fetchProjectDonationsById } from "@/services/donation.service";
import { useFetchActiveRoundDetails, useFetchAllRoundDetails } from "@/hooks/useRounds";
import { calculateTotalDonations, formatAmount } from "@/helpers/donations";
import { useFetchPOLPriceSquid } from "@/hooks/useTokens";
import { Spinner } from "../loaders/Spinner";

interface ProjectCardProps {
  project: IProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  const [maxPOLCap, setMaxPOLCap] = useState(0);
  const [totalPOLDonated, setTotalPOLDonated] = useState<number>(0);
  const { data: POLPrice } = useFetchPOLPriceSquid();
  const { data: activeRoundDetails } = useFetchActiveRoundDetails();
  const [isTokenListed, setIsTokenListed] = useState(false);
  const [marketCap, setMarketCap] = useState<number>();
  const [marketCapLoading, setMarketCapLoading] = useState(false);
  const [marketCapChangePercentage, setMarketCapChangePercentage] = useState(0);

  const polPriceNumber = Number(POLPrice);

  useEffect(() => {
    if (project?.id) {
      const fetchProjectDonations = async () => {
        const data = await fetchProjectDonationsById(
          parseInt(project?.id),
          1000,
          0,
        );

        if (activeRoundDetails && data && project?.abc?.fundingManagerAddress) {
          const { donations, totalCount } = data;
          setMarketCapLoading(true);
          const { marketCap: newCap, change24h } =
            await calculateMarketCapChange(
              donations,
              project?.abc?.fundingManagerAddress,
              activeRoundDetails?.startDate,
            );

          setMarketCap(newCap * polPriceNumber);
          setMarketCapChangePercentage(change24h);
          setMarketCapLoading(false);

          setTotalPOLDonated(calculateTotalDonations(donations));
        } else if (
          project.abc?.issuanceTokenAddress &&
          project.abc?.fundingManagerAddress
        ) {
          if (isTokenListed) {
            setMarketCapLoading(true);
            const marketCapData = await getMarketCap(
              isTokenListed,
              project?.abc.issuanceTokenAddress,
              project.abc.fundingManagerAddress,
            );
            setMarketCap(marketCapData);
            setMarketCapLoading(false);
          } else {
            const { donations, totalCount } = data;
            const { marketCap: newCap, change24h } =
              await calculateMarketCapChange(
                donations,
                project?.abc?.fundingManagerAddress,
              );
            setMarketCap(newCap * polPriceNumber);
            setMarketCapChangePercentage(change24h);
          }

          setMarketCapChangePercentage(0);
        }
      };
      fetchProjectDonations();
    }
  }, [project, marketCap, activeRoundDetails, isTokenListed]);

  return (
    <div className="relative cursor-pointer p-4 w-full h-full rounded-xl bg-neutral-800 overflow-hidden shadow-gray-200">
      <div className="relative h-[550px]">
        <img
          alt={`${project.title} Cover`}
          loading="lazy"
          decoding="async"
          data-nimg="fill"
          className="rounded-xl"
          sizes="100vw"
          src={project.image}
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: "0px",
            objectFit: "cover",
            color: "transparent",
          }}
        />
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
          <img
            alt={`${project.title} Icon`}
            loading="lazy"
            width="50"
            height="50"
            decoding="async"
            data-nimg="1"
            src={project.icon}
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
        <div className="relative flex flex-col gap-4 font-redHatText">
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
            <p className="text-gray-400 overflow-hidden font-redHatText line-clamp-4 leading-6 px-2">
              {project.descriptionSummary || "No description available."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="p-2 flex justify-between items-center bg-neutral-800 rounded-lg">
              <div className="text-gray-200 font-bold text-sm">
                Received this round
              </div>
              <div className="flex flex-col">
                <span className="text-gray-200 font-bold text-lg">
                  {" "}
                  ~ $ {formatAmount(project.totalDonations || 0)}
                </span>
              </div>
            </div>
            <hr />
            <div className="p-2 flex justify-between items-center rounded-lg">
              <span className="text-sm text-gray-300 font-bold">
                ${project.abc?.tokenTicker} Market Cap
              </span>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg text-right">
                  {" "}
                 {marketCapLoading ? <Spinner /> : <span>
                  $ {formatAmount(marketCap)}
                 </span>}
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
            <button className="px-6 py-4 rounded-full text-sm font-bold items-center flex gap-2 bg-peach-400  text-black w-full justify-center ">
              Buy Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
