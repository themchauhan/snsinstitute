# SNS Institute Rewari – Website

Fast, SEO-friendly, bilingual (English + हिंदी) website for SNS Institute, Rewari.

- **Next.js 16** (App Router). Every public page is pre-built as static HTML.
- **Keystatic** admin panel at `/keystatic`. Content is stored as files in GitHub, so there is no database and no third-party CMS.
- **Tailwind CSS 4**. All colours and fonts live in [`src/app/theme.css`](src/app/theme.css).

---

## For staff: how to update the website

1. Open **`https://www.snsinstitute.in/keystatic`**.
2. Click **Sign in with GitHub**. Use your GitHub username, password and the 6-digit code from your **authenticator app**.
3. Choose what to edit:

| Section | What it controls |
|---|---|
| Contact & Settings | Phone numbers, WhatsApp, address, timings, Google rating, social links |
| Home page | Top announcement bar, hero heading, highlight numbers, "Why choose SNS" |
| About page | About text and photo |
| Courses | Course pages: classes, duration, highlights, description, SEO title |
| Results / Toppers | Add each topper: name, exam, rank, photo. Tick "Show on home page" |
| Faculty | Teacher name, subject, qualification, photo |
| Testimonials | Real reviews from students and parents |
| Notices & Exam updates | Blog posts and notices. **Post 2–4 per month for SEO** |
| FAQs | Questions and answers. Link one to a course to show it on that course page |
| Nearby town pages | One page per town students come from |
| Gallery | Classroom and event photos |

4. Click **Save**. The live site updates automatically in about 1–2 minutes.

**Hindi fields are optional.** If a Hindi field is empty, the Hindi site shows the English text.

**Photos:** upload JPG/PNG/WebP. The site resizes and compresses them automatically.

**Mistakes:** every save is a version in GitHub, so the developer can undo any change.

### Adding or removing editors
GitHub repo → Settings → Collaborators → add the person's GitHub username (they need write access).
Turn on *Require two-factor authentication* in the GitHub organisation settings so every editor must use an authenticator app.

---

## For developers

```bash
npm install
npm run dev        # http://localhost:3000 – admin at /keystatic edits local files
npm run build      # production build
```

### Structure
```
content/                 ← all website content (edited via /keystatic)
keystatic.config.ts      ← admin panel fields
src/app/theme.css        ← colours & fonts (edit here)
src/app/[lang]/…         ← pages (lang = en | hi)
src/lib/i18n.ts          ← UI text in English & Hindi
src/lib/seo.ts           ← metadata, hreflang, JSON-LD schema
src/app/actions.ts       ← enquiry form (email via Gmail App Password / optional Google Sheet webhook)
```

URLs: English at `/…` and Hindi at `/hi/…`. `next.config.ts` rewrites English URLs to `/en/…` internally.

### Deploy (Vercel)
1. **Push to GitHub.** Create a **private** repo (e.g. `snsinstitute`) and push this folder.
2. **Create the admin login (GitHub App).** This is done once, locally:
   - Create `.env.local` with `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=your-username/snsinstitute`
   - Run `npm run dev`, open http://localhost:3000/keystatic and click **Create GitHub App**
   - Keystatic writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` into `.env`. **Never commit this file** (it is git-ignored).
   - Install the GitHub App on the repo when GitHub asks
3. **Import into Vercel.** Go to vercel.com → Add New → Project → pick the repo. The framework (Next.js) is detected automatically. `vercel.json` pins the server region to Mumbai (`bom1`).
4. **Add environment variables** in Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`
   - the four `KEYSTATIC_*` values from `.env`
   - `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `ENQUIRY_EMAIL_TO`

   Then **Redeploy**.
5. **Allow the live domain to log in.** GitHub → Settings → Developer settings → GitHub Apps → your app → add a Callback URL for each domain:
   - `https://www.snsinstitute.in/api/keystatic/github/oauth/callback`
   - `https://<project>.vercel.app/api/keystatic/github/oauth/callback`
6. **Connect the domain.** Vercel → Project → Settings → Domains → add the domain. Then in GoDaddy DNS add an A record `@` → `76.76.21.21` and a CNAME `www` → `cname.vercel-dns.com`.
7. **Submit to Google.** Add the site in Google Search Console and submit `/sitemap.xml`.

> Vercel's free Hobby plan is for non-commercial use only. Use **Pro** for the institute's site.

### SEO checklist after launch
- [ ] Google Business Profile: change the category to **Coaching center** (it currently shows "Teachers college"), set the website link to the new domain, and upload photos every week
- [ ] Ask happy students and parents for Google reviews
- [ ] List on Justdial (update the website link), Sulekha and TargetStudy
- [ ] Post exam updates regularly (NEET/JEE dates, HBSE/CBSE results, cut-offs)
- [ ] Replace placeholder initials with real faculty and topper photos
