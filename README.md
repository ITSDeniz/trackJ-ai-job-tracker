# TrackJ — AI-Powered Job Application Tracker

TrackJ is a full-stack web application that helps you organize your job search pipeline, manage target companies, track tasks, and get AI-powered resume feedback — all in one place.

---

## ✨ Features

- **Job Application Pipeline** — Track applications from Saved → Applied → Screening → Interviewing → Offer / Rejected
- **Company Directory** — Manage target companies with industry, location, size, and notes
- **Task Checklist** — Create due-date-aware tasks linked to specific job applications
- **Dashboard Analytics** — Visual charts for monthly application volume and conversion funnel rates
- **AI Resume Review** — Paste your resume and get structured Gemini AI feedback with a score, strengths, and actionable improvements
- **Dark / Light Mode** — Full theme toggle support
- **Secure Auth** — JWT-based authentication with bcrypt password hashing and rate limiting on login/register

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL (via Docker), Prisma ORM |
| **AI** | Google Gemini API (`@google/generative-ai`) |
| **Auth** | JWT (`jsonwebtoken`), bcrypt (`bcryptjs`) |
| **Security** | Helmet, CORS, express-rate-limit |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22
- npm >= 10
- Docker (for the local Postgres database)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/trackj.git
cd trackj
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/trackj
JWT_SECRET=your_strong_random_secret_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> **Generate a secure JWT secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

> **Get a Gemini API key:** [Google AI Studio](https://aistudio.google.com/app/apikey)

### 4. Start the database

```bash
docker-compose up -d
```

### 5. Run database migrations

```bash
npm run prisma:migrate --workspace=server
```

### 6. Seed the database (Optional)

To populate your test account database with mock companies and realistic job applications (Google, Meta, Stripe, Airbnb, Linear) for quick testing:

```bash
npx tsx server/src/seed.ts
```

### 7. Start the development server

```bash
npm run dev
```

This starts both the frontend (`http://localhost:5173`) and backend (`http://localhost:4000`) concurrently.

---

## 📁 Project Structure

```
trackj/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── app/          # Root app setup and providers
│       ├── components/   # Reusable UI components
│       ├── features/     # Feature modules (auth, theme)
│       ├── lib/          # API client, utilities
│       └── routes/       # Page components
├── server/               # Express backend
│   └── src/
│       ├── application/  # Use cases / business logic
│       ├── config/       # Environment config (Zod validated)
│       ├── delivery/     # HTTP controllers, routes, middleware
│       ├── domain/       # Domain models and error types
│       └── infrastructure/ # Prisma repositories, security services
├── docker-compose.yml    # Local PostgreSQL container
└── package.json          # Monorepo root
```

---

## 🔐 Security

- Passwords are hashed with **bcrypt** (10 rounds)
- All protected routes require a valid **JWT Bearer token**
- Login and register endpoints are **rate-limited** to 5 requests per 15 minutes per IP
- Request body logging is **disabled in production** and redacts passwords in development
- Environment secrets are **never committed** (`.env` is in `.gitignore`)

---

## 📝 License

MIT
