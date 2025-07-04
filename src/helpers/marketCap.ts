import { calculateMarketCapFromDonations, getMarketCap } from '@/services/tokenPrice.service';
import { IProject } from '@/types/project.type';

/**
 * Enhanced market cap calculation for projects
 * Automatically determines the best calculation method based on project state
 */
export const calculateProjectMarketCap = async (
  isTokenListed: boolean,
  project: IProject,
  donations?: any[]
): Promise<number> => {
  if (!project.abc?.issuanceTokenAddress || !project.abc?.fundingManagerAddress) {
    return 0;
  }

  // Use the enhanced getMarketCap function
  return await getMarketCap(
    isTokenListed,
    project.abc.issuanceTokenAddress,
    project.abc.fundingManagerAddress,
    donations
  );
};

/**
 * Calculate market cap specifically with donations (for unlisted tokens)
 * This bypasses the listed token check and forces donation-based calculation
 */
export const calculateMarketCapWithDonations = async (
  fundingManagerAddress: string,
  donations: any[]
): Promise<number> => {
  if (!fundingManagerAddress || !donations || donations.length === 0) {
    return 0;
  }

  return await calculateMarketCapFromDonations(donations, fundingManagerAddress);
};

/**
 * Batch calculate market caps for multiple projects
 * Useful for project listing pages
 */
export const batchCalculateMarketCaps = async (
  isTokenListed: boolean,
  projects: IProject[],
  donationsMap?: { [projectId: string]: any[] }
): Promise<{ [projectId: string]: number }> => {
  const results: { [projectId: string]: number } = {};
  
  const promises = projects.map(async (project) => {
    try {
      const donations = donationsMap ? donationsMap[project.id] : undefined;
      const marketCap = await calculateProjectMarketCap(isTokenListed, project, donations);
      results[project.id] = marketCap;
    } catch (error) {
      console.error(`Error calculating market cap for project ${project.id}:`, error);
      results[project.id] = 0;
    }
  });
  
  await Promise.all(promises);
  return results;
};

/**
 * Format market cap for display
 */
export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(1)}M`;
  }
  if (marketCap >= 1000) {
    return `$${(marketCap / 1000).toFixed(1)}K`;
  }
  return `$${marketCap.toFixed(2)}`;
}; 