/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co'], // Add your external domains here
    // Or use remotePatterns for more control:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
}

module.exports = nextConfig