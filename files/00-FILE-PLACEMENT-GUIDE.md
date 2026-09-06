# File placement guide

Each file below was renamed for download (folders encoded with `__`
since GitHub — and this chat — can't have 18 files all named `page.tsx`
in one flat list). Before pushing, recreate the folder structure on
your machine (or directly in the GitHub web UI, which lets you type a
path like `app/jobs/page.tsx` into the "commit new file" filename box —
that's the easiest way to place these correctly one by one).

**Downloaded name → real path in the project**

```
app__about__page.tsx  -->  app/about/page.tsx
app__admin__(protected)__[section]__[id]__page.tsx  -->  app/admin/(protected)/[section]/[id]/page.tsx
app__admin__(protected)__[section]__new__page.tsx  -->  app/admin/(protected)/[section]/new/page.tsx
app__admin__(protected)__[section]__page.tsx  -->  app/admin/(protected)/[section]/page.tsx
app__admin__(protected)__layout.tsx  -->  app/admin/(protected)/layout.tsx
app__admin__(protected)__page.tsx  -->  app/admin/(protected)/page.tsx
app__admin__actions.ts  -->  app/admin/actions.ts
app__admin__login__page.tsx  -->  app/admin/login/page.tsx
app__blogs__[slug]__page.tsx  -->  app/blogs/[slug]/page.tsx
app__blogs__page.tsx  -->  app/blogs/page.tsx
app__contact__page.tsx  -->  app/contact/page.tsx
app__exams__[slug]__page.tsx  -->  app/exams/[slug]/page.tsx
app__exams__page.tsx  -->  app/exams/page.tsx
app__feed__route.ts  -->  app/feed/route.ts
app__globals.css  -->  app/globals.css
app__jobs__[slug]__page.tsx  -->  app/jobs/[slug]/page.tsx
app__jobs__page.tsx  -->  app/jobs/page.tsx
app__layout.tsx  -->  app/layout.tsx
app__market__[slug]__page.tsx  -->  app/market/[slug]/page.tsx
app__market__page.tsx  -->  app/market/page.tsx
app__not-found.tsx  -->  app/not-found.tsx
app__page.tsx  -->  app/page.tsx
app__privacy-policy__page.tsx  -->  app/privacy-policy/page.tsx
app__robots.ts  -->  app/robots.ts
app__rss.xml__route.ts  -->  app/rss.xml/route.ts
app__sitemap.ts  -->  app/sitemap.ts
app__students__[slug]__page.tsx  -->  app/students/[slug]/page.tsx
app__students__page.tsx  -->  app/students/page.tsx
app__terms__page.tsx  -->  app/terms/page.tsx
app__workshop__[slug]__page.tsx  -->  app/workshop/[slug]/page.tsx
app__workshop__page.tsx  -->  app/workshop/page.tsx
components__JsonLd.tsx  -->  components/JsonLd.tsx
components__SectionDetail.tsx  -->  components/SectionDetail.tsx
components__SectionHub.tsx  -->  components/SectionHub.tsx
components__SiteFooter.tsx  -->  components/SiteFooter.tsx
components__SiteHeader.tsx  -->  components/SiteHeader.tsx
components__admin__DeleteButton.tsx  -->  components/admin/DeleteButton.tsx
components__admin__DuplicateButton.tsx  -->  components/admin/DuplicateButton.tsx
components__admin__ImageUploadField.tsx  -->  components/admin/ImageUploadField.tsx
components__admin__RecordForm.tsx  -->  components/admin/RecordForm.tsx
components__admin__RichTextEditor.tsx  -->  components/admin/RichTextEditor.tsx
lib__adminFields.ts  -->  lib/adminFields.ts
lib__sections.ts  -->  lib/sections.ts
lib__seo.ts  -->  lib/seo.ts
lib__supabase-browser.ts  -->  lib/supabase-browser.ts
lib__supabase-session.ts  -->  lib/supabase-session.ts
lib__supabase.ts  -->  lib/supabase.ts
next-env.d.ts  -->  next-env.d.ts
next.config.mjs  -->  next.config.mjs
package-lock.json  -->  package-lock.json
package.json  -->  package.json
postcss.config.mjs  -->  postcss.config.mjs
proxy.ts  -->  proxy.ts
tailwind.config.ts  -->  tailwind.config.ts
tsconfig.json  -->  tsconfig.json
```

**Two files NOT in this list** (still needed — you already have them
from earlier uploads and they don't change):
- `logo.png` — goes in the project root, `/public/logo.png`
- `founder.jpg` — goes in the project root, `/public/founder.jpg`

## Why this is much harder than the old 2-file site

The old site was `index.html` + `admin.html` — two flat files, drag
them into GitHub, done. This is a real Next.js app: **the folder path
IS the route.** `app/jobs/page.tsx` becomes the `/jobs` page.
`app/jobs/[slug]/page.tsx` becomes `/jobs/some-slug`. If any file lands
in the wrong folder, that route breaks or disappears.

GitHub's web UI *does* support this, two ways:
1. **Type the full path in the filename box.** When you use "Add
   file → Create new file" (not Upload), the filename field accepts
   `app/jobs/page.tsx` directly — GitHub creates the folders for you.
   You'd paste each file's content in rather than uploading, but it
   guarantees correct placement.
2. **Drag a real folder** from Finder/Explorer into "Add file → Upload
   files" — GitHub preserves subfolder structure when you drag an
   actual folder, just not when you drag flat files with encoded
   names. This is what the `tdi-next-phase5.tar.gz` I sent earlier is
   for: extract it, then drag the resulting `tdi-next-phase5` folder
   in as-is.
