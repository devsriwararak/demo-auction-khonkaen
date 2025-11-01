import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    domains: ["localhost", "192.168.1.7","192.168.100.228", "192.168.1.52"],
  },
  reactStrictMode : false,
  output: "standalone"
};

export default nextConfig;
