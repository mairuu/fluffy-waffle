/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/browse',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
