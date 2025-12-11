import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
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

  // Determine the public directory path
  // Try script-relative path first, then fallback to process.cwd()
  let publicDir = path.join(__dirname, '../public');
  
  // If that doesn't exist, try from current working directory
  if (!fs.existsSync(path.dirname(publicDir))) {
    const cwdPublic = path.join(process.cwd(), 'public');
    if (fs.existsSync(path.dirname(cwdPublic)) || process.cwd().includes('main-app')) {
      publicDir = cwdPublic;
    }
  }

  // Ensure the public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');

  console.log(`Sitemap generated successfully at: ${sitemapPath}`);
} catch (error) {
  console.error('Error generating sitemap:', error);
  // Don't fail the build if sitemap generation fails
  console.warn('Continuing build without sitemap...');
  process.exit(0);
}

