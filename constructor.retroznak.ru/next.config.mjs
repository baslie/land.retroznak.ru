/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Beget hosting optimization
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
