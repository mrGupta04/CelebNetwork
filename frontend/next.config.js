/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      loaders: {
        '.js': 'babel',
      },
    },
  },
};

module.exports = nextConfig;
