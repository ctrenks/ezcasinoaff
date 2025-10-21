/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.allfreechips.com" },
      { protocol: "https", hostname: "**.radiumpowered.com" },
      { protocol: "https", hostname: "localhost", port: "3001" },
      { protocol: "https", hostname: "**.excasinoaff.com" },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      { protocol: "https", hostname: "***.digitaloceanspaces.com" },
    ],
    domains: ["your-vercel-blob-domain.com"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, "sharp"];
    }
    return config;
  },
};

module.exports = nextConfig;
