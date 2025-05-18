/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.cache = {
      type: 'filesystem',
      compression: false,
      maxAge: 5184000000 // 60 days in milliseconds
    };
    return config;
  }
};

module.exports = nextConfig;