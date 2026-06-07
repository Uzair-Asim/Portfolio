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
| Rate Limiting | Upstash Redis |
| 3D Scene | Spline |
| Animations | Framer Motion |
| Drag & Drop | @dnd-kit |
| Deployment | Vercel |
| Analytics | Vercel Analytics + Speed Insights |

---

## Features

- 🎨 Animated hero section with interactive 3D Spline scene (hover to interact)
- 🔧 Full admin panel — edit every section without touching code
- 🔐 Protected admin with GitHub OAuth — only you can access it
- 🤖 AI chat widget powered by Google Gemini — answers questions about you
- ⚡ Rate limiting with Upstash Redis — prevents API abuse
- 🏆 Achievements & Certifications — conditionally rendered when content exists
- 📊 Vercel Analytics + Speed Insights
- 📱 Fully responsive

---

## Project Structure

```
app/
├── admin/
│   ├── hero/           — Name, title, stats, availability, chat toggle
│   ├── skills/         — Skill categories with drag-and-drop
│   ├── experience/     — Work history with auto-sort by end date
│   ├── projects/       — Projects with emoji picker and featured sorting
│   ├── achievements/   — Achievements and certifications (two tabs)
│   └── contact/        — Email, phone, LinkedIn, GitHub, location
├── api/
│   ├── auth/           — Auth.js v5 handlers
│   ├── content/        — Portfolio GET + PATCH API with revalidation
│   └── chat/           — Gemini AI chat with rate limiting
└── page.tsx            — Main portfolio page (server component)

components/
├── sections/
│   ├── Hero.tsx            — Spline 3D scene, stats, CTA
│   ├── Skills.tsx          — Skill category cards
│   ├── Experience.tsx      — Timeline with current role indicator
│   ├── Projects.tsx        — 3D tilt cards with spring physics
│   ├── Achievements.tsx    — Key achievements grid
│   ├── Certifications.tsx  — Certifications with verify links
│   └── Contact.tsx         — Contact cards + CTA + footer
├── chat/
│   ├── ChatWidget.tsx          — Floating chat UI
│   └── ChatWidgetWrapper.tsx   — Server wrapper for chat toggle
├── Navbar.tsx              — Fixed navbar with conditional section links
└── ui/
    ├── Button.tsx
    ├── Badge.tsx
    ├── Toggle.tsx
    └── EmojiPicker.tsx     — Curated professional emoji grid

lib/
├── auth.ts         — Auth.js v5 config (GitHub OAuth, admin check)
├── mongodb.ts      — Cached Mongoose connection
├── data.ts         — getPortfolioData() with ISR (1 hour cache)
├── redis.ts        — Upstash Redis client (graceful null if unconfigured)
└── seed.ts         — One-time database seeder

models/
└── Portfolio.ts    — Full Mongoose schema with TypeScript interfaces

proxy.ts            — Next.js 16 middleware (protects /admin/*)
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- MongoDB Atlas account (free tier works)
- GitHub account (for OAuth)
- Google AI Studio account (free tier — 1,500 req/day)
- Upstash account (optional — free tier for rate limiting)

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

# Rate Limiting (optional — chat still works without this)
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

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

All portfolio content lives in MongoDB. The admin panel sends `PATCH /api/content` requests which update the database and call `revalidatePath('/')` to invalidate Next.js's ISR cache. Visitors always see fresh content on their next page load without any redeployment.

### AI Chat

The chat widget sends messages to `POST /api/chat` which builds a system prompt from your live portfolio data and calls the Gemini API. The model only answers based on your portfolio information — it won't make things up or go off-topic. Rate limiting via Upstash Redis prevents quota abuse.

### Authentication

Auth.js v5 with GitHub OAuth. The `signIn` callback checks `profile.login` against `ADMIN_GITHUB_USERNAME` — only your exact GitHub username can authenticate. The `proxy.ts` middleware protects all `/admin/*` routes before any page renders.

### 3D Scene

The Spline scene loads only on hover to avoid GPU drain. A static PNG fallback shows immediately. On hover, the scene fades in and tracks mouse movement to rotate the character's head using Spline's object API.

---

## Deployment

Every push to `main` triggers an automatic Vercel deployment.

### Initial Setup

1. Import repo to Vercel
2. Add all environment variables in Vercel dashboard
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your production URL
4. Update GitHub OAuth app callback URL:
   ```
   https://yourdomain.vercel.app/api/auth/callback/github
   ```
5. Connect Upstash Redis via Vercel Storage (auto-injects env vars)

---

## Key Technical Decisions

| Decision | Why |
|---|---|
| MongoDB over SQL | Portfolio content is document-shaped — nested arrays, flexible fields. No joins needed. |
| Auth.js v5 + GitHub OAuth | No password storage. One env var controls who has access. |
| ISR + revalidatePath | Cached performance with instant admin updates. Best of both worlds. |
| Gemini free tier | 1,500 requests/day at zero cost. Sufficient for portfolio traffic. |
| Upstash Redis | HTTP-based Redis works with Vercel's serverless functions. Atomic INCR prevents race conditions in rate limiting. |
| @dnd-kit over react-beautiful-dnd | react-beautiful-dnd is unmaintained since 2023. @dnd-kit is actively maintained and has no peer dependency conflicts. |
| Hover-to-load Spline | WebGL scenes drain GPU continuously. Loading only on hover keeps the page fast for all visitors while preserving the interactive experience. |
| Server components for data fetching | One DB call per page load at the server level. Data passes down as props. No client-side loading states for the main content. |

---

## License

MIT — feel free to fork and adapt for your own portfolio.
