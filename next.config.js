/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  experimental: {
    appDir: true,
  },
  // Enable Turbopack
  experimental: {
    turbo: {}
  },
  // Remove webpack configuration as it's not needed with Turbopack
};

export default nextConfig;
