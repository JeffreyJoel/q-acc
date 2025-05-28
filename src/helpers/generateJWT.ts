import { Connector, signMessage as wagmiSignMessage } from '@wagmi/core';
// import { wagmiAdapter } from '@/config/wagmi';
import config from '@/config/configuration';
import { config as wagmiConfig } from '@/providers/PrivyProvider';
import { Address } from 'viem';

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

// Define the type for Privy's signMessage function
type PrivySignMessageFn = (
  payload: { message: string },
  options?: { address?: Address }
) => Promise<{ signature: string }>;

// Renamed: Signs with Privy's embedded wallet context
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

// New: Signs with an external wallet via wagmi
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

  // Using @wagmi/core signMessage with wagmiConfig
  const signature = await wagmiSignMessage(wagmiConfig, {
    account: address as Address, // Wagmi expects account address
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
      if (tokenObj.publicAddress.toLowerCase() === address.toLowerCase()) {
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
      }
      localStorage.removeItem('token');
    }
  } catch (error) {
    localStorage.removeItem('token');
    console.error(error);
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
