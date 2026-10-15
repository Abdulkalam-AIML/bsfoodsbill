/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
    // Use unoptimized for Vercel free tier to avoid image optimization quota
    unoptimized: true,
  },
};

module.exports = nextConfig;
