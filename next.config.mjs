/** @type {import("next").NextConfig} */
const isMobileExport = process.env.BUILD_TARGET === "mobile" || process.env.NEXT_EXPORT === "true";

const nextConfig = {
  ...(isMobileExport ? { output: "export" } : {}),
  images: {
    unoptimized: isMobileExport,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: ""
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      }
    ]
  }
};

export default nextConfig;
