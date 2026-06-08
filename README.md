# Uzair Asim — Personal Portfolio

A full-stack personal portfolio built with Next.js 16, MongoDB, and AI-powered chat. Every section is editable from a protected admin panel — no code changes needed to update content.

🌐 **Live:** [portfoliobyuzair.vercel.app](https://portfoliobyuzair.vercel.app)

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Database | MongoDB Atlas + Mongoose |
| Auth | Auth.js v5 (GitHub OAuth) |
| AI Chat | Google Gemini API (@google/genai) |
| Rate Limiting | Upstash Redis (KV) |
| 3D Scene | Spline |
| Animations | Framer Motion |
| Drag & Drop | @dnd-kit |
| Deployment | Vercel |
| Analytics | Vercel Analytics + Speed Insights |

---

## Features

- 🎨 Animated hero section with interactive 3D Spline scene (hover to interact — desktop only)
- 🔧 Full admin panel — edit every section without touching code
- 🔐 Protected admin with GitHub OAuth — only you can access it
- 🤖 AI chat widget powered by Google Gemini — answers questions about you naturally
- ⚡ Rate limiting with Upstash Redis — prevents API abuse
- 🏆 Key Achievements section — conditionally rendered when content exists
- 📜 Certifications section — conditionally rendered when content exists
- 🔗 Dynamic navbar — achievement and certification links appear only when sections have content
- 📊 Vercel Analytics + Speed Insights
- 📱 Fully responsive — 3D scene disabled on mobile for performance

---

## Project Structure

```
app/
├── admin/
│   ├── hero/           — Name, title, stats, availability, chat widget toggle
│   ├── skills/         — Skill categories with drag-and-drop reordering
│   ├── experience/     — Work history with auto-sort by end date, period picker
│   ├── projects/       — Projects with emoji picker and featured sorting
│   ├── achievements/   — Achievements and certifications (two-tab editor)
│   └── contact/        — Email, phone, LinkedIn, GitHub, website, location
├── api/
│   ├── auth/           — Auth.js v5 handlers
│   ├── content/        — Portfolio GET + PATCH API with ISR revalidation
│   └── chat/           — Gemini AI chat with Upstash rate limiting
└── page.tsx            — Main portfolio page (async server component)

components/
├── sections/
│   ├── Hero.tsx            — Spline 3D scene, stats, CTA buttons
│   ├── Skills.tsx          — Skill category cards with gradient backgrounds
│   ├── Experience.tsx      — Timeline with current role pulse indicator
│   ├── Projects.tsx        — 3D tilt cards with spring physics
│   ├── Achievements.tsx    — Key achievements grid (hidden when empty)
│   ├── Certifications.tsx  — Certifications with verify links (hidden when empty)
│   └── Contact.tsx         — Contact cards, orphan handling, CTA, footer
├── chat/
│   ├── ChatWidget.tsx          — Floating chat UI with markdown rendering
│   └── ChatWidgetWrapper.tsx   — Server wrapper reads chatEnabled from DB
├── Navbar.tsx              — Fixed navbar, scroll-aware, conditional section links
└── ui/
    ├── Button.tsx
    ├── Badge.tsx
    ├── Toggle.tsx          — Reusable toggle component used across admin editors
    └── EmojiPicker.tsx     — Curated professional emoji grid (~120 emojis)

lib/
├── auth.ts         — Auth.js v5 config (GitHub OAuth, username whitelist)
├── mongodb.ts      — Cached Mongoose connection (prevents hot-reload exhaustion)
├── data.ts         — getPortfolioData() with 1-hour ISR cache
├── redis.ts        — Upstash Redis.fromEnv() with graceful null fallback
└── seed.ts         — One-time database seeder with dotenv support

models/
└── Portfolio.ts    — Full Mongoose schema + TypeScript interfaces for all sections

proxy.ts            — Next.js 16 middleware convention (protects /admin/*)
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- MongoDB Atlas account (free tier works)
- GitHub account (for OAuth)
- Google AI Studio account — [aistudio.google.com](https://aistudio.google.com) (free tier, no card required)
- Upstash account — optional, free tier for rate limiting

### Environment Variables

Create `.env.local` in the project root:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uzair-portfolio

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-string
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
ADMIN_GITHUB_USERNAME=your-github-username

# AI Chat
GEMINI_API_KEY=your-gemini-api-key

# Rate Limiting (optional — chat works without this, skipped gracefully)
KV_REST_API_URL=https://your-db.upstash.io
KV_REST_API_TOKEN=your-upstash-token

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Seed the database with initial data
npx tsx lib/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the portfolio.

### Admin Panel

Visit [http://localhost:3000/admin](http://localhost:3000/admin) and sign in with your GitHub account. Your GitHub username must match `ADMIN_GITHUB_USERNAME` in `.env.local`.

---

## How It Works

### Content Management

All portfolio content lives in MongoDB. The admin panel sends `PATCH /api/content` requests which update the database and call `revalidatePath('/')` to invalidate Next.js's ISR cache. The next visitor gets fresh content without any redeployment needed.

### AI Chat

The chat widget calls `POST /api/chat` which builds a system prompt from your live portfolio data and calls the Gemini API. The model answers in natural language, using first name only, and only speaks about information it was given — it won't fabricate details. Rate limiting via Upstash Redis prevents daily quota exhaustion.

The chat widget can be toggled on/off from the Hero admin editor — useful when the daily AI quota runs out or during maintenance.

### Authentication

Auth.js v5 with GitHub OAuth. The `signIn` callback checks `profile.login` against `ADMIN_GITHUB_USERNAME` — only your exact GitHub username can authenticate. The `proxy.ts` file (Next.js 16's middleware convention) protects all `/admin/*` routes server-side before any page renders.

### 3D Scene

The Spline scene loads only on hover to avoid GPU drain on page load. A static PNG shows immediately as a fallback. On hover the scene fades in and mouse movement rotates the character's head via Spline's object API. On mobile and tablet portrait (< 1024px) the Spline scene is disabled entirely — only the PNG shows.

### Conditional Sections

Achievements, Certifications, and their Navbar links only render when those arrays have content. The check happens at the server component level — empty sections produce zero HTML output, no placeholder headings, no wasted space.

---

## Deployment

Every push to `main` triggers an automatic Vercel deployment.

### Initial Setup

1. Import repo to Vercel
2. Add all environment variables in Vercel dashboard
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your production URL
4. Update GitHub OAuth app settings:
   ```
   Homepage URL:               https://yourdomain.vercel.app
   Authorization callback URL: https://yourdomain.vercel.app/api/auth/callback/github
   ```
5. Connect Upstash Redis via Vercel Storage → the KV env vars are injected automatically
6. Redeploy after adding env vars

---

## Key Technical Decisions

| Decision | Why |
|---|---|
| MongoDB over SQL | Portfolio content is document-shaped — nested arrays, flexible fields. No joins needed. |
| Auth.js v5 + GitHub OAuth | No password storage, no user table. One env var controls who has access. |
| ISR + revalidatePath | Cached performance for visitors, instant updates after admin saves. Best of both. |
| Gemini free tier | 1,500+ requests/day at zero cost using gemini-3.1-flash-lite. |
| Upstash Redis.fromEnv() | HTTP-based Redis works with Vercel serverless. Auto-injected env vars via Vercel Storage integration. Graceful null fallback means local dev works without Redis. |
| @dnd-kit over react-beautiful-dnd | react-beautiful-dnd unmaintained since 2023. @dnd-kit actively maintained, no peer dependency conflicts with React 19. |
| Hover-to-load Spline | WebGL drains GPU continuously. Loading on hover only keeps page fast. Disabled on mobile where touch replaces hover. |
| Server components for data | One DB call per page load at server level. Props flow down. No client-side loading spinners for main content. |
| PeriodPicker with internal state | Fully controlled period picker caused stale closure bugs when only month OR year was selected. Internal useState fixes this while keeping parent in sync. |
| Conditional section rendering | return null when empty — no HTML output, no placeholder space, navbar links also hidden. Cleaner than CSS hide/show. |
| chatEnabled in hero schema | Admin can disable the chat widget from the panel when Gemini quota runs out — no code push needed. |

---

## License

MIT — feel free to fork and adapt for your own portfolio.
