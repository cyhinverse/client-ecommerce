import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //https://res.cloudinary.com/mobilestore/image/upload/v1762505718/avatar/file_l1tkox.jpg
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
