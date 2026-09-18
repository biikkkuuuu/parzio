import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbAdmin } from './_firebase';
import { Sentry } from './_sentry';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!dbAdmin) {
      throw new Error('Database not initialized');
    }

    const productsSnap = await dbAdmin.collection('products').get();
    
    // We start with the base URL
    const baseUrl = 'https://parzio.in';
    
    // Base static routes
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    const staticRoutes = ['', '/categories', '/track', '/sale', '/offers'];
    
    staticRoutes.forEach(route => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic Product Routes
    productsSnap.forEach(doc => {
      const product = doc.data();
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/product/${product.id}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(xml);

  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
