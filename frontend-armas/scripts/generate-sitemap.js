/*
  Generate dynamic sitemap.xml into build/ using Supabase REST.
  Includes homepage, contacto, aviso-legal, and each published arma detail page.
*/
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ventadearmas.ar';
const SUPABASE_URL = 'https://kawklxcrhyuylnudslyq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthd2tseGNyaHl1eWxudWRzbHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDQ0NDAsImV4cCI6MjA3MzcyMDQ0MH0.VVtLb3z1FrSYvFpOLpcuuK65dHVjArITLMbxY1kGBi8';

async function fetchArmas() {
  const url = `${SUPABASE_URL}/rest/v1/armas?select=id,estado_publicacion&estado_publicacion=in.(PUBLICADA_SIN_CONTACTO,PUBLICADA_CON_CONTACTO,VENDIDA)`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error(`Supabase REST error ${res.status}`);
  }
  return res.json();
}

function buildXml(urls) {
  const today = new Date().toISOString().slice(0, 10);
  const items = urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}${u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>\n` : ''}${u.priority ? `    <priority>${u.priority}</priority>\n` : ''}  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

async function main() {
  try {
    const armas = await fetchArmas().catch(() => []);
    const today = new Date().toISOString().slice(0, 10);
    const urls = [
      { loc: `${BASE_URL}/`, lastmod: today, changefreq: 'daily', priority: '0.9' },
      { loc: `${BASE_URL}/contacto`, changefreq: 'monthly', priority: '0.4' },
      { loc: `${BASE_URL}/aviso-legal`, changefreq: 'yearly', priority: '0.2' }
    ];
    for (const a of armas) {
      if (!a || !a.id) continue;
      urls.push({ loc: `${BASE_URL}/arma/${a.id}`, changefreq: 'weekly', priority: '0.6' });
    }
    const xml = buildXml(urls);
    const outPath = path.join(process.cwd(), 'build', 'sitemap.xml');
    fs.writeFileSync(outPath, xml);
    console.log(`Sitemap written to ${outPath} with ${urls.length} URLs.`);
  } catch (e) {
    console.error('Failed to generate sitemap:', e.message);
    // Still write a minimal sitemap so the file exists
    const xml = buildXml([{ loc: `${BASE_URL}/` }]);
    const outPath = path.join(process.cwd(), 'build', 'sitemap.xml');
    fs.writeFileSync(outPath, xml);
  }
}

main();
