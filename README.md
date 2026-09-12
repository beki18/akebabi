# Akebabi (አካባቢ) — Setup Guide

Local Business Discovery App for Addis Ababa.

This guide shows you how to:
1. Run the app locally on your computer
2. Push the code to GitHub
3. Deploy it free on Vercel (you get a public URL like `akebabi.vercel.app`)
4. Keep collaborating with me on future changes

---

## What's in this ZIP

```
akebabi/
├── src/
│   ├── app/
│   │   ├── layout.tsx        ← page wrapper (fonts, metadata)
│   │   ├── page.tsx          ← the whole app (5 screens, ~1100 lines)
│   │   └── globals.css       ← design system (terracotta + cream palette)
│   ├── components/
│   │   ├── ui/               ← shadcn/ui components (pre-installed)
│   │   └── mini-map.tsx      ← custom SVG map of Addis Ababa
│   ├── hooks/
│   │   └── use-toast.ts      ← toast notifications hook
│   └── lib/
│       └── businesses.ts      ← all 15 sample businesses + deals + map projection
├── public/
│   └── logo.svg               ← placeholder logo
├── prisma/
│   └── schema.prisma           ← database schema (not used yet)
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json             ← shadcn/ui config
├── eslint.config.mjs
├── .gitignore
├── vercel.json
└── README.md                   ← this file
```

---

## Part 1: Run locally (5 minutes)

You need **Node.js 18+** installed. Check at https://nodejs.org/

### Step 1 — Unzip the file

Unzip `akebabi-source.zip` somewhere on your computer. You'll get an `akebabi/` folder.

### Step 2 — Open a terminal in that folder

- **Windows**: Right-click in the folder → "Open in Terminal" or "Open PowerShell here"
- **Mac**: Open Terminal, type `cd ` (with a space), then drag the folder into the terminal and press Enter
- **Linux**: Right-click → "Open Terminal Here"

### Step 3 — Install dependencies

```bash
npm install
```

This downloads all the libraries the app needs. Takes 1–2 minutes the first time.

### Step 4 — Start the dev server

```bash
npm run dev
```

You should see something like:
```
▲ Next.js 16.1.3 (Turbopack)
- Local:        http://localhost:3000
✓ Ready in 657ms
```

### Step 5 — Open the app

Open your browser to **http://localhost:3000**

The app is now running on your computer. Edits to the code auto-reload the page.

To stop the server: press `Ctrl + C` in the terminal.

---

## Part 2: Push to GitHub (5 minutes)

GitHub is where your code lives online. It's free, and Vercel deploys from there.

### Step 1 — Create a GitHub account (if you don't have one)

Go to https://github.com/signup — free, takes 1 minute.

### Step 2 — Create a new repository

1. Go to https://github.com/new
2. **Repository name**: `akebabi`
3. **Description**: `Local Business Discovery App for Addis Ababa`
4. Set to **Public** (so Vercel can read it on the free plan) — or Private if you want
5. **Don't** check "Add a README" — we already have one
6. Click **"Create repository"**

GitHub will show you a page with setup commands. Copy the URL of your new repo — it looks like `https://github.com/your-username/akebabi.git`

### Step 3 — Initialize git locally

In your terminal, inside the `akebabi/` folder:

```bash
git init
git add .
git commit -m "Initial commit — Akebabi prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/akebabi.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

If it asks for credentials, GitHub will guide you through either:
- **HTTPS + Personal Access Token** (easier), or
- **SSH key** (more secure, one-time setup)

After `git push` finishes, refresh your GitHub repo page — you should see all the files there.

---

## Part 3: Deploy to Vercel (3 minutes)

Vercel is a free hosting platform built by the same team that makes Next.js. Every time you `git push` to GitHub, Vercel auto-deploys your changes in ~30 seconds.

### Step 1 — Sign up for Vercel

Go to https://vercel.com/signup — click **"Continue with GitHub"** to sign in with your GitHub account. Free, takes 30 seconds.

### Step 2 — Import your repository

1. On the Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repos. Find `akebabi` and click **"Import"**

### Step 3 — Configure (just click "Deploy")

Vercel auto-detects Next.js. You don't need to change anything:
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `next build` (auto-detected)
- **Output Directory**: (leave blank — Next.js handles this)

Just click **"Deploy"**.

### Step 4 — Wait for the build

Vercel will show a build log. Takes about 60–90 seconds. You'll see:
- "Installing dependencies..."
- "Running build..."
- "✓ Ready" with celebratory emojis

### Step 5 — Visit your live app

Vercel gives you a URL like:
```
https://akebabi-xxxxx-your-username.vercel.app
```

You can rename it later in **Project Settings → Domains** to something cleaner like `akebabi.vercel.app` (if available).

**This URL works on any phone, anywhere in the world.** Open it on your phone right now and try it.

---

## Part 4: The ongoing collaboration workflow

Now that you have a GitHub + Vercel setup, here's how we keep working together:

### When you want a new feature or fix

1. **Tell me what you want** in our chat. Examples:
   - "Add a 'claim this business' button on detail pages"
   - "Change the hero image to a coffee photo"
   - "Make the deals section sort by expiry date"
   - "Add a reviews tab on the home page"

2. **I give you the exact change** — file path + the new code. Example:
   ```
   File: src/app/page.tsx
   Find this line (around line 312):
     <h1 className="font-serif text-2xl">Find the best near you.</h1>
   
   Replace with:
     <h1 className="font-serif text-2xl">Discover Addis Ababa's best.</h1>
   ```

3. **You make the edit** — open the file in any editor (VS Code, Notepad, etc.), make the change, save.

4. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update hero headline"
   git push
   ```

5. **Vercel auto-deploys** in ~30 seconds. Refresh your live URL — the change is live.

6. **Take a screenshot** and send it to me so I can verify the change looks right.

### Tools I recommend you install

- **VS Code** (free code editor): https://code.visualstudio.com/
  - Plus the "ESLint" and "Prettier" extensions for auto-formatting
- **GitHub Desktop** (visual git client, easier than command line): https://desktop.github.com/

### Alternative: edit directly on GitHub

If you don't want to install anything:
1. Go to your repo on github.com
2. Click the file you want to edit
3. Click the ✏️ pencil icon in the top right
4. Make your edit
5. Click "Commit changes" at the bottom
6. Vercel auto-deploys

This is slower for big changes but works fine for small edits.

---

## Common questions

### **"Can I deploy this to Netlify instead of Vercel?"**

Yes — same process. Sign up at netlify.com, "Add new site" → "Import from GitHub", pick your repo. Netlify auto-detects Next.js. The free tier is comparable to Vercel.

### **"Can I use a custom domain like `akebabi.com`?"**

Yes. Buy the domain (~$10/year from Namecheap, Cloudflare, GoDaddy), then in Vercel: Project Settings → Domains → Add. Vercel walks you through DNS setup. Free SSL certificate included.

### **"What if my `npm install` fails?"**

Most common causes:
- You're on Node.js older than 18 → upgrade at nodejs.org
- Corporate firewall blocking npm → try `npm install --registry https://registry.npmmirror.com`
- On Windows, run terminal as Administrator

### **"What if Vercel build fails?"**

Vercel shows you the error log. Most common causes:
- TypeScript error → the error message says which file and line. Open it, fix it, push again.
- Missing environment variable → if the code needs any (it doesn't yet), add them in Project Settings → Environment Variables.

### **"How do I undo a change?"**

```bash
git log                       # see history of commits
git revert HEAD               # undo the last commit, creates a new "undo" commit
git push                      # push the undo to GitHub, Vercel redeploys
```

Or on GitHub: click the commit, "Revert" button in the top right.

### **"Where's the database?"**

Right now the app uses hardcoded sample data in `src/lib/businesses.ts` — no database needed. When you're ready to make it real (businesses can actually submit listings that persist), we'll add a free PostgreSQL database from **Neon** (https://neon.tech) or **Supabase** (https://supabase.com). Both have free tiers that handle thousands of businesses. I'll help you set this up when you're ready.

---

## File overview — where things live

| What | Where |
|------|-------|
| All 15 sample businesses, deals, trending data, map projection | `src/lib/businesses.ts` |
| The whole app UI (home, category, detail, register, favorites) | `src/app/page.tsx` |
| Custom SVG map of Addis Ababa | `src/components/mini-map.tsx` |
| Design system (colors, fonts) | `src/app/globals.css` |
| Page wrapper (fonts load here) | `src/app/layout.tsx` |
| Pre-built UI components (button, dialog, input, etc.) | `src/components/ui/` |

---

## Next steps after deployment

Once your live URL is working, the natural next moves are:

1. **Test on real phones** — open the URL on Android and iPhone. Does it feel good? Does the bottom nav work? Does dark mode toggle?
2. **Show 3 real Addis friends** — don't explain, just hand them the link. Watch where they tap and where they get confused.
3. **Show 1 real business owner** — point at "List your business" and ask "would you actually fill this out?"
4. **Tell me what to fix** — and I'll give you the exact code changes to push.

Good luck — let's make this real.
