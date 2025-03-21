/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'example.com',
      '85a34aa98b710d.lhr.life',
      'railway.app',
      'up.railway.app',
    ],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://85a34aa98b710d.lhr.life',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://85a34aa98b710d.lhr.life/api',
  },
  experimental: {
    forceSwcTransforms: true,
  },
}

module.exports = nextConfig
