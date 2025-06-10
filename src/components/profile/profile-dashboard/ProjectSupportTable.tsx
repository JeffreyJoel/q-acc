import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import round from 'lodash/round';
import Pagination from '@/components/shared/Pagination';
import { IconViewTransaction } from '@/components/icons/IconViewTransaction';
import { IconSort } from '@/components/icons/IconSort';
import { fetchProjectDonationsById } from '@/services/donation.service';
import { useFetchProjectById } from '@/hooks/useProjects';
import {
  formatDateMonthDayYear,
  getDifferenceFromPeriod,
  OneYearInMilliSecs,
} from '@/helpers/date';
import { useTokenPrice } from '@/hooks/useTokens';
import config from '@/config/configuration';
import { checkMatchingFundAddress, formatAmount } from '@/helpers/donations';
import { CHAIN_IMAGES, fetchUSDPrices } from '@/helpers/squidTransactions';
import { POLYGON_POS_CHAIN_IMAGE } from '@/components/project/project-details/ProjectDonationTable';
import { Spinner } from '@/components/loaders/Spinner';

const itemPerPage = 5;

export enum EOrderBy {
  CreationDate = 'CreationDate',
  Round = 'Round',
  Amount = 'Amount',
  Reward = 'RewardToken',
}

export enum EDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}
export interface IOrder {
  by: EOrderBy;
  direction: EDirection;
}

const ProjectSupportTable = ({
  projectId,
  term,
}: {
  projectId: string;
  term?: string;
}) => {
  const [page, setPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { data: projectData } = useFetchProjectById(parseInt(projectId));
  const { data: POLPrice } = useTokenPrice();
  const [usdPrices, setUsdPrices] = useState<any>({});
  const [usdPricesLoading, setUsdPricesLoading] = useState(false);
  const [order, setOrder] = useState<IOrder>({
    by: EOrderBy.CreationDate,
    direction: EDirection.DESC,
  });

  const [pageDonations, setPageDonations] = useState<any>();

  useEffect(() => {
    const fetchProjectDonations = async () => {
      if (projectId) {
        const data = await fetchProjectDonationsById(
          parseInt(projectId),
          itemPerPage,
          page * itemPerPage,
          { field: order.by, direction: order.direction },
          term && term.trim() !== '' ? term : '',
        );

        if (data) {
          const { donations, totalCount } = data;
          console.log(donations);
          setTotalCount(totalCount);
          setPageDonations(donations);
        }
      }
    };

    fetchProjectDonations();
  }, [page, projectData, itemPerPage, totalCount, order, term]);

  useEffect(() => {
    const uniqueTokens = Array.from(
      new Set(
        pageDonations
          ?.map((donation: any) => {
            const chainId = donation.swapTransaction?.fromChainId;
            const tokenAddress = donation.swapTransaction?.fromTokenAddress;
            // Ensure both values exist before adding to the set
            return chainId && tokenAddress
              ? `${chainId}-${tokenAddress}`
              : null;
          })
          .filter(Boolean), // Remove null/undefined values
      ),
    ).map((key: any) => {
      const [chainId, tokenAddress] = key.split('-');
      return { chainId: Number(chainId), tokenAddress };
    });

    const getPrices = async () => {
      setUsdPricesLoading(true);
      const prices = await fetchUSDPrices(uniqueTokens);
      setUsdPrices(prices);
      setUsdPricesLoading(false);
    };
    getPrices();
  }, [pageDonations]);

  const orderChangeHandler = (orderBy: EOrderBy) => {
    if (orderBy === order.by) {
      setOrder({
        by: orderBy,
        direction:
          order.direction === EDirection.ASC ? EDirection.DESC : EDirection.ASC,
      });
    } else {
      setOrder({
        by: orderBy,
        direction: EDirection.DESC,
      });
    }
  };

  // Set POL token price

  if (totalCount === 0) {
    return (
      <div className='bg-neutral-800 w-full h-[500px] flex items-center justify-center font-bold text-[25px] text-neutral-300'>
        This project didn't receive any contributions yet.
      </div>
    );
  }

  return (
    <div className='container mx-auto flex  flex-col py-1 md:px-6 gap-10'>
      <div className='flex gap-10 lg:flex-row flex-col '>
        <div className='flex flex-col w-full  font-redHatText overflow-x-auto'>
          <div className='flex justify-between'>
            <div className='p-[8px_4px] flex gap-2 text-start w-full border-b-2 border-neutral-600  font-medium text-neutral-200 items-center min-w-[150px]'>
              Supporter
              <button onClick={() => orderChangeHandler(EOrderBy.Amount)}>
                <IconSort size={16} />
              </button>
            </div>
            <div className='p-[8px_4px] flex gap-2 text-start w-full border-b-2 border-neutral-600 font-medium text-neutral-200 items-center min-w-[150px]'>
              Date
              <button onClick={() => orderChangeHandler(EOrderBy.CreationDate)}>
                <IconSort size={16} />
              </button>
            </div>
            {/* <div className='p-[8px_4px] flex gap-2 text-start w-full  border-b-2 border-neutral-600 font-medium text-neutral-200 items-center min-w-[150px]'>
              Round
              <button onClick={() => orderChangeHandler(EOrderBy.Round)}>
                <IconSort size={16} />
              </button>
            </div> */}
            <div className='p-[8px_4px] flex gap-2 text-start w-full border-b-2 border-neutral-600  font-medium text-neutral-200 items-center min-w-[150px]'>
              Amount
              <button onClick={() => orderChangeHandler(EOrderBy.Amount)}>
                <IconSort  size={16} />
              </button>
            </div>
            <div className='p-[8px_4px] flex gap-2 text-start w-full  border-b-2 border-neutral-600 font-medium text-neutral-200 items-center min-w-[150px]'>
              Token
              <button onClick={() => orderChangeHandler(EOrderBy.Reward)}>
                <IconSort size={16} />
              </button>
            </div>
            <div className='p-[8px_4px] flex gap-2 text-start w-full  border-b-2 border-neutral-600 font-medium text-neutral-200 items-center min-w-[150px]'>
              Unlock Remaining
              <button
                onClick={() => orderChangeHandler(EOrderBy.Reward)}
              ></button>
            </div>
            <div className='p-[8px_4px] flex gap-2 text-start w-full  border-b-2 border-neutral-600 font-medium text-neutral-200 items-center min-w-[150px]'>
              Stream Details
              <button
                onClick={() => orderChangeHandler(EOrderBy.Reward)}
              ></button>
            </div>
          </div>

          <div className=''>
            {pageDonations?.map((donation: any) => {
              const tokenKey =
                donation.swapTransaction?.fromChainId +
                `-` +
                donation.swapTransaction?.fromTokenAddress;
              const tokenData = usdPrices[tokenKey] || {};
              const tokenUsdPrice = tokenData.usdPrice || Number(POLPrice);
              const tokenImageUrl =
                tokenData.imageUrl || POLYGON_POS_CHAIN_IMAGE;
              return (
                <div key={donation.id} className=' flex justify-between '>
                  <div className='p-[18px_4px] flex gap-2 text-start border-b border-neutral-700 w-full min-w-[150px] text-neutral-200'>
                    {checkMatchingFundAddress(donation.fromWalletAddress)
                      ? 'Matching pool allocation'
                      : donation.user.firstName
                        ? donation.user.firstName + ' ' + donation.user.lastName
                        : 'Anoynomous'}
                  </div>
                  <div className='p-[18px_4px] flex gap-2 text-start  w-full border-b border-neutral-700 min-w-[150px]'>
                    <div className='flex   items-center gap-2 flex-wrap'>
                      <span className='text-neutral-200'>
                        {new Date(donation.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            day: 'numeric',
                            year: 'numeric',
                            month: 'short',
                          },
                        )}
                      </span>
                      {donation?.qfRound?.seasonNumber && (
                        <span className='px-2 py-[2px] border-2 border-neutral-600 bg-neutral-700/50 rounded-3xl text-xs text-neutral-200 font-medium leading-4'>
                          Season {donation.qfRound.seasonNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* <div className='p-[18px_4px] flex gap-2 text-start border-b border-neutral-700 w-full min-w-[180px]'>
                  {checkMatchingFundAddress(donation.fromWalletAddress)
                    ? 'q/acc round'
                    : donation.earlyAccessRound
                      ? `Early access - Round ${donation.earlyAccessRound.roundNumber}`
                      : donation.qfRound
                        ? 'q/acc round'
                        : `---`}
                </div> */}

                  <div className='p-[18px_4px] flex gap-2 text-start border-b border-neutral-700 w-full min-w-[150px]'>
                    <div className='flex gap-1'>
                      <div>
                        <div className='flex relative px-2'>
                          <div className='flex items-center'>
                            <div className='w-6 h-6  absolute right-6 p-[4px] bg-neutral-800 rounded-full shadow-baseShadow'>
                              <img
                                className='rounded-full  w-full'
                                src={
                                  CHAIN_IMAGES[
                                    donation.swapTransaction?.fromChainId
                                  ] || POLYGON_POS_CHAIN_IMAGE
                                }
                                alt='From Chain  Logo'
                              />
                            </div>
                            <div className='w-6 h-6 z-10 p-[4px] bg-neutral-800 rounded-full shadow-baseShadow'>
                              <img
                                className='rounded-full  w-full'
                                src={tokenImageUrl}
                                alt='To Chain Logo'
                                width={16}
                                height={16}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <div className='flex gap-1 items-center'>
                          <span className='font-medium text-neutral-100'>
                            {donation.fromTokenAmount
                              ? formatAmount(donation.fromTokenAmount)
                              : formatAmount(donation.amount)}
                          </span>
                          <span className='text-neutral-200 text-xs align-top font-medium'>
                            {donation.swapTransaction?.fromTokenSymbol || 'POL'}
                          </span>
                          <Link
                            target='_blank'
                            href={`${config.SCAN_URL}/tx/${donation.transactionId}`}
                          >
                            <IconViewTransaction size={16} color='#F5F5F5' />
                          </Link>
                        </div>

                        <span className='text-xs font-medium text-neutral-400'>
                          {usdPricesLoading ? (
                            <Spinner size={10} />
                          ) : (
                            <>
                              ${' '}
                              {donation.fromTokenAmount
                                ? formatAmount(
                                    Math.round(
                                      donation.fromTokenAmount *
                                        tokenUsdPrice *
                                        100,
                                    ) / 100,
                                  )
                                : formatAmount(
                                    Math.round(
                                      donation.amount * tokenUsdPrice * 100,
                                    ) / 100,
                                  )}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='p-[18px_4px] text-neutral-100 font-medium flex gap-2 text-start border-b border-neutral-700 w-full min-w-[150px]'>
                    {donation?.rewardTokenAmount
                      ? formatAmount(round(donation.rewardTokenAmount, 2)) +
                        ' ' +
                        projectData?.abc.tokenTicker
                      : '-'}
                  </div>
                  <div className='p-[18px_4px] text-neutral-100  flex gap-2 text-start border-b border-neutral-700 w-full min-w-[150px]'>
                    {donation.rewardStreamStart
                      ? getDifferenceFromPeriod(
                          donation.rewardStreamStart,
                          donation.cliff / OneYearInMilliSecs,
                        )
                      : '-'}
                  </div>
                  <div className='p-[18px_4px] flex gap-2 text-start border-b border-neutral-700 w-full min-w-[150px]'>
                    {donation.rewardStreamStart !== null &&
                    donation.rewardStreamEnd !== null ? (
                      <div className='flex flex-col'>
                        <span className='font-medium text-neutral-100'>
                          {formatDateMonthDayYear(donation.rewardStreamEnd)} End
                        </span>
                        <span className='text-xs font-medium text-neutral-400'>
                          Starts on{' '}
                          {formatDateMonthDayYear(donation.rewardStreamStart)}
                        </span>
                      </div>
                    ) : (
                      <span className='text-neutral-100'>-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className='flex justify-center'>
            <Pagination
              currentPage={page}
              totalCount={totalCount}
              setPage={setPage}
              itemPerPage={itemPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSupportTable;
