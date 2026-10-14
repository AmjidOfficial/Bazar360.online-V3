// BAZAR360 Dynamic XML Sitemap Generator
// Automatically generates valid search engine sitemap for search crawlers

export async function generateSitemapXml(baseUrl: string = 'https://bazar360.online'): Promise<string> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const now = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${cleanBase}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${cleanBase}/inventory`, priority: '0.9', changefreq: 'daily' },
    { loc: `${cleanBase}/dealers`, priority: '0.8', changefreq: 'daily' },
    { loc: `${cleanBase}/services`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${cleanBase}/dealers/auto-choice-peshawar`, priority: '0.9', changefreq: 'daily' },
    { loc: `${cleanBase}/sell`, priority: '0.7', changefreq: 'weekly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const item of staticUrls) {
    xml += `  <url>\n`;
    xml += `    <loc>${item.loc}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export default generateSitemapXml;
