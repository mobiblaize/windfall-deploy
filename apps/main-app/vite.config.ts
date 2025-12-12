import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from 'fs';
import path from 'path';

// Sitemap generation plugin
const sitemapPlugin = () => {
  return {
    name: 'generate-sitemap',
    closeBundle() {
      try {
        const baseUrl = 'https://homewindfall.com';
        const publicPages = [
          { url: '/dashboard', priority: '1.0', changefreq: 'daily' },
          { url: '/draws', priority: '0.9', changefreq: 'daily' },
          { url: '/raffles', priority: '0.9', changefreq: 'daily' },
          { url: '/winners', priority: '0.8', changefreq: 'daily' },
          { url: '/prize', priority: '0.8', changefreq: 'weekly' },
          { url: '/about', priority: '0.7', changefreq: 'monthly' },
          { url: '/faq', priority: '0.7', changefreq: 'monthly' },
          { url: '/contact-us', priority: '0.6', changefreq: 'monthly' },
          { url: '/game-rules', priority: '0.6', changefreq: 'monthly' },
          { url: '/terms-and-conditions', priority: '0.5', changefreq: 'yearly' },
          { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
          { url: '/cookie-policy', priority: '0.5', changefreq: 'yearly' },
          { url: '/terms-of-use', priority: '0.5', changefreq: 'yearly' },
          { url: '/responsible-playing', priority: '0.6', changefreq: 'monthly' },
          { url: '/download-app', priority: '0.7', changefreq: 'monthly' },
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        const distDir = path.resolve(process.cwd(), 'dist');
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
        console.log('✓ Sitemap generated in dist folder');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('Warning: Could not generate sitemap:', errorMessage);
      }
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemapPlugin()],
  publicDir: 'public',
});
