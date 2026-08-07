import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    devIndicators: false,
    eslint: {
        ignoreDuringBuilds: process.env.VERCEL === '1',
    },
};

export default nextConfig;
