import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  // Old package URLs from before the store moved to /store.
  async redirects() {
    return [{ source: "/package/:id", destination: "/store/:id", permanent: true }];
  },
  images: {
    // Package images uploaded to Tebex are served from these hosts.
    remotePatterns: [
      { protocol: "https", hostname: "dunb17ur4ymx4.cloudfront.net" },
      { protocol: "https", hostname: "*.tebex.io" },
    ],
  },
};

export default nextConfig;
