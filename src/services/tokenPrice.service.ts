import { useMemo } from 'react';
import { ethers, BigNumberish, Contract, formatUnits } from 'ethers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import config from '@/config/configuration';
import { IProject } from '@/types/project.type';
import { IEarlyAccessRound, IQfRound } from '@/types/round.type';
import { createPublicClient, http, formatUnits as viemFormatUnits } from 'viem';
import { polygon } from 'viem/chains';

const provider = new ethers.JsonRpcProvider(config.NETWORK_RPC_ADDRESS);

// Create viem public client for multicall
const viemClient = createPublicClient({
  chain: polygon,
  transport: http(config.NETWORK_RPC_ADDRESS),
});

const abi = [
  {
    inputs: [],
    name: 'getReserveRatioForBuying',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_depositAmount', type: 'uint256' },
    ],
    name: 'calculatePurchaseReturn',
    outputs: [{ internalType: 'uint256', name: 'mintAmount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStaticPriceForBuying',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVirtualCollateralSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVirtualIssuanceSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

interface UseTokenPriceRangeProps {
  contributionLimit: number;
  contractAddress?: string;
}

interface TokenPriceRangeResult {
  min: number;
  max: number;
}

export const useTokenPriceRange = ({
  contributionLimit, // Contribution limit up to the current batch
  contractAddress, // fundingManagerAddress
}: UseTokenPriceRangeProps): TokenPriceRangeResult => {
  const contract = useMemo(() => {
    if (!contractAddress) return null;
    return new Contract(contractAddress, abi, provider);
  }, [contractAddress]);
  const staticPriceForBuying = useQuery<BigNumberish, Error>({
    queryKey: ['getStaticPriceForBuying', contractAddress],
    queryFn: async () => {
      if (!contract) throw new Error('Contract not loaded');
      const result: BigNumberish = await contract.getStaticPriceForBuying();
      return result;
    },
    enabled: !!contract,
    select: data => Number(data), // Convert BigNumber to number
  });

  const minPrice =
    parseFloat((staticPriceForBuying.data || '0').toString()) / 1_000_000; // convert PPM to price in POL

  // // Fetch `getVirtualCollateralSupply` (total contributed so far)
  // const virtualCollateralSupply = useQuery<BigNumberish, Error>({
  //   queryKey: ['getVirtualCollateralSupply', contractAddress],
  //   queryFn: async () => {
  //     if (!contract) throw new Error('Contract not loaded');
  //     const result: BigNumberish = await contract.getVirtualCollateralSupply();
  //     return result;
  //   },
  //   enabled: !!contract,
  //   select: data => Number(formatUnits(data, 18)),
  // });
  //
  // const contributedSoFar = parseFloat(
  //   (virtualCollateralSupply.data || '0').toString(),
  // ); // todo: we need to deduct the initial supply from that
  // // Calculate the upper limit (X)
  // const X = contributionLimit - contributedSoFar;
  //
  // // Fetch `calculatePurchaseReturn` using X
  // const calculatePurchaseReturn = useQuery<BigNumberish, Error>({
  //   queryKey: ['calculatePurchaseReturn', X.toString(), contractAddress],
  //   queryFn: async () => {
  //     if (!contract) throw new Error('Contract not loaded');
  //     const result: BigNumberish = await contract.calculatePurchaseReturn(
  //       parseUnits(X.toString(), 18),
  //     );
  //     return result;
  //   },
  //   enabled: !!contract && !!X,
  //   select: data => Number(formatUnits(data, 18)),
  // });
  //
  // let maxPrice = minPrice;
  // if (calculatePurchaseReturn.data) {
  //   const Y = parseFloat((calculatePurchaseReturn.data || 1).toString()); // Prevent division by zero
  //   // Calculate the max token price (P = X / Y)
  //   // console.log('X:', X, 'Y:', Y);
  //   maxPrice = X / Y;
  //   // console.log('max price:', maxPrice);
  // }

  const maxPrice = minPrice + 0.806; // hardcode max price with a delta of 0.786

  return { min: minPrice, max: maxPrice };
};

interface UseTokenPriceRangeStatusProps {
  allRounds?: (IQfRound | IEarlyAccessRound)[];
  project?: IProject;
}

interface TokenPriceRangeStatusResult {
  isPriceUpToDate: boolean;
}

const GECKO_TERMINAL_BASE_URL =
  'https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens';

const getBondingCurveSwapsQuery = `
    query getBondingCurveSwapsQuery($orchestratorAddress: String!) {
      BondingCurve(where: {workflow_id: {_ilike: $orchestratorAddress}}){
        id  
        swaps {
          swapType
          initiator
          recipient
        }
      }
    }
`;

async function getTokenPriceRangeStatus({
  allRounds,
  project,
}: UseTokenPriceRangeStatusProps): Promise<TokenPriceRangeStatusResult> {
  if (allRounds && project) {
    const tenMinutesLater =
      new Date().getTime() +
      Number(process.env.NEXT_PUBLIC_ADJUSTED_MINUTES || '10') * 60 * 1000;
    const latestEndedRound = allRounds
      .filter(round => new Date(round.endDate).getTime() < tenMinutesLater) // Select rounds with endDate in past or less than 10 minutes later
      .sort(
        (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
      )[0]; // Sort descending and take the first one
    if (latestEndedRound) {
      // if batch minting was not executed yet for the past round, it means the token price range is not valid
      if (!latestEndedRound.isBatchMintingExecuted) {
        return {
          isPriceUpToDate: false,
        };
      }
      // otherwise, we need to check number of executed transactions to be same with expected value
      const expectedTransactionsNumber =
        project.batchNumbersWithSafeTransactions?.length;
      if (expectedTransactionsNumber) {
        try {
          const result = await axios.post(config.INDEXER_GRAPHQL_URL, {
            query: getBondingCurveSwapsQuery,
            variables: {
              orchestratorAddress: `${config.SUPPORTED_CHAINS[0]?.id}-${project.abc?.orchestratorAddress}`,
            },
          });
          const swaps = result.data.data.BondingCurve[0]?.swaps;
          const numberOfExecutedTransactions: number = swaps.filter(
            (swap: {
              swapType: string;
              initiator: string;
              recipient: string;
            }) =>
              swap.swapType === 'BUY' &&
              swap.initiator.toLowerCase() === swap.recipient.toLowerCase() &&
              (project.abc?.projectAddress
                ? swap.recipient.toLowerCase() ===
                  project.abc?.projectAddress.toLowerCase()
                : true),
          ).length;
          if (numberOfExecutedTransactions < expectedTransactionsNumber) {
            return {
              isPriceUpToDate: false,
            };
          }
        } catch (error) {
          console.error('Error fetching data from the endpoint:', error);
          return {
            isPriceUpToDate: true,
          };
        }
      }
    }
  }
  return {
    isPriceUpToDate: true,
  };
}

export const useTokenPriceRangeStatus = ({
  allRounds,
  project,
}: UseTokenPriceRangeStatusProps): {
  data?: TokenPriceRangeStatusResult;
  isSuccess: boolean;
} => {
  return useQuery<TokenPriceRangeStatusResult, Error>({
    queryKey: ['tokenPriceRangeStatus', allRounds, project],
    queryFn: () =>
      getTokenPriceRangeStatus({
        allRounds,
        project,
      }),
    enabled: !!allRounds && !!project, // Run only if allRounds and project is provided
  });
};

export async function getTokenSupplyDetails(address: string) {
  try {
    // Use viem multicall to batch all 3 contract calls
    const results = await viemClient.multicall({
      contracts: [
        {
          address: address as `0x${string}`,
          abi,
          functionName: 'getReserveRatioForBuying',
        },
        {
          address: address as `0x${string}`,
          abi,
          functionName: 'getVirtualCollateralSupply',
        },
        {
          address: address as `0x${string}`,
          abi,
          functionName: 'getVirtualIssuanceSupply',
        },
      ],
    });

    // Extract results and handle any failures
    const [reserveRatioResult, virtualCollateralResult, virtualIssuanceResult] = results;

    if (reserveRatioResult.status === 'failure') {
      throw new Error(`Failed to get reserve ratio: ${reserveRatioResult.error}`);
    }
    if (virtualCollateralResult.status === 'failure') {
      throw new Error(`Failed to get virtual collateral supply: ${virtualCollateralResult.error}`);
    }
    if (virtualIssuanceResult.status === 'failure') {
      throw new Error(`Failed to get virtual issuance supply: ${virtualIssuanceResult.error}`);
    }
    const collateral_supply = viemFormatUnits(virtualCollateralResult.result as bigint, 18);
    const issuance_supply = viemFormatUnits(virtualIssuanceResult.result as bigint, 18);
    const reserve_ration = viemFormatUnits(reserveRatioResult.result as bigint, 6);

    return {
      reserve_ration,
      collateral_supply,
      issuance_supply,
    };
  } catch (error) {
    console.error('Error in getTokenSupplyDetails multicall:', error);
    throw error;
  }
}

// export async function calculateMarketCapFromDonations(
//   donations: any[],
//   contract_address: string,
//   startDate?: string
// ): Promise<number> {
//   if (!contract_address) {
//     throw new Error('Contract address is required');
//   }

//   try {
//     const { reserve_ration, collateral_supply, issuance_supply } =
//       await getTokenSupplyDetails(contract_address);

//     const reserveRatio = Number(reserve_ration);
//     let reserve = Number(collateral_supply);
//     let supply = Number(issuance_supply);

//     // Validate initial values
//     if (reserveRatio <= 0 || reserve <= 0 || supply <= 0) {
//       throw new Error('Invalid bonding curve parameters');
//     }

//     // Filter donations if start date is provided
//     const filteredDonations = startDate 
//       ? donations.filter(d => new Date(d.createdAt) > new Date(startDate))
//       : donations;

//     // Process each donation through bonding curve
//     filteredDonations.forEach(({ amount }) => {
//       if (amount > 0) {
//         // Update supply using bonding curve formula
//         supply = supply * Math.pow(1 + amount / reserve, reserveRatio);
//         // Update reserve
//         reserve += amount;
//         const price = (reserve / (supply * reserveRatio)) * 1.1;
//         const marketCap = supply * price;
    
//       }
//     });

//     // Calculate final price and market cap

//     return Math.round(marketCap);
//   } catch (error) {
//     console.error('Error calculating market cap from donations:', error);
//     throw error;
//   }
// }

export async function calculateMarketCapChange(
  donations: any[],
  contract_address: string,
  startDate = '2025-04-15T00:00:00Z', //start date  to see the change in makret cap
) {
  const { reserve_ration, collateral_supply, issuance_supply } =
    await getTokenSupplyDetails(contract_address);

  const reserveRatio = Number(reserve_ration);
  let reserve = Number(collateral_supply);
  let supply = Number(issuance_supply);

  // Sort by date
  let history: { createdAt: string; marketCap: number; id: number }[] = [];
  const initialPrice = (reserve / (supply * reserveRatio)) * 1.1;

  const initialMarketCap = supply * initialPrice;
  const initialTimestamp = startDate; // virtual Day 0 timestamp (can be set based on your round start)

  history.push({
    createdAt: initialTimestamp,
    marketCap: initialMarketCap,
    id: 0,
  });

  const now = new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  // const recentDonationExists = donations.some(
  //   d => new Date(d.createdAt) > cutoff,
  // );

  const filteredDonations = donations.filter(
    d => new Date(d.createdAt) > new Date(initialTimestamp),
  );

  filteredDonations.forEach(({ amount, createdAt, id }) => {
    supply = supply * Math.pow(1 + amount / reserve, reserveRatio);
    reserve += amount;
    const price = (reserve / (supply * reserveRatio)) * 1.1;
    const marketCap = supply * price;
    history.push({ createdAt, marketCap, id: id });
  });

  // Find market cap from ≥24h ago

  const past = [...history]
    .reverse()
    .find(h => new Date(h.createdAt) <= cutoff);

  // const marketCapPast = past ? past.marketCap : initialMarketCap;
  const marketCapPast = initialMarketCap;

  const latestMarketCap = history[history.length - 1].marketCap; 
  

  // const change24h = recentDonationExists
  // ? ((latestMarketCap - marketCapPast) / marketCapPast) * 100
  // : 0;
  const change24h = ((latestMarketCap - marketCapPast) / marketCapPast) * 100;

  return {
    marketCap: Math.round(latestMarketCap),
    change24h: change24h,
  };
}

export async function fetchGeckoMarketCap(tokenAddress: string) {
  try {
    const response = await axios.get(
      `${GECKO_TERMINAL_BASE_URL}/${tokenAddress.toLowerCase()}/`,
    );

    const priceUSD = parseFloat(response.data.data.attributes.price_usd);
    if (isNaN(priceUSD) || priceUSD === 0) {
      return null;
    }

    // Calculate token price in POL by dividing USD price by POL price
    const polResponse = await axios.get(
      `${GECKO_TERMINAL_BASE_URL}/${tokenAddress}/`,
    );
    const polPriceUSD = parseFloat(polResponse.data.data.attributes.price_usd);

    if (isNaN(polPriceUSD) || polPriceUSD === 0) {
      return null;
    }

    const marketCap = response.data.data.attributes.fdv_usd
      ? parseFloat(response.data.data.attributes.fdv_usd)
      : null;

    return {
      price: priceUSD / polPriceUSD, // Price in terms of POL tokens
      priceUSD,
      marketCap,
    };
  } catch (error: any) {
    console.error('Error fetching token price from GeckoTerminal', {
      tokenAddress,
      error: error.message,
    });
    return null;
  }
}

export async function getMarketCap(
  isTokenListed: boolean,
  tokenAddress: string,
  contract_address: string,
  donations?: any[]
): Promise<number> {
  if (isTokenListed) {
    const result = await fetchGeckoMarketCap(tokenAddress);
    return result?.marketCap ?? 0;
  } else {
    if (donations && donations.length > 0) {
      const {marketCap, change24h} = await calculateMarketCapChange(donations, contract_address);
      return marketCap;
    }
    
    const { reserve_ration, collateral_supply, issuance_supply } =
      await getTokenSupplyDetails(contract_address);

    const reserveRatio = Number(reserve_ration);
    let reserve = Number(collateral_supply);
    let supply = Number(issuance_supply);

    const initialPrice = (reserve / (supply * reserveRatio)) * 1.1;
    const marketCap = supply * initialPrice;
    return marketCap;
  }
}

