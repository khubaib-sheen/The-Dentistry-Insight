#!/usr/bin/env node
/**
 * The Dentistry Insight — SEO prerender script
 * ---------------------------------------------
 * Runs on every deploy (via `npm run build`). It:
 *   1. Fetches every row from the 5 Supabase tables (jobs, blogs, workshop
 *      posts, market, exams).
 *   2. Writes one real, crawlable static HTML page per listing, with the
 *      actual title/description baked into the HTML (not injected by JS),
 *      plus proper <title>, meta description, Open Graph tags, and JSON-LD.
 *   3. Writes a folder "hub" page per section (/jobs/, /blogs/, etc.)
 *      listing links to every item in that section, so crawlers have a
 *      normal path to discover every page (not just the sitemap).
 *   4. Generates sitemap.xml covering the homepage + every generated page.
 *   5. Copies everything else in the repo root (index.html, admin.html,
 *      logo.png, etc.) into /public untouched, so the existing single-page
 *      app keeps working exactly as it does today.
 *
 * The interactive SPA (index.html) is NOT modified by this script.
 * These generated pages are an additional, SEO-facing layer that link
 * back into it.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ---- Config -----------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rtzxxeeqfhmmnoubwzvq.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_v8RouLqDckbyAXURXFo18w_Q0M3Qx5-';
const SITE_URL = (process.env.SITE_URL || 'https://www.thedentistryinsight.com').replace(/\/$/, '');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public');
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TYPES = {
  jobs:   { table: 'admin_jobs',   folder: 'jobs',     label: 'Dental Jobs',     badge: 'Job Opening',     hub: 'Latest dental job openings' },
  blogs:  { table: 'admin_blogs',  folder: 'blogs',    label: 'Dental Blogs',    badge: 'Blog',            hub: 'Latest dental blog posts' },
  posts:  { table: 'admin_posts',  folder: 'workshop', label: 'Dental Workshop', badge: 'Workshop',        hub: 'Dental workshops & community posts' },
  market: { table: 'admin_market', folder: 'market',   label: 'Dental Market',   badge: 'Market Listing',  hub: 'Dental equipment, clinics & market listings' },
  exams:  { table: 'admin_exams',  folder: 'exams',    label: 'Licensing Exams', badge: 'Licensing Exam',  hub: 'Dental licensing exam resources' },
  students: { table: 'admin_students', folder: 'students', label: 'Student Corner', badge: 'Student Resource', hub: 'Notes and resources for dental undergraduate students' },
};

// ---- Helpers ------------------------------------------------------------
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function plainText(str, max = 155) {
  const clean = String(str || '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1).trim() + '…' : clean;
}

function linkify(str) {
  return escapeHtml(str).replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener" class="text-emerald-600 underline break-all">$1</a>'
  );
}

function slugify(str) {
  return String(str || 'listing')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 70) || 'listing';
}

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function copyRecursive(src, dest, skip) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(s, d, skip);
    else fs.copyFileSync(s, d);
  }
}

function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return String(d); }
}

// ---- Page layout --------------------------------------------------------
function layout({ title, description, image, canonical, ogType, jsonLd, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical)}">

<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="The Dentistry Insight">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:url" content="${escapeHtml(canonical)}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(image)}">

${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.tailwindcss.com"></script>
<style>body{font-family:'Inter',sans-serif;background:#f8fafc;color:#1e293b;}</style>
</head>
<body class="min-h-screen flex flex-col">
  <div class="bg-[#0c2340] text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center">
    <a href="/" class="font-black tracking-tight">The Dentistry Insight</a>
    <span class="opacity-80">Dr. Hussain Ahmad</span>
  </div>
  <main class="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
    ${body}
  </main>
  <footer class="bg-[#0c2340] text-slate-300 text-center py-6 text-xs mt-auto">
    © ${new Date().getFullYear()} Dr. Hussain Ahmad. All rights reserved.
  </footer>
</body>
</html>`;
}

const backLink = (typeKey, id) =>
  `<div class="mt-10 pt-6 border-t border-slate-200 flex flex-wrap gap-3">
     <a href="/#${typeKey}:${id}" class="inline-block px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition">View interactively on the main site</a>
     <a href="/" class="inline-block px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition">← Back to The Dentistry Insight</a>
   </div>`;

// ---- Per-type page builders ---------------------------------------------
function buildJob(item) {
  const title = `${item.title || 'Dental Job'}${item.company ? ' at ' + item.company : ''} | The Dentistry Insight`;
  const description = plainText(item.description || item.content || item.title);
  const image = item.image_url || PLACEHOLDER_IMAGE;
  // Google for Jobs wants validThrough or it treats the posting as expired
  // ~30 days after crawl and stops showing it. Default to 60 days out from
  // whichever date we actually have.
  const postedDate = item.created_at ? new Date(item.created_at) : new Date();
  const validThrough = new Date(postedDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();
  const hasAnyApplyMethod = Boolean(item.apply_link || item.whatsapp_number || item.contact_email);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'JobPosting',
    title: item.title, description: description,
    datePosted: item.created_at,
    validThrough,
    employmentType: item.employment_type || 'FULL_TIME',
    directApply: hasAnyApplyMethod,
    hiringOrganization: { '@type': 'Organization', name: item.company || 'The Dentistry Insight' },
    jobLocation: item.location ? { '@type': 'Place', address: item.location } : undefined,
    baseSalary: item.salary ? { '@type': 'MonetaryAmount', currency: 'PKR', value: { '@type': 'QuantitativeValue', value: item.salary } } : undefined,
    applicationContact: (item.apply_link || item.whatsapp_number || item.contact_email) ? {
      '@type': 'ContactPoint',
      url: item.apply_link || undefined,
      email: item.contact_email || undefined,
      telephone: item.whatsapp_number || undefined,
    } : undefined,
  };
  const body = `
    <span class="px-2.5 py-1 bg-blue-50 text-[#0056b3] text-[9px] font-extrabold uppercase rounded-full tracking-wider">Job Opening</span>
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-3 mb-2">${escapeHtml(item.title)}</h1>
    <p class="text-sm text-slate-500 font-semibold mb-1">${escapeHtml(item.company || '')} ${item.location ? '· ' + escapeHtml(item.location) : ''} ${item.salary ? '· ' + escapeHtml(item.salary) : ''}</p>
    <p class="text-xs text-slate-400 font-semibold mb-6">${formatDate(item.created_at)}</p>
    ${item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt="" class="w-full rounded-xl mb-6">` : ''}
    <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">${escapeHtml(item.content || item.description)}</div>
    <div class="mt-6 flex flex-wrap gap-3">
      ${item.apply_link ? `<a href="${escapeHtml(item.apply_link)}" target="_blank" rel="noopener" class="inline-block px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg">Apply Now</a>` : ''}
      ${item.whatsapp_number ? `<a href="https://wa.me/${escapeHtml(item.whatsapp_number).replace(/[^0-9]/g, '')}" target="_blank" rel="noopener" class="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg">WhatsApp</a>` : ''}
      ${item.contact_email ? `<a href="mailto:${escapeHtml(item.contact_email)}" class="inline-block px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg">Email to Apply</a>` : ''}
    </div>
    ${backLink('jobs', item.id)}`;
  return { title, description, image, jsonLd, body, ogType: 'article' };
}

function buildBlog(item) {
  const title = `${item.title || 'Dental Blog'} | The Dentistry Insight`;
  const description = plainText(item.description || item.content || item.title);
  const image = item.image_url || PLACEHOLDER_IMAGE;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: item.title, description, image,
    datePublished: item.created_at,
    author: { '@type': 'Person', name: 'Dr. Hussain Ahmad' },
  };
  const body = `
    ${item.category ? `<span class="px-2.5 py-1 bg-blue-50 text-[#0056b3] text-[9px] font-extrabold uppercase rounded-full tracking-wider">${escapeHtml(item.category)}</span>` : ''}
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-3 mb-6">${escapeHtml(item.title)}</h1>
    <img src="${escapeHtml(image)}" alt="" class="w-full rounded-xl mb-6">
    <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">${escapeHtml(item.content || item.description)}</div>
    ${item.pdf_url ? `<a href="${escapeHtml(item.pdf_url)}" target="_blank" rel="noopener" class="mt-6 inline-block px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg">Download PDF</a>` : ''}
    ${backLink('blogs', item.id)}`;
  return { title, description, image, jsonLd, body, ogType: 'article' };
}

function buildPost(item) {
  const title = `${item.title || 'Dental Workshop'} | The Dentistry Insight`;
  const description = plainText(item.description || item.title);
  const image = item.image_url || PLACEHOLDER_IMAGE;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: item.title, description, image, datePublished: item.created_at,
  };
  const body = `
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2">${escapeHtml(item.title)}</h1>
    <p class="text-xs text-slate-400 font-semibold mb-6">${formatDate(item.created_at)}</p>
    <img src="${escapeHtml(image)}" alt="" class="w-full rounded-xl mb-6">
    <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">${escapeHtml(item.content || item.description)}</div>
    <div class="mt-6 flex flex-wrap gap-3">
      ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener" class="inline-block px-4 py-2 bg-blue-50 text-[#0056b3] font-bold text-xs rounded-lg">Open Link</a>` : ''}
      ${item.pdf_url ? `<a href="${escapeHtml(item.pdf_url)}" target="_blank" rel="noopener" class="inline-block px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg">View PDF</a>` : ''}
    </div>
    ${backLink('posts', item.id)}`;
  return { title, description, image, jsonLd, body, ogType: 'article' };
}

function buildMarket(item) {
  const title = `${item.title || 'Dental Market Listing'} | The Dentistry Insight`;
  const description = plainText(item.description || item.title);
  const image = item.image_url || PLACEHOLDER_IMAGE;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: item.title, description, image,
  };
  const body = `
    <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase rounded-full tracking-wider">Market Listing</span>
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-3 mb-6">${escapeHtml(item.title)}</h1>
    <img src="${escapeHtml(image)}" alt="" class="w-full rounded-xl mb-6">
    <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">${escapeHtml(item.content || item.description)}</div>
    ${item.contact ? `<p class="text-sm text-slate-600 font-semibold mt-4"><i class="fa-solid fa-phone mr-1"></i>${escapeHtml(item.contact)}</p>` : ''}
    <div class="mt-6 flex flex-wrap gap-3">
      ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener" class="inline-block px-4 py-2 bg-[#0056b3] text-white font-bold text-xs rounded-lg">View Link</a>` : ''}
      ${item.whatsapp_number ? `<a href="https://wa.me/${escapeHtml(item.whatsapp_number).replace(/[^0-9]/g, '')}" target="_blank" rel="noopener" class="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg">WhatsApp</a>` : ''}
    </div>
    ${backLink('market', item.id)}`;
  return { title, description, image, jsonLd, body, ogType: 'article' };
}

function buildExam(item) {
  const title = `${item.title || 'Licensing Exam Resource'} | The Dentistry Insight`;
  const description = plainText(item.description || item.content || item.title);
  const image = item.image_url || PLACEHOLDER_IMAGE;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: item.title, description, image,
  };
  const links = Array.isArray(item.links) ? item.links : [];
  const body = `
    <span class="px-2.5 py-1 bg-purple-50 text-purple-700 text-[9px] font-extrabold uppercase rounded-full tracking-wider">Licensing Exam</span>
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-3 mb-2">${escapeHtml(item.title)}</h1>
    ${item.exam_date ? `<p class="text-xs text-slate-400 font-semibold mb-6">${formatDate(item.exam_date)}</p>` : ''}
    <img src="${escapeHtml(image)}" alt="" class="w-full rounded-xl mb-6">
    <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">${escapeHtml(item.content || item.description)}</div>
    <div class="mt-6 flex flex-wrap gap-3">
      ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener" class="inline-block px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-lg">View Details</a>` : ''}
      ${links.map(l => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener" class="inline-block px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-lg">${escapeHtml(l.label || 'Open Link')}</a>`).join('')}
    </div>
    ${backLink('exams', item.id)}`;
  return { title, description, image, jsonLd, body, ogType: 'article' };
}

function buildStudent(item) {
  const title = `${item.title || 'Student Resource'} | Student Corner | The Dentistry Insight`;
  const description = plainText(item.description || item.title);
  const image = PLACEHOLDER_IMAGE;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: item.title, description, about: item.subject,
  };
  const body = `
    ${item.subject ? `<span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase rounded-full tracking-wider">${escapeHtml(item.subject)}</span>` : ''}
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-3 mb-6">${escapeHtml(item.title)}</h1>
    <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">${linkify(item.description)}</div>
    ${backLink('students', item.id)}`;
  return { title, description, image, jsonLd, body, ogType: 'article' };
}

const BUILDERS = { jobs: buildJob, blogs: buildBlog, posts: buildPost, market: buildMarket, exams: buildExam, students: buildStudent };

// ---- Hub (index) page per section ---------------------------------------
function buildHub(typeKey, meta, items) {
  const title = `${meta.label} | The Dentistry Insight`;
  const description = plainText(`${meta.hub}. Browse all current ${meta.label.toLowerCase()} from The Dentistry Insight.`);
  const cards = items.map(item => {
    const slug = `${slugify(item.title)}-${item.id}`;
    return `<a href="/${meta.folder}/${slug}.html" class="block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition">
      <span class="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase rounded-full">${escapeHtml(meta.badge)}</span>
      <h2 class="text-base font-bold text-slate-900 mt-2">${escapeHtml(item.title)}</h2>
      <p class="text-xs text-slate-500 mt-2 line-clamp-2">${escapeHtml(plainText(item.description, 140))}</p>
    </a>`;
  }).join('\n');
  const body = `
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2">${escapeHtml(meta.label)}</h1>
    <p class="text-sm text-slate-500 mb-8">${escapeHtml(meta.hub)}</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${cards || '<p class="text-sm text-slate-400">No listings yet.</p>'}</div>
    <div class="mt-10 pt-6 border-t border-slate-200">
      <a href="/" class="inline-block px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition">← Back to The Dentistry Insight</a>
    </div>`;
  return { title, description, image: PLACEHOLDER_IMAGE, jsonLd: null, body, ogType: 'website' };
}

// ---- Main -----------------------------------------------------------------
async function main() {
  console.log('Copying static site into /public …');
  copyRecursive(ROOT, OUT_DIR, ['public', 'scripts', 'node_modules', '.git', '.vercel']);

  const buildRunDate = new Date().toISOString().slice(0, 10);
  const sitemapUrls = [{ loc: `${SITE_URL}/`, lastmod: buildRunDate, priority: '1.0' }];

  for (const [typeKey, meta] of Object.entries(TYPES)) {
    console.log(`Fetching ${meta.table} …`);
    const { data, error } = await supabase.from(meta.table).select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(`  ! Could not read ${meta.table}:`, error.message);
      continue;
    }
    const items = data || [];
    console.log(`  ${items.length} row(s)`);

    const folderDir = path.join(OUT_DIR, meta.folder);
    ensureDir(folderDir);

    // Track the most recent item date in this section, so the hub page's
    // lastmod reflects when the section itself was actually last updated.
    let latestItemDate = null;

    for (const item of items) {
      const slug = `${slugify(item.title)}-${item.id}`;
      const canonical = `${SITE_URL}/${meta.folder}/${slug}.html`;
      const built = BUILDERS[typeKey](item);
      const html = layout({ ...built, canonical });
      fs.writeFileSync(path.join(folderDir, `${slug}.html`), html);
      sitemapUrls.push({ loc: canonical, lastmod: item.created_at, priority: '0.8' });

      if (item.created_at && (!latestItemDate || new Date(item.created_at) > new Date(latestItemDate))) {
        latestItemDate = item.created_at;
      }
    }

    // Hub/index page for the section, e.g. /jobs/index.html
    // lastmod = newest item's created_at (falls back to today's build date
    // if the section has no items yet), so this carries the same freshness
    // signal as every individual item page instead of being left blank.
    const hubCanonical = `${SITE_URL}/${meta.folder}/`;
    const hubHtml = layout({ ...buildHub(typeKey, meta, items), canonical: hubCanonical });
    fs.writeFileSync(path.join(folderDir, 'index.html'), hubHtml);
    sitemapUrls.push({ loc: hubCanonical, lastmod: latestItemDate || buildRunDate, priority: '0.6' });
  }

  // ---- sitemap.xml ----
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemapXml);

  // ---- robots.txt (only create if one doesn't already exist in the repo) ----
  const robotsPath = path.join(OUT_DIR, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    fs.writeFileSync(robotsPath, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  }

  console.log(`\nDone. Generated ${sitemapUrls.length - 1} pages + sitemap.xml in /public.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
