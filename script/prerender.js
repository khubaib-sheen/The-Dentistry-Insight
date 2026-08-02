import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const OUT = 'public'
const SITE = 'https://the-dentistry-insight.vercel.app'

async function run() {
  fs.mkdirSync(OUT, { recursive: true })
  
  const tables = ['jobs', 'blogs', 'workshop', 'market', 'exams']
  let urls = [SITE + '/']

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*')
    if(error) { console.log('ERROR:', table, error.message); continue }
    console.log(`${table}: ${data.length} rows`)
    
    fs.mkdirSync(path.join(OUT, table), { recursive: true })
    
    data.forEach(item => {
      const slug = item.slug || item.id
      const title = item.title || item.name || 'Untitled'
      const desc = item.description || item.content || ''
      
      const pageHtml = `<!DOCTYPE html><html><head><title>${title} | The Dentistry Insight</title></head><body><h1>${title}</h1><p>${desc}</p><br><a href="${SITE}">← Back to Main Site</a></body></html>`
      fs.writeFileSync(path.join(OUT, table, `${slug}.html`), pageHtml)
      urls.push(`${SITE}/${table}/${slug}.html`)
    })
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${u}</loc></url>`).join('')}</urlset>`
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap)
}
run()
