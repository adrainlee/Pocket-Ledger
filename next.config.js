/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Use tr46 instead of punycode
    config.resolve.alias = {
      ...config.resolve.alias,
      punycode: path.resolve(__dirname, 'node_modules/tr46'),
    }

    // Handle URL properly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        url: require.resolve('whatwg-url'),
      }
    }

    // Ensure proper module resolution for URL handling
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, 'node_modules'),
    ]

    return config
  },
}

module.exports = nextConfig
