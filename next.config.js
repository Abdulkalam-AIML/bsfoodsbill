/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence the workspace root detection warning
  outputFileTracingRoot: '/Users/abdulkalam/Desktop/BILLBS',

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
