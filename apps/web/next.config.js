/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@olympusbet/ui'],
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

module.exports = nextConfig;
