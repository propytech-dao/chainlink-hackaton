/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.ctfassets.net', 'placehold.co'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
