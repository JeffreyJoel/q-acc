import { useState, useEffect, useMemo } from 'react';
import { IProject } from '@/types/project.type';
import { fetchProjectDonationsById } from '@/services/donation.service';
import { fetchGeckoMarketCap, getTokenSupplyDetails } from '@/services/tokenPrice.service';
import { calculateCapAmount } from '@/helpers/round';
import { calculateTotalDonations } from '@/helpers/donations';
import { getUpcomingRound } from '@/helpers/date';
import { EDirection, EOrderBy } from '@/components/project/project-details/ProjectDonationTable';
import { 
  useFetchActiveRoundDetails,
  useFetchAllRoundDetails 
} from '@/hooks/useRounds';
import { useFetchPOLPriceSquid } from '@/hooks/useTokens';

export interface ProjectAggregatedData {
  [projectId: string]: {
    // Donation data
    totalPOLDonated: number;
    amountDonatedInRound: number;
    maxPOLCap: number;
    
    // Market data
    marketCap: number;
    marketCapLoading: boolean;
    
    // Token data (using project.listed directly)
    isTokenListed: boolean;
    
    // Round data
    roundStatus: string;
    
    // Loading states
    dataLoading: boolean;
    error?: string;
  };
}

// Simple request queue for rate limiting
class SimpleRequestQueue {
  private queue: (() => Promise<any>)[] = [];
  private processing = false;
  private requestsPerSecond = 20; // Higher rate since we're making fewer calls
  
  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }
  
  private async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      await request();
      
      // Minimal delay since we're making fewer calls
      if (this.queue.length > 0) {
        await new Promise(resolve => 
          setTimeout(resolve, 1000 / this.requestsPerSecond)
        );
      }
    }
    
    this.processing = false;
  }
}

const requestQueue = new SimpleRequestQueue();

// Fast batch fetch donations (no change needed)
const fastBatchFetchProjectDonations = async (projects: IProject[]) => {
  const batchSize = 10;
  const results: any[] = [];
  
  for (let i = 0; i < projects.length; i += batchSize) {
    const batch = projects.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (project) => {
      try {
        const data = await fetchProjectDonationsById(
          parseInt(project.id),
          1000,
          0,
          { field: EOrderBy.CreationDate, direction: EDirection.ASC }
        );
        return { projectId: project.id, data, error: null };
      } catch (error) {
        console.error(`Error fetching donations for project ${project.id}:`, error);
        return { projectId: project.id, data: null, error: error as Error };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    if (i + batchSize < projects.length) {
      await new Promise(resolve => setTimeout(resolve, 50)); // Even faster
    }
  }
  
  return results;
};

// Simplified market cap calculation using project.listed and fetchGeckoMarketCap
const simplifiedBatchCalculateMarketCaps = async (projects: IProject[]) => {
  const batchSize = 8; // Larger batches since we're making simpler calls
  const results: any[] = [];
  
  for (let i = 0; i < projects.length; i += batchSize) {
    const batch = projects.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (project) => {
      try {
        let marketCap = 0;
        
        if (project.listed && project.abc?.issuanceTokenAddress) {
          // For listed tokens, use Gecko market cap directly
          const geckoData = await requestQueue.add(() =>
            fetchGeckoMarketCap(project.abc!.issuanceTokenAddress!)
          );
          
          if (geckoData?.marketCap && !isNaN(geckoData.marketCap)) {
            marketCap = geckoData.marketCap;
          }
        } else if (project.abc?.fundingManagerAddress) {
          // For unlisted tokens, calculate simple market cap
          const tokenSupplyData = await requestQueue.add(() =>
            getTokenSupplyDetails(project.abc!.fundingManagerAddress!)
          );
          
          const reserveRatio = Number(tokenSupplyData.reserve_ration);
          const reserve = Number(tokenSupplyData.collateral_supply);
          const supply = Number(tokenSupplyData.issuance_supply);
          
          if (reserveRatio > 0 && reserve > 0 && supply > 0) {
            const initialPrice = (reserve / (supply * reserveRatio)) * 1.1;
            marketCap = supply * initialPrice;
          }
        }

        return { 
          projectId: project.id, 
          marketCap,
          error: null 
        };
      } catch (error) {
        console.error(`Error calculating market cap for project ${project.id}:`, error);
        return { 
          projectId: project.id, 
          marketCap: 0,
          error: error as Error 
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    if (i + batchSize < projects.length) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Minimal delay
    }
  }
  
  return results;
};

// Fast POL cap calculation (no change needed)
const fastBatchCalculatePOLCaps = async (projects: IProject[], activeRoundDetails: any) => {
  if (!activeRoundDetails) return [];
  
  const batchSize = 10; // Larger batch
  const results: any[] = [];
  
  for (let i = 0; i < projects.length; i += batchSize) {
    const batch = projects.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (project) => {
      try {
        const { capAmount, totalDonationAmountInRound } = await requestQueue.add(() =>
          calculateCapAmount(
            activeRoundDetails,
            Number(project.id),
            true
          )
        );
        
        return { 
          projectId: project.id, 
          maxPOLCap: capAmount, 
          amountDonatedInRound: totalDonationAmountInRound,
          error: null 
        };
      } catch (error) {
        console.error(`Error calculating POL cap for project ${project.id}:`, error);
        return { 
          projectId: project.id, 
          maxPOLCap: 0, 
          amountDonatedInRound: 0,
          error: error as Error 
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    if (i + batchSize < projects.length) {
      await new Promise(resolve => setTimeout(resolve, 75));
    }
  }
  
  return results;
};

// Calculate round status for all projects (unchanged)
const calculateRoundStatuses = async (projects: IProject[], allRounds: any[]) => {
  if (!allRounds) return [];
  
  try {
    const upcomingRound = await getUpcomingRound(allRounds);
    const roundStatus = upcomingRound?.startDate ? "starts" : "ended";
    
    return projects.map(project => ({
      projectId: project.id,
      roundStatus,
      error: null
    }));
  } catch (error) {
    console.error('Error calculating round statuses:', error);
    return projects.map(project => ({
      projectId: project.id,
      roundStatus: "ended",
      error: error as Error
    }));
  }
};

export const useProjectsAggregatedData = (projects: IProject[]) => {
  const [aggregatedData, setAggregatedData] = useState<ProjectAggregatedData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: POLPrice } = useFetchPOLPriceSquid();
  const { data: activeRoundDetails } = useFetchActiveRoundDetails();
  const { data: allRounds } = useFetchAllRoundDetails();
  
  const polPriceNumber = Number(POLPrice);

  useEffect(() => {
    if (!projects || projects.length === 0 || !polPriceNumber) return;

    let isCancelled = false;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🚀 Starting SIMPLIFIED aggregated data fetch for ${projects.length} projects`);
        const startTime = performance.now();

        // Initialize aggregated data with basic project data
        const initialData: ProjectAggregatedData = {};
        projects.forEach(project => {
          initialData[project.id] = {
            totalPOLDonated: project.totalDonations || 0,
            amountDonatedInRound: 0,
            maxPOLCap: 0,
            marketCap: 0,
            marketCapLoading: true,
            isTokenListed: project.listed || false, // Use project.listed directly
            roundStatus: "ended",
            dataLoading: true,
          };
        });
        
        if (!isCancelled) {
          setAggregatedData(initialData);
        }

        // Step 1: Fetch donations data
        console.log('📊 Fetching donations data...');
        const donationsData = await fastBatchFetchProjectDonations(projects);
        
        if (isCancelled) return;

        // Update with donations data immediately
        const updatedData = { ...initialData };
        donationsData.forEach(({ projectId, data }) => {
          if (data) {
            const { donations } = data;
            updatedData[projectId] = {
              ...updatedData[projectId],
              totalPOLDonated: calculateTotalDonations(donations),
            };
          }
        });
        setAggregatedData(updatedData);

        // Step 2: Fetch remaining data in parallel (simplified)
        console.log('💰 Fetching market caps, POL caps, and round statuses...');
        const [
          marketCapData,
          polCapData, 
          roundStatusData
        ] = await Promise.all([
          simplifiedBatchCalculateMarketCaps(projects),
          fastBatchCalculatePOLCaps(projects, activeRoundDetails),
          calculateRoundStatuses(projects, allRounds || [])
        ]);

        if (isCancelled) return;

        // Step 3: Combine all data
        console.log('🔄 Combining all data...');
        const finalData: ProjectAggregatedData = {};
        
        projects.forEach(project => {
          const donations = donationsData.find(d => d.projectId === project.id);
          const marketCap = marketCapData.find(d => d.projectId === project.id);
          const polCap = polCapData.find(d => d.projectId === project.id);
          const roundStatus = roundStatusData.find(d => d.projectId === project.id);
          
          finalData[project.id] = {
            totalPOLDonated: donations?.data ? calculateTotalDonations(donations.data.donations) : (project.totalDonations || 0),
            amountDonatedInRound: polCap?.amountDonatedInRound || 0,
            maxPOLCap: polCap?.maxPOLCap || 0,
            marketCap: marketCap?.marketCap || 0,
            marketCapLoading: false,
            isTokenListed: project.listed || false, // Use project.listed directly
            roundStatus: roundStatus?.roundStatus || "ended",
            dataLoading: false,
            error: donations?.error?.message || marketCap?.error?.message || polCap?.error?.message
          };
        });

        const endTime = performance.now();
        console.log(`✅ SIMPLIFIED aggregated data fetch completed in ${Math.round(endTime - startTime)}ms`);
        setAggregatedData(finalData);
        
      } catch (err) {
        console.error('❌ Error in aggregated data fetch:', err);
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch aggregated data');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isCancelled = true;
    };
  }, [projects, polPriceNumber, activeRoundDetails, allRounds]);

  return { 
    aggregatedData, 
    loading, 
    error,
    // Convenience function to get data for a specific project
    getProjectData: (projectId: string) => aggregatedData[projectId] || null
  };
}; 