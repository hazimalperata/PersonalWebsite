import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'flagsapi.com',
                pathname: '/**',
            }, {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                pathname: '/**'
            }
        ]
    }
};

export default withNextIntl(nextConfig);
