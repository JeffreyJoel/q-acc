import { Connector, signMessage as wagmiSignMessage } from '@wagmi/core';
// import { wagmiAdapter } from '@/config/wagmi';
import config from '@/config/configuration';
import { config as wagmiConfig } from '@/providers/PrivyProvider';
import { Address } from 'viem';
import { ethers } from 'ethers';

// Generate Nonce
export const fetchNonce = async (): Promise<string> => {
  const nonceResponse: any = await fetch(
    `${config.AUTH_BASE_ROUTE}/nonce`,
  ).then(n => {
    return n.json();
  });
  const nonce = nonceResponse.message;
  return nonce;
};

// Generate SIWE Message
export const createSiweMessage = async (
  address: string,
  chainId: number,
  statement: string,
) => {
  let domain = 'qacc.io';
  try {
    if (typeof window !== 'undefined') {
      domain = window.location.hostname;
    }
    const nonce = await fetchNonce();
    const { SiweMessage } = await import('siwe');
    const siweMessage = new SiweMessage({
      domain,
      address,
      nonce,
      statement,
      uri: origin,
      version: '1',
      chainId,
    });
    return {
      message: siweMessage.prepareMessage(),
      nonce,
    };
  } catch (error) {
    console.error({ error });
    return false;
  }
};

type PrivySignMessageFn = (
  payload: { message: string },
  options?: { address?: Address }
) => Promise<{ signature: string }>;

export const signChallengeWithPrivyEmbed = async (
  privySignMessage: PrivySignMessageFn,
  address: string,
  chainId: number,
) => {
  const siweMessage: any = await createSiweMessage(
    address!,
    chainId!,
    'Login into Giveth services',
  );

  const { message, nonce } = siweMessage;

  const result = await privySignMessage(
    { message },
    { address: address as Address }
  );
  const signature = result.signature;

  console.log('Privy Embed Sign:', signature);
  console.log('Message:', message);
  console.log('Nonce:', nonce);

  const headers = { 'Content-Type': 'application/json', authVersion: '2' };
  const body: Record<string, any> = {
    signature,
    message,
    nonce,
  };

  try {
    return fetch(`${config.AUTH_BASE_ROUTE}/authentication`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }).then(async response => {
      if (response.ok) {
        return await response.json();
      } else {
        const errorObject = await response.json();
        const errorMessage =
          (errorObject.message || errorObject?.errors[0]?.message) ??
          'An error occurred';
        return Promise.reject(new Error(errorMessage));
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const signChallengeWithExternalWallet = async (
  address: string,
  chainId: number,
) => {
  const siweMessage: any = await createSiweMessage(
    address!,
    chainId!,
    'Login into Giveth services',
  );

  const { message, nonce } = siweMessage;

  const signature = await wagmiSignMessage(wagmiConfig, {
    account: address as Address,
    message: message,
  });

  console.log('External Wallet Sign:', signature);
  console.log('Message:', message);
  console.log('Nonce:', nonce);

  const headers = { 'Content-Type': 'application/json', authVersion: '2' };
  const body: Record<string, any> = {
    signature,
    message,
    nonce,
  };

  try {
    return fetch(`${config.AUTH_BASE_ROUTE}/authentication`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }).then(async response => {
      if (response.ok) {
        return await response.json();
      } else {
        const errorObject = await response.json();
        const errorMessage =
          (errorObject.message || errorObject?.errors[0]?.message) ??
          'An error occurred';
        return Promise.reject(new Error(errorMessage));
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLocalStorageToken = (address: string) => {
  try {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const tokenObj = JSON.parse(storedToken);
      
      // Standardize both addresses to checksum format for comparison
      const storedAddress = tokenObj.publicAddress ? ethers.getAddress(tokenObj.publicAddress) : null;
      const checkAddress = ethers.getAddress(address);
      
      console.log('Token check - Stored:', storedAddress, 'Current:', checkAddress);
      
      if (storedAddress && storedAddress === checkAddress) {
        // Check if the token is expired (if it has an expiration time)
        if (tokenObj.expiration) {
          const currentTime = Math.floor(Date.now());
          if (currentTime > tokenObj.expiration) {
            localStorage.removeItem('token');
            console.log('Token has expired and has been removed.');
            return null;
          }
        }
        return storedToken;
      } else {
        console.log('Token address mismatch - not deleting, just returning null');
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error checking token:', error);
    // Delete on parsing errors, not address mismatches
    localStorage.removeItem('token');
    return null;
  }
};

export const getCurrentUserToken = () => {
  try {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const tokenObj = JSON.parse(storedToken);
      if (tokenObj.expiration) {
        const currentTime = Math.floor(Date.now());
        if (currentTime > tokenObj.expiration) {
          localStorage.removeItem('token');
          console.log('Token has expired and has been removed.');
          return null;
        }
      }
      return tokenObj.jwt;
    }
  } catch (error) {
    console.error(error);
  }
};
