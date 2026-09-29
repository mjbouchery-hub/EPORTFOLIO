import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  allowedDevOrigins: ["100.95.146.114"],

  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;