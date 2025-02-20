/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@privy-io/react-auth', 'zustand'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'use-sync-external-store/shim/with-selector': require.resolve('use-sync-external-store/shim/with-selector.js'),
    };
    return config;
  },
}

module.exports = nextConfig