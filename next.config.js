/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'images.unsplash.com',
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },
  experimental: {
    // Enable modern webpack features
    webVitalsAttribution: ['CLS', 'LCP'],
    optimizePackageImports: ['gsap', 'framer-motion', 'lucide-react'],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack: (config, { dev, isServer, webpack }) => {
    // Security and fallback configurations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      path: require.resolve('path-browserify'),
      __dirname: false, // Will be handled by DefinePlugin below
    };
    
    // Handle importMap.js specifically for Payload CMS admin
    config.module.rules.push({
      test: /importMap\.js$/,
      type: 'javascript/esm',
    });

    // Handle Payload CMS assets with proper ES module support
    config.module.rules.push({
      test: /\.(svg|png|jpg|jpeg|gif)$/,
      include: /node_modules\/@payloadcms\/ui\/dist\/assets\//,
      type: 'asset/resource',
      generator: {
        emit: false, // Don't emit files, just return URLs
        publicPath: '/_next/static/payloadcms/',
        outputPath: 'static/payloadcms/',
      },
    });

    // ===== MEDIA HANDLING OPTIMIZATIONS =====
    // Optimize image loading with proper loaders
    // Exclude Payload CMS assets from file-loader to allow ES module imports
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
      exclude: /node_modules\/@payloadcms\/ui\/dist\/assets\//,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
            esModule: false,
          },
        },
      ],
    });

    // Audio and video file handling for music website
    config.module.rules.push({
      test: /\.(mp3|wav|ogg|m4a|aac|flac)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/audio/',
            outputPath: 'static/audio/',
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.(mp4|webm|mov|avi|mkv)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/video/',
            outputPath: 'static/video/',
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    // ===== PERFORMANCE OPTIMIZATIONS =====
    if (!dev) {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // GSAP animation library - separate chunk for better caching
            gsap: {
              test: /[\\/]node_modules[\\/](gsap|@gsap)[\\/]/,
              name: 'gsap',
              chunks: 'all',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Framer Motion - separate chunk
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              chunks: 'all',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Payload CMS - separate chunk
            payload: {
              test: /[\\/]node_modules[\\/](payload|@payloadcms)[\\/]/,
              name: 'payload',
              chunks: 'all',
              priority: 20,
              reuseExistingChunk: true,
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: 'ui-libs',
              chunks: 'all',
              priority: 15,
              reuseExistingChunk: true,
            },
            // React and core dependencies
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Default vendor chunk for other node_modules
            default: {
              minChunks: 2,
              priority: -10,
              reuseExistingChunk: true,
            },
          },
        },
        // Better tree shaking
        usedExports: true,
        sideEffects: false,
      };

      // Minimize bundle size with better compression
      config.plugins.push(
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        })
      );
    }

    // ===== DEVELOPMENT EXPERIENCE =====
    if (dev) {
      // Better error reporting in development
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development'),
        })
      );

      // Enhanced hot reloading for better DX
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.next', '**/dist', '**/.git'],
      };
    }

    // ===== MODERN ES MODULE OPTIMIZATIONS =====
    // Enable modern JavaScript features
    config.resolve.extensions = [
      '.js', '.jsx', '.ts', '.tsx', '.json', '.mjs', '.wasm'
    ];

    // Better module resolution for modern packages
    config.resolve.mainFields = isServer 
      ? ['main', 'module', 'browser'] 
      : ['browser', 'module', 'main'];

    // Enable modern syntax support
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // ===== SECURITY ENHANCEMENTS =====
    // Provide secure __dirname polyfill for browser context
    config.plugins.push(
      new webpack.DefinePlugin({
        __dirname: JSON.stringify('/'),
        __filename: JSON.stringify('/index.js'),
      })
    );

    // Prevent potential security issues while allowing necessary Node.js globals
    config.node = {
      __dirname: 'mock',
      __filename: 'mock',
    };

    // Let Next.js handle devtool configuration for optimal performance

    return config;
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' fonts.gstatic.com",
              "connect-src 'self' https:",
              "media-src 'self' blob: data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ],
      },
    ];
  },
  // Security configurations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  outputFileTracingRoot: '/Users/willemvandenberg/Development/Websites/LEANwebsite',
  
};

module.exports = nextConfig;