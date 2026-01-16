import { createMDX } from 'fumadocs-mdx/next';
import path from 'path';
import { fileURLToPath } from 'url';

const withMDX = createMDX();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isExport = process.env.SSG_EXPORT === '1'
const basePath = process.env.BASE_PATH || ''

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: isExport ? 'export' : 'standalone',
  ...(basePath ? { basePath } : {}),
  outputFileTracingRoot: path.resolve(__dirname, '..', '..'),
  images: {
    loader: 'custom',
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ['next-image-export-optimizer'],
  env: {
    nextImageExportOptimizer_imageFolderPath: 'public',
    nextImageExportOptimizer_exportFolderPath: 'out',
    nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',
    nextImageExportOptimizer_quality: '75',
    nextImageExportOptimizer_storePicturesInWEBP: 'true',
    nextImageExportOptimizer_storePicturesInAVIF: 'true',
    nextImageExportOptimizer_generateAndUseBlurImages: 'true',
    nextImageExportOptimizer_remoteImageCacheTTL: '0',
  },
  experimental: {
    memoryBasedWorkersCount: true,
    workerThreads: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

export default withMDX(config);

