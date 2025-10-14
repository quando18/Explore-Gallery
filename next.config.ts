import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https', 
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'the7eagles.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Allow all subdomains for common image hosting services
      {
        protocol: 'https',
        hostname: '*.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      // Wildcard for any HTTPS domain (use with caution in production)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
