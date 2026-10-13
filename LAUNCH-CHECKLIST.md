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

## Phase 2 – ~~Admin login (Keystatic)~~ – removed

- [x] Not needed: Keystatic was removed on 2026-10-13. Content is updated by editing `content/` and pushing.
- [ ] (Cleanup) Delete the unused Keystatic GitHub App: GitHub → Settings → Developer settings → GitHub Apps → your app → Advanced → **Delete**
- [ ] (Cleanup) Delete the local `.env` file (it only holds the old Keystatic secrets)

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
  - [ ] `GMAIL_USER` = the sending Gmail address
  - [ ] `GMAIL_APP_PASSWORD` = the 16-character App Password
  - [ ] `ENQUIRY_EMAIL_TO` = who receives enquiries (comma-separate for several people)
- [ ] **Deployments → Redeploy**
- [ ] Open `https://YOUR-PROJECT.vercel.app`. The site loads.

---

## Phase 5 – ~~Allow login on the live site~~ – not needed (no admin panel)

---

## Phase 6 – Connect the GoDaddy domain

- [ ] Vercel → Project → **Settings → Domains** → add `YOURDOMAIN.in` and `www.YOURDOMAIN.in`
- [ ] GoDaddy → **My Products → Domain → DNS** → add:
  - [ ] **A** record: `@` → `76.76.21.21`
  - [ ] **CNAME** record: `www` → `cname.vercel-dns.com`
- [ ] Wait for Vercel to show ✅ Valid (from minutes up to a few hours)
- [ ] Open `https://www.YOURDOMAIN.in` and confirm the padlock (SSL) shows

---

## Phase 7 – Security & ownership

- [ ] Turn on **2FA with an authenticator app** on your GitHub account (Settings → Password and authentication)
- [ ] Turn on 2FA on your **Vercel** account (Account Settings → Authentication)
- [ ] Keep the repo **private**. Only you (the agency) can change content, as part of the maintenance plan.
- [ ] Decide who owns the **domain** (GoDaddy) and **Vercel** billing – yours or the client's – and write it in the contract

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

## Phase 10 – Content to add (ongoing – paste a block in the right `content/*.yaml` file, push)

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
