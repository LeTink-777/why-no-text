import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The PDF route reads the Cyrillic TTFs at runtime, so they must be traced
  // into the serverless bundle — nothing imports them statically.
  outputFileTracingIncludes: {
    "/api/**": ["./assets/fonts/**"],
  },
  // Apex to www. Only fires once pochemu-ne-pishet.ru actually points at this project;
  // it is inert on the .vercel.app domain.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "pochemu-ne-pishet.ru" }],
        destination: "https://www.pochemu-ne-pishet.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
