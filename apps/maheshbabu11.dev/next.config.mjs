import bundeAnalyzer from '@next/bundle-analyzer';
import nextMDX from '@next/mdx';
import withPWA from 'next-pwa';
import rehypePlugins from 'rehype-plugins';
import remarkPlugins from 'remark-plugins';

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    {
      source: '/work',
      destination: '/work/skills-and-tools',
      permanent: false,
    },
    {
      source: '/docs',
      destination: '/docs/tailwindcss-accent',
      permanent: false,
    },
  ],
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
};

const withBundleAnalyzer = bundeAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
    rehypePlugins,
    providerImportSource: '@mdx-js/react',
  },
});

// Configuration object tells the next-pwa plugin
const withPWAConfig = withPWA({
  dest: 'public', // Destination directory for the PWA files
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

export default withPWAConfig(withBundleAnalyzer(withMDX(nextConfig)));
