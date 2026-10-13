# SNS Institute Rewari – Website

Fast, SEO-friendly, bilingual (English + हिंदी) website for SNS Institute, Rewari.

- **Next.js 16** (App Router). Every public page is pre-built as static HTML.
- **Content in plain files** in [`content/`](content) (YAML + Markdown). No database and no CMS: edit a file, push, and Vercel redeploys.
- **Tailwind CSS 4**. All colours and fonts live in [`src/app/theme.css`](src/app/theme.css).

---

## Updating content

Open the file, add or change text, save, then commit and push. Vercel puts it live in about 1–2 minutes.
**Each list file has a ready-to-copy example at the top.**

| What | File | How |
|---|---|---|
| Add a **topper** | `content/results.yaml` | paste a block at the top of its year |
| Post an **exam update / notice** | `content/posts.yaml` | paste a block at the top (address is made from the title) |
| Add / hide a **batch** | `content/batches.yaml` | paste a block · `active: false` hides it |
| Add a **teacher** | `content/faculty.yaml` | paste a block · `active: false` hides |
| Add an **FAQ** | `content/faqs.yaml` | paste a block · `course:` puts it on a course page |
| Add **photos** | `content/gallery.yaml` | put the photo in `public/images/gallery/`, paste 2 lines |
| Add a **testimonial** | `content/testimonials.yaml` | paste a block |
| Add a **nearby town** page | `content/locations.yaml` | paste a block |
| Phones, WhatsApp, address, timings | `content/settings.yaml` | edit the text |
| Home page text, stats, exam chips | `content/home.yaml` | edit the text |
| About page | `content/about.yaml` | edit the text |
| A course page | `content/courses/<course>.yaml` | edit the text (file name = page address) |

**Good to know**
- **Order in the file = order on the site.** Move a block up to show it first.
- Fields ending in `Hi` are the Hindi version. They're optional: if one is empty, the Hindi page shows English.
- In `bodyEn: |` blocks, keep every line indented the same as the first line. That's the one formatting rule to watch.
- **Mistakes can't break the live site.** If a file has a typo, Vercel's build fails, the previous version stays online, and Vercel emails you the error.

## For developers

```bash
npm install
npm run dev        # http://localhost:3000 (this machine uses 3010 – see .claude/launch.json)
npm run build      # production build
```

### Structure
```
content/                 ← all website content (YAML + Markdown)
src/lib/content.ts       ← reads /content and defines the content types
src/app/theme.css        ← colours & fonts (edit here)
src/app/[lang]/…         ← pages (lang = en | hi)
src/lib/i18n.ts          ← UI text in English & Hindi
src/lib/seo.ts           ← metadata, hreflang, JSON-LD schema
src/app/actions.ts       ← enquiry form (email via Gmail App Password / optional Google Sheet webhook)
```

URLs: English at `/…` and Hindi at `/hi/…`. `next.config.ts` rewrites English URLs to `/en/…` internally.

### Deploy (Vercel)
1. **Push to GitHub.** Create a **private** repo (e.g. `snsinstitute`) and push this folder.
2. **Import into Vercel.** Go to vercel.com → Add New → Project → pick the repo. The framework (Next.js) is detected automatically. `vercel.json` pins the server region to Mumbai (`bom1`).
3. **Add environment variables** in Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`
   - `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `ENQUIRY_EMAIL_TO`

   Then **Redeploy**.
4. **Connect the domain.** Vercel → Project → Settings → Domains → add the domain. Then in GoDaddy DNS add an A record `@` → `76.76.21.21` and a CNAME `www` → `cname.vercel-dns.com`.
5. **Submit to Google.** Add the site in Google Search Console and submit `/sitemap.xml`.

> Vercel's free Hobby plan is for non-commercial use only. Use **Pro** for the institute's site.

### SEO checklist after launch
- [ ] Google Business Profile: change the category to **Coaching center** (it currently shows "Teachers college"), set the website link to the new domain, and upload photos every week
- [ ] Ask happy students and parents for Google reviews
- [ ] List on Justdial (update the website link), Sulekha and TargetStudy
- [ ] Post exam updates regularly (NEET/JEE dates, HBSE/CBSE results, cut-offs)
- [ ] Replace placeholder initials with real faculty and topper photos
