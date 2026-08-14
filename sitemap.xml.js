// /api/sitemap.xml.js
// Dynamic sitemap generator — pulls live URLs from Supabase on every request
// and serves valid sitemap.xml to Google.
//
// IMPORTANT: none of the admin_* tables have a `slug` column. URLs are built
// from a slugified `title` + the row's `id` (uuid), then given a `.html`
// extension, matching the live URL pattern already in use
// (e.g. /jobs/dentist-dental-assistant-required-80e1ff43-....html).

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use whichever key you already use elsewhere
);

const BASE_URL = 'https://www.thedentistryinsight.com';

// Static hub pages that always exist
const staticUrls = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/jobs', priority: '0.9', changefreq: 'daily' },
  { loc: '/blogs', priority: '0.9', changefreq: 'daily' },
  { loc: '/workshop', priority: '0.8', changefreq: 'weekly' },
  { loc: '/market', priority: '0.8', changefreq: 'daily' },
  { loc: '/exams', priority: '0.8', changefreq: 'weekly' },
];

// Table -> URL prefix mapping, matching actual Supabase schema.
// Every table has: id (uuid), title (text), created_at (timestamptz).
// None have a `slug` column, so slugs are generated from title at request time.
const tableConfigs = [
  { table: 'admin_jobs', prefix: '/jobs' },
  { table: 'admin_blogs', prefix: '/blogs' },
  { table: 'admin_posts', prefix: '/posts' },
  { table: 'admin_market', prefix: '/market' },
  { table: 'admin_exams', prefix: '/exams' },
];

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req, res) {
  try {
    let urlEntries = staticUrls.map((u) => ({
      loc: `${BASE_URL}${u.loc}`,
      changefreq: u.changefreq,
      priority: u.priority,
      lastmod: null,
    }));

    // Pull dynamic rows from each table
    for (const config of tableConfigs) {
      const { data, error } = await supabase
        .from(config.table)
        .select('id, title, created_at');

      if (error) {
        console.error(`Error fetching ${config.table}:`, error.message);
        continue; // skip this table, don't fail the whole sitemap
      }

      if (data) {
        for (const row of data) {
          if (!row.id) continue;

          const slug = slugify(row.title);
          // Fall back to bare id if title is missing/empty after slugifying
          const path = slug ? `${slug}-${row.id}` : row.id;

          urlEntries.push({
            loc: `${BASE_URL}${config.prefix}/${path}.html`,
            changefreq: 'weekly',
            priority: '0.7',
            lastmod: row.created_at
              ? new Date(row.created_at).toISOString().split('T')[0]
              : null,
          });
        }
      }
    }

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // cache 1hr, refresh in background
    res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
}
