# SNS Institute – Launch Checklist

Tick each box (`[ ]` → `[x]`) as you go. Steps are in order. Each phase depends on the one before it.

---

## Phase 0 – Decisions & accounts (before you start)

- [ ] **Brand name:** "SNS Institute" or "SNS Gurukripa Career Institute"? (Logo, titles and SEO depend on this)
- [ ] **WhatsApp number:** confirm it is **9817412003** (or switch to 9466552003)
- [ ] **Student photos:** confirm the institute is OK to show award photos and topper names
- [ ] **Amit Bawalia:** confirm his role, then turn him on/off in admin (currently hidden)
- [ ] Buy the domain on GoDaddy (e.g. `snsinstitute.in`) – domain: `________________`
- [ ] GitHub account ready – username: `________________`
- [ ] Vercel account (sign up with GitHub) – plan: **Pro** (Hobby is non-commercial only)
- [ ] Resend account (free) for enquiry emails – enquiries go to: `________________`

---

## Phase 1 – Push code to GitHub

- [ ] github.com → **New repository** → name `snsinstitute` → **Private** → no README → Create
- [ ] In the project folder, run:
  ```bash
  git add -A && git commit -m "SNS Institute website"
  git remote add origin https://github.com/YOUR-USERNAME/snsinstitute.git
  git push -u origin main
  ```
- [ ] Refresh the repo page on GitHub. You should see the files.

---

## Phase 2 – Create the admin login (one time, on your computer)

- [ ] Create a file `.env.local` in the project folder containing:
  ```
  NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=YOUR-USERNAME/snsinstitute
  ```
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000/keystatic → click **Create GitHub App**
- [ ] On GitHub, approve the app, then **Install** it on the `snsinstitute` repo
- [ ] Check that the project folder now has a `.env` file with these 4 values (**never share or commit it**):
  - [ ] `KEYSTATIC_GITHUB_CLIENT_ID`
  - [ ] `KEYSTATIC_GITHUB_CLIENT_SECRET`
  - [ ] `KEYSTATIC_SECRET`
  - [ ] `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
- [ ] Test it: reload localhost:3000/keystatic → **Sign in with GitHub** → you can see the content

---

## Phase 3 – Enquiry emails (Resend)

- [ ] resend.com → sign up → **API Keys** → Create → copy the key
- [ ] (Later, after the domain is live) Resend → **Domains** → add your domain → add the DNS records in GoDaddy
      _Until then, emails come from `onboarding@resend.dev`, which works for testing_

---

## Phase 4 – Deploy on Vercel

- [ ] vercel.com → **Add New → Project** → Import `snsinstitute`
- [ ] **Settings → Environment Variables** – add:
  - [ ] `NEXT_PUBLIC_SITE_URL` = `https://www.YOURDOMAIN.in`
  - [ ] `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` = `YOUR-USERNAME/snsinstitute`
  - [ ] `KEYSTATIC_GITHUB_CLIENT_ID` (from `.env`)
  - [ ] `KEYSTATIC_GITHUB_CLIENT_SECRET` (from `.env`)
  - [ ] `KEYSTATIC_SECRET` (from `.env`)
  - [ ] `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (from `.env`)
  - [ ] `RESEND_API_KEY`
  - [ ] `ENQUIRY_EMAIL_TO` = the email that should receive enquiries
  - [ ] `ENQUIRY_EMAIL_FROM` = `SNS Website <onboarding@resend.dev>` (change after Resend domain is verified)
- [ ] **Deployments → Redeploy**
- [ ] Open `https://YOUR-PROJECT.vercel.app`. The site loads.

---

## Phase 5 – Allow login on the live site

- [ ] GitHub → **Settings → Developer settings → GitHub Apps** → your Keystatic app → **Callback URL** → add:
  - [ ] `https://YOUR-PROJECT.vercel.app/api/keystatic/github/oauth/callback`
  - [ ] `https://www.YOURDOMAIN.in/api/keystatic/github/oauth/callback`
- [ ] Test: open `https://YOUR-PROJECT.vercel.app/keystatic` → sign in → edit something small → Save
- [ ] Wait 1–2 minutes and check that the change is live

---

## Phase 6 – Connect the GoDaddy domain

- [ ] Vercel → Project → **Settings → Domains** → add `YOURDOMAIN.in` and `www.YOURDOMAIN.in`
- [ ] GoDaddy → **My Products → Domain → DNS** → add:
  - [ ] **A** record: `@` → `76.76.21.21`
  - [ ] **CNAME** record: `www` → `cname.vercel-dns.com`
- [ ] Wait for Vercel to show ✅ Valid (from minutes up to a few hours)
- [ ] Open `https://www.YOURDOMAIN.in` and confirm the padlock (SSL) shows

---

## Phase 7 – Security & editors

- [ ] Turn on **2FA with an authenticator app** on your own GitHub account
      (GitHub → Settings → Password and authentication → Enable 2FA)
- [ ] (Recommended) Move the repo into a GitHub **Organization** and turn on **Require 2FA**
- [ ] Add each staff editor: repo → **Settings → Collaborators → Add people** (Write access)
  - [ ] Editor 1: `________________`
  - [ ] Editor 2: `________________`
- [ ] Make sure each editor has turned on 2FA

---

## Phase 8 – Final checks on the live site

- [ ] Submit the enquiry form → the email arrives in the inbox
- [ ] The WhatsApp button opens a chat with the correct number
- [ ] Call buttons work on a phone
- [ ] Hindi toggle (अ/A) works on a few pages
- [ ] Test on a real phone (Android + iPhone if possible)
- [ ] Run PageSpeed Insights (pagespeed.web.dev) and check the score is 90+

---

## Phase 9 – Google & SEO (week 1)

- [ ] **Google Search Console** → add the domain → verify → submit `https://www.YOURDOMAIN.in/sitemap.xml`
- [ ] **Google Business Profile:**
  - [ ] Change category: "Teachers college" → **Coaching center**
  - [ ] Website link: Google Form → **new domain**
  - [ ] Update phone numbers to 9817412003 / 9466552003
  - [ ] Upload 10+ recent photos
- [ ] **Justdial:** add the website link and update the phone numbers
- [ ] **Instagram / Facebook bio:** add the website link
- [ ] List on **Sulekha** and **TargetStudy** (free)

---

## Phase 10 – Content to add (ongoing, via /keystatic)

- [ ] Real **faculty photos** (replace the initials)
- [ ] **2024–2026 results** with photos and categories (JEE / NEET / Board / Sainik…)
- [ ] **Batch dates & fees** for upcoming batches
- [ ] Real **testimonials** from students and parents
- [ ] Verify the **teacher bios**, "Teaches" lists and experience
- [ ] Hindi text for course descriptions where it's still empty
- [ ] Post **2–4 exam updates per month** (NEET/JEE dates, HBSE/CBSE results, Sainik/Navodaya forms)
- [ ] Ask happy parents for **Google reviews** every month

---

### Notes / questions while setting up
-
-
