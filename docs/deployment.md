# TrackJ Production Deployment Guide

This guide covers step-by-step instructions to deploy TrackJ (both the frontend and backend) online for production.

---

## 🏛️ Architecture
In production, it is recommended to split the application:
1. **Backend API**: Deployed as a web service with a managed PostgreSQL database (e.g. Railway, Render, Fly.io).
2. **Frontend client**: Deployed as a static site (e.g. Vercel, Netlify).

---

## 📦 Part 1: Deploying the Backend API & Database

We have created a production-ready multi-stage `Dockerfile` under `server/Dockerfile`.

### Option A: Deploying on Railway (Recommended)

1. **Create a new project**:
   - Go to [Railway.app](https://railway.app) and log in.
   - Click **New Project** → **Provision PostgreSQL** (this sets up your database).

2. **Deploy the backend service**:
   - Click **New** → **GitHub Repo** → select your `trackJ` repository.
   - In the service settings, go to the **Settings** tab:
     - Set **Root Directory** to `server`.
     - Railway will automatically detect the `server/Dockerfile` and start building the container.

3. **Set Environment Variables**:
   In the backend service's **Variables** tab, add:
   - `NODE_ENV=production`
   - `PORT=4000`
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}` (or copy the connection string from your Postgres service variables)
   - `JWT_SECRET=generate_a_secure_random_string`
   - `GEMINI_API_KEY=your_actual_gemini_api_key`

4. **Expose the backend port**:
   - In settings, click **Generate Domain** or expose port `4000` to get a public URL for your backend API (e.g., `https://api.yourdomain.railway.app`).

---

## 🎨 Part 2: Deploying the Frontend Client

Since the client is a Vite/React application, it compiles to standard HTML/JS/CSS assets that can be hosted for free.

### Deploying on Vercel

1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **Add New** → **Project** → select your `trackJ` repository.
3. In the project configure settings:
   - Set **Framework Preset** to `Vite`.
   - Set **Root Directory** to `client`.
4. In **Build & Development Settings**:
   - **Build Command**: `npm run build` (Vercel runs this from the client workspace context).
   - **Output Directory**: `dist`.
5. Under **Environment Variables**, add:
   - `VITE_API_URL=https://api.yourdomain.railway.app` (pointing to your live Railway backend URL from Part 1).
6. Click **Deploy**.

---

## 🔄 How Database Migrations Run in Production

The Docker container's starting command is configured to automatically run migrations against your production database before launching the server:

```bash
npx prisma migrate deploy && npm run start
```

This guarantees your production database schema is always up to date with any schema updates in `schema.prisma`.
