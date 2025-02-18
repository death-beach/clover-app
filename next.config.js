/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: '*' 
          },
          { 
            key: 'Access-Control-Allow-Methods', 
            value: 'GET,POST,PUT,DELETE,OPTIONS' 
          },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'Content-Type' 
          }
        ],
      },
    ]
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
      '@/app': path.join(__dirname, 'src/app'),
      '@/components': path.join(__dirname, 'src/components'),
      '@/config': path.join(__dirname, 'src/config'),
      '@/contexts': path.join(__dirname, 'src/contexts'),
      '@/features': path.join(__dirname, 'src/features'),
      '@/hooks': path.join(__dirname, 'src/hooks'),
      '@/lib': path.join(__dirname, 'src/lib'),
      '@/providers': path.join(__dirname, 'src/providers'),
      '@/services': path.join(__dirname, 'src/services'),
      '@/types': path.join(__dirname, 'src/types'),
      '@/utils': path.join(__dirname, 'src/utils'),
      '@/blockchain': path.join(__dirname, 'src/lib/blockchain'),
      '@/helius': path.join(__dirname, 'src/lib/helius')
    };

    // Add module resolution plugins if needed
    config.resolve.plugins = [
      ...config.resolve.plugins || [],
    ];

    // Enable proper source maps in development
    if (dev) {
      config.devtool = 'eval-source-map';
    }

    return config;
  },
  // Enable experimental features if needed
  experimental: {
    // Enable modern build output
    modern: true,
    // Enable server components
    serverComponents: true,
    // Enable concurrent features
    concurrentFeatures: true
  }
}

// Import path module at the top
const path = require('path');

module.exports = nextConfig