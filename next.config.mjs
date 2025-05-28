/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gateway.pinata.cloud', 'ipfs.io'],
  },
  // transpilePackages: ["@privy-io/react-auth"],
  webpack: (config) => {
    config.snapshot = {
      ...(config.snapshot ?? {}),
      // Add all node_modules to managedPaths, EXCEPT wagmi-connector, next/swc (which show
      // warnings if added). Allows for hot refresh of changes
      managedPaths: [
        /^(.+?[\\/]node_modules[\\/](?!(@privy-io[\\/]wagmi-connector|@next|@swc))(@.+?[\\/])?.+?)[\\/]/,
      ],
    };
    return config;
  },

};

export default nextConfig;
