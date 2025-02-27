/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TZ: "Asia/Bangkok",
  },
  images: {
    domains: [
      'localhost',
      'lengnoeiyionline.com',
    ],
  },
};

module.exports = nextConfig;
