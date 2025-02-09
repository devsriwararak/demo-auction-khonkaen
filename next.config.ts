import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    domains: ["localhost", "192.168.1.7"],
  },
  reactStrictMode : false,
  output: "standalone"
};

export default nextConfig;
