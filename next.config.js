/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TZ: "Asia/Bangkok",
  },
  images: {
    domains: [
      'localhost',
    ],
  },
};

module.exports = nextConfig;
