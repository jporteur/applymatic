# Applymatic — Landing Page

A Next.js landing page with live Supabase waitlist count and email capture. Deploy to Vercel in ~10 minutes.

---

## Stack

- **Next.js 14** (App Router)
- **Supabase** — Postgres database for waitlist emails + live count
- **Vercel** — hosting (free tier)
- **DM Sans + DM Mono** — Google Fonts

---

## Setup

### 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In the SQL editor, run this to create the waitlist table:

```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamptz default now()
);

alter table waitlist enable row level security;

create policy "Allow inserts" on waitlist
  for insert with check (true);

create policy "Allow count" on waitlist
  for select using (true);
```

> If you already created the table without the select policy, just run the last two lines.

3. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon / public key** (long string starting with `eyJ...`)

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and replace the placeholders:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install Node.js (if not already installed)

Download from [nodejs.org](https://nodejs.org) — click the **LTS** button.
Run the installer, then restart VS Code.

Confirm it worked:
```bash
npm -v
```

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see Applymatic!

---

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add your environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

Your live URL will be something like `applymatic.vercel.app`.

---

## How the live waitlist count works

`app/page.tsx` is a Next.js server component. It queries Supabase directly on
the server at request time and passes the real count to the page — no client-side
fetch, no hardcoded number. Every page load shows the current count.

---

## Customise

| What | Where |
|------|-------|
| Accent color | `app/globals.css` → `--accent` |
| Tagline / copy | `app/page.tsx` |
| Pricing numbers | `app/page.tsx` → pricing section |
| Contact email | `app/page.tsx` → footer |

---

## View waitlist signups

In Supabase dashboard → **Table Editor → waitlist**.
You can export as CSV anytime.

---

## Next steps after launch

1. Share on r/cscareerquestions, r/ExperiencedDevs, r/cscareeradvice, LinkedIn, and layoff Slack communities
2. Goal: 200+ signups before writing any agent code
3. Email 20 of those signups and ask for a 15-min call
4. Build the scoring + digest loop next — see the project architecture doc
