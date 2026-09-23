# VedicPath — Local Setup Guide

## Prerequisites — Install These First

| Tool    | Min Version | Download                        |
|---------|-------------|----------------------------------|
| Node.js | 18+         | https://nodejs.org               |
| npm     | 9+          | Included with Node               |
| Git     | any         | https://git-scm.com (optional)   |

Verify with:
```
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x or higher
```

---

## Step 1 — Get the project

Either download/extract the ZIP or:
```bash
git clone <your-repo-url> vedicpath
cd vedicpath
```

Or just place the `vedicpath/` folder anywhere and:
```bash
cd vedicpath
```

---

## Step 2 — Install dependencies

```bash
npm install
```

This installs Next.js, Prisma, and @prisma/client (~120 MB, takes ~30 seconds).

---

## Step 3 — Set up the database

The app uses **SQLite** locally — no database server to install.
A single file `prisma/dev.db` is created automatically.

```bash
# Create the database schema
npm run db:push

# Seed all content (deities, shlokas, vedas, ashtotharas, stories)
npm run db:seed
```

Expected output from seed:
```
🌱 Seeding VedicPath database…
  ✓ 8 deities
  ✓ 6 shlokas
  ✓ 12 veda sections
  ✓ 21 sukta verses (sa, en, ta)
  ✓ 2 ashtotharas seeded
  ✓ 3 stories

✅ Database seeded successfully!
```

---

## Step 4 — Run the app

```bash
npm run dev
```

Open: **http://localhost:3000**

---

## All npm scripts

| Command           | What it does                            |
|-------------------|-----------------------------------------|
| `npm run dev`     | Start dev server at localhost:3000      |
| `npm run build`   | Build for production                    |
| `npm run start`   | Run production build                    |
| `npm run db:push` | Apply schema changes to SQLite          |
| `npm run db:seed` | Seed all content data                   |
| `npm run db:reset`| Wipe DB and re-seed from scratch        |
| `npm run db:studio`| Open Prisma Studio (visual DB browser) |

---

## Exploring the database visually

```bash
npm run db:studio
```

Opens **http://localhost:5555** — a visual browser to view/edit every table.

---

## Pages to test

| Page                            | URL                               |
|---------------------------------|-----------------------------------|
| Home                            | http://localhost:3000             |
| All Deities                     | http://localhost:3000/deities     |
| Shiva profile                   | http://localhost:3000/deities/shiva |
| All Shlokas                     | http://localhost:3000/shlokas     |
| Maha Mrityunjaya reader         | http://localhost:3000/shlokas/maha-mrityunjaya |
| Ashtotharas home                | http://localhost:3000/ashtotharas |
| Shiva 108 names                 | http://localhost:3000/ashtotharas/shiva |
| Vedas (with collapsible sidebar)| http://localhost:3000/vedas       |
| For Kids                        | http://localhost:3000/kids        |
| Admin panel                     | http://localhost:3000/admin       |

---

## Testing the Vedas page

1. Go to http://localhost:3000/vedas
2. Click **Purusha Sukta** in the sidebar → you'll see Sanskrit, English, Tamil tabs
3. Click each language tab → verses load from DB via API
4. Click the **‹** button to collapse the sidebar to icons
5. Hover over icons when collapsed → tooltip appears

---

## Testing the Admin: adding a new language

1. Go to http://localhost:3000/admin → **Sukta Content**
2. Select **Purusha Sukta**, Language: **Hindi (hi)**
3. Verse Number: **1**, paste a Hindi translation, click **Save Verse**
4. Go back to http://localhost:3000/vedas → Purusha Sukta
5. A **Hindi** tab now appears automatically — no code change needed

---

## Adding content via Admin

### Add a new Shloka
1. Admin → **Add Shloka**
2. Fill title, category, Sanskrit text, select deity
3. Click Save → appears immediately on /shlokas

### Add a new Deity
1. Admin → **Add Deity**
2. Fill name, epithet, symbol, color, description
3. Click Add → appears on /deities immediately

---

## Switching to PostgreSQL (for production)

1. Edit `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/vedicpath"
   ```
2. Edit `prisma/schema.prisma`, change:
   ```
   provider = "sqlite"
   ```
   to:
   ```
   provider = "postgresql"
   ```
3. Run:
   ```bash
   npm run db:push
   npm run db:seed
   ```

Everything else stays the same — Prisma abstracts the DB completely.

---

## Project structure

```
vedicpath/
├── app/                        # Next.js App Router pages
│   ├── page.js                 # Home page (server component)
│   ├── layout.js               # Root layout + fonts
│   ├── globals.css             # All styles
│   ├── deities/                # /deities and /deities/[slug]
│   ├── shlokas/                # /shlokas and /shlokas/[slug]
│   ├── ashtotharas/            # /ashtotharas and /ashtotharas/[slug]
│   ├── vedas/                  # /vedas — collapsible sidebar + API-fetched verses
│   ├── kids/                   # /kids — stories
│   ├── admin/                  # /admin — full CRUD panel
│   └── api/                    # REST API routes
│       ├── deities/            # GET, POST /api/deities
│       ├── shlokas/            # GET, POST /api/shlokas
│       ├── vedas/              # GET /api/vedas/[slug] + content
│       ├── ashtotharas/        # GET /api/ashtotharas/[slug]
│       └── stories/            # GET, POST /api/stories
├── components/                 # Shared: Navbar, Footer, OmIcon
├── lib/
│   └── db.js                   # Prisma client singleton
├── prisma/
│   ├── schema.prisma           # DB schema (SQLite → PostgreSQL ready)
│   └── seed.js                 # All seed data
├── .env                        # DATABASE_URL config
├── next.config.js
└── package.json
```

---

## API reference

| Method | Endpoint                                | Description                    |
|--------|-----------------------------------------|--------------------------------|
| GET    | /api/deities                            | List all deities               |
| POST   | /api/deities                            | Create deity                   |
| GET    | /api/deities/:slug                      | Deity + shlokas + ashtothara   |
| GET    | /api/shlokas                            | List (filter: category, deity) |
| POST   | /api/shlokas                            | Create shloka                  |
| GET    | /api/shlokas/:slug                      | Single shloka                  |
| PATCH  | /api/shlokas/:slug                      | Update shloka                  |
| DELETE | /api/shlokas/:slug                      | Soft-delete shloka             |
| GET    | /api/vedas                              | All veda sections              |
| GET    | /api/vedas/:slug                        | Section + available languages  |
| GET    | /api/vedas/:slug/content?lang=sa        | Verses in language             |
| POST   | /api/vedas/:slug/content                | Upsert a verse                 |
| GET    | /api/ashtotharas/:slug                  | 108 names for a deity          |
| GET    | /api/stories                            | List stories                   |
| POST   | /api/stories                            | Create story                   |
