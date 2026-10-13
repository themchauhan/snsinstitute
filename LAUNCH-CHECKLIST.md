# SNS Institute – Launch Checklist

Tick each box (`[ ]` → `[x]`) as you go. Steps are in order. Each phase depends on the one before it.

---

## Phase 0 – Decisions & accounts (before you start)

- [ ] **Brand name:** "SNS Institute" or "SNS Gurukripa Career Institute"? (Logo, titles and SEO depend on this)
- [ ] **WhatsApp number:** confirm it is **9817412003** (or switch to 9466552003)
- [ ] **Student photos:** confirm the institute is OK to show award photos and topper names
- [ ] **Amit Bawalia:** confirm his role, then turn him on/off in admin (currently hidden)
- [ ] Buy the domain on GoDaddy (e.g. `snsinstitute.in`) – domain: `________________`
- [x] GitHub account ready – username: `themchauhan`
- [ ] Vercel account (sign up with GitHub) – plan: **Pro** (Hobby is non-commercial only)
- [ ] Gmail account for enquiry emails (ideally the institute's own) – `________________`

---

## Phase 1 – Push code to GitHub

- [x] github.com → **New repository** → name `snsinstitute` → **Private** → no README → Create
- [x] In the project folder, run:
  ```bash
  git add -A && git commit -m "SNS Institute website"
  git remote add origin https://github.com/YOUR-USERNAME/snsinstitute.git
  git push -u origin main
  ```
- [x] Refresh the repo page on GitHub. You should see the files.

---

## Phase 2 – Create the admin login (one time, on your computer)

- [x] Create a file `.env.local` in the project folder containing:
  ```
  NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=themchauhan/snsinstitute
  ```
- [x] Dev server running on **port 3010** (port 3000 is used by the cafecorp project)
- [x] In Chrome open **http://127.0.0.1:3010/keystatic** → **Log in with GitHub** → setup page → **Create GitHub App**
- [x] On GitHub, approve the app, then **Install** it on the `snsinstitute` repo
- [x] Check that the project folder now has a `.env` file with these 4 values (**never share or commit it**):
  - [x] `KEYSTATIC_GITHUB_CLIENT_ID`
  - [x] `KEYSTATIC_GITHUB_CLIENT_SECRET`
  - [x] `KEYSTATIC_SECRET`
  - [x] `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
- [x] Test it: reload localhost:3000/keystatic → **Sign in with GitHub** → you can see the content

---

## Phase 3 – Enquiry emails (Gmail App Password)

- [ ] Sign in to the Gmail account that will send the emails (ideally the institute's own Gmail)
- [ ] Turn on **2-Step Verification**: myaccount.google.com → Security → 2-Step Verification
- [ ] Create an **App Password**: myaccount.google.com/apppasswords → name it `SNS Website` → Create
- [ ] Copy the **16-character password** and keep it safe (it is shown only once – **don't share it in chat**)
- [ ] (Optional, local test) add to `.env.local`:
  ```
  GMAIL_USER=yourinstitute@gmail.com
  GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
  ENQUIRY_EMAIL_TO=yourinstitute@gmail.com
  ```
  → tell Claude "test the form" (the server needs a restart to pick it up)

## Phase 4 – Deploy on Vercel

- [ ] vercel.com → **Add New → Project** → Import `snsinstitute`
- [ ] **Settings → Environment Variables** – add:
  - [ ] `NEXT_PUBLIC_SITE_URL` = `https://www.YOURDOMAIN.in`
  - [ ] `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` = `YOUR-USERNAME/snsinstitute`
  - [ ] `KEYSTATIC_GITHUB_CLIENT_ID` (from `.env`)
  - [ ] `KEYSTATIC_GITHUB_CLIENT_SECRET` (from `.env`)
  - [ ] `KEYSTATIC_SECRET` (from `.env`)
  - [ ] `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (from `.env`)
  - [ ] `GMAIL_USER` = the sending Gmail address
  - [ ] `GMAIL_APP_PASSWORD` = the 16-character App Password
  - [ ] `ENQUIRY_EMAIL_TO` = who receives enquiries (comma-separate for several people)
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

## Phase 6.5 – Decide who OWNS the repo (do this before giving client access)

- [ ] **Option A (simple):** keep repo in `themchauhan`, add client as a Collaborator (Write)
- [ ] **Option B (recommended for handover):** create a GitHub **Organization** (e.g. `sns-institute`) →
  - [ ] Transfer repo: repo → Settings → Danger zone → **Transfer** → the organization
  - [ ] Transfer the Keystatic GitHub App: GitHub → Settings → Developer settings → GitHub Apps → your app → Advanced → **Transfer ownership** → the organization
        _(the app is private, so it can only be installed where its owner is)_
  - [ ] Re-install the app on the repo in the org; update `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=sns-institute/snsinstitute` in Vercel → Redeploy
  - [ ] Organization → Settings → Authentication security → **Require 2FA**
  - [ ] Make the client an **Owner** of the org, and keep yourself as Owner too

## Phase 7 – Security & editors

- [ ] Turn on **2FA with an authenticator app** on your own GitHub account
      (GitHub → Settings → Password and authentication → Enable 2FA)
- [ ] (Recommended) Move the repo into a GitHub **Organization** and turn on **Require 2FA**
- [ ] Add each staff editor: repo → **Settings → Collaborators → Add people** (Write access)
  - [ ] Editor 1: `________________`
  - [ ] Editor 2: `________________`
- [ ] Make sure each editor has turned on 2FA
- [ ] Each editor opens `https://www.YOURDOMAIN.in/keystatic` → **Log in with GitHub** → **Authorize** (first time only)
- [ ] Send the client the "For staff" section of README.md (how to edit, save and undo)

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
