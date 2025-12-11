import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(
  path.join(publicDir, 'sitemap.xml'),
  sitemap
);

console.log('Sitemap generated successfully!');

