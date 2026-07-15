<p align="center">
  <img src="https://img.shields.io/badge/SquidAI-Ultimate%20Technical%20Assistant-ec4899?style=for-the-badge&labelColor=1f2937" alt="SquidAI" />
</p>

<h1 align="center">SquidAI</h1>
<p align="center">
  <strong>Your Ultimate Technical Assistant</strong> for code, architecture, and problem solving.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Gemini%20API-AI-4285f4?style=flat-square" alt="Gemini" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb" alt="MongoDB" />
</p>

---

## ✨ Overview

**SquidAI** is a full-stack AI chat application powered by **Google Gemini**. It combines a polished landing experience with a powerful chat interface: sign in (or continue as guest), then talk to SquidAI for coding help, architecture advice, and problem solving. Attach images for vision-based answers and keep your chat history in sync with MongoDB (or use local/demo mode).

---


## 🚀 Features

- **AI chat** — Streamed responses from **Gemini** (code, architecture, general Q&A).
- **Image understanding** — Attach images and ask questions; SquidAI describes and answers from them.
- **Auth** — Sign in with **Google** (NextAuth) or continue as **guest**.
- **Chat history** — Sessions stored in **MongoDB** (or fallback to demo/local mode).
- **Voice input** — Optional **speech-to-text** (browser Web Speech API).
- **Responsive UI** — Dark theme, Framer Motion animations, mobile-friendly layout.
- **Landing & pages** — Hero, features, about, blog, careers, support, and legal pages.

---

## 🛠 Tech Stack

| Layer        | Tech |
|-------------|------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language**   | TypeScript 5 |
| **Styling**   | Tailwind CSS 4, Framer Motion |
| **AI**        | Google Gemini API (streaming) |
| **Auth**      | NextAuth.js (Google OAuth) |
| **Database**  | MongoDB Atlas (optional) |
| **UI**        | Radix UI, Lucide icons, custom components |

---

## 📋 Prerequisites

- **Node.js** ≥ 18.17
- **npm** (or yarn/pnpm)
- **Gemini API key** — [Get one](https://ai.google.dev/)
- **MongoDB Atlas** (optional) — for persistent chat history
- **Google OAuth** (optional) — for Sign in with Google

---

## 🏃 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/SquidAI.git
cd SquidAI
npm install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp env.local.example .env.local
```

Edit `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | **Yes** | From [Google AI Studio](https://ai.google.dev/) |
| `MONGODB_URI`    | No | MongoDB Atlas connection string (for chat history) |
| `NEXTAUTH_SECRET`| No* | Random string, e.g. `openssl rand -base64 32` |
| `NEXTAUTH_URL`   | No* | `http://localhost:3000` (dev) or your production URL |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No* | For Google sign-in |

\* Required if you use Google sign-in.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Continue as guest** or sign in with Google (if configured).

---

## 📁 Project Structure

```
SquidAI/
├── app/
│   ├── api/              # API routes (chat, auth, sessions, MongoDB, etc.)
│   ├── chat/             # Chat page
│   ├── login, register, about, features, ...
│   ├── layout.tsx
│   └── page.tsx          # Landing + auth gate
├── components/
│   ├── auth/             # Auth context, UI, session provider
│   ├── chat/             # Chat history, sidebar, list, messages
│   ├── landing/         # Hero, Features, Footer, AIShowcase, etc.
│   ├── ui/               # Shared UI (buttons, cards, inputs, …)
│   └── ChatInterface.tsx  # Main chat UI + streaming
├── lib/
│   ├── gemini.ts         # Gemini streaming + helpers
│   ├── env.ts            # Env config
│   ├── mongodb.ts        # MongoDB connection + helpers
│   └── ...
├── hooks/                # e.g. use-speech-recognition
├── types/
├── public/
├── docs/screenshots/     # Add README screenshots here
├── env.local.example
└── README.md
```

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev`   | Start dev server (webpack) |
| `npm run build`| Production build (webpack) |
| `npm start`    | Run production server |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment

1. **Set environment variables** in your host (Vercel, Netlify, Render, etc.):  
   `GEMINI_API_KEY`, `GEMINI_MODEL` (optional, e.g. `gemini-2.5-flash`), `MONGODB_URI` (if used), `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (your production URL), and `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` if you use Google sign-in.

2. **Build and start (production):**
   ```bash
   npm run build
   npm start
   ```
   Use **`npm start`** in production (not `npm run dev`).

3. **NextAuth:** Add your production URL to Google OAuth redirect URIs (e.g. `https://yourdomain.com/api/auth/callback/google`).

The app uses `next build --webpack` to avoid Turbopack symlink issues (e.g. on Windows) with the MongoDB package.

### Deploy on Render.com

- **Build Command:** `npm install; npm run build`
- **Start Command:** `npm start` (do **not** use `npm run dev`)
- **Environment:** In the Render dashboard → **Environment**, add the variables below. Do **not** set `NODE_ENV=development` — leave it unset or set `NODE_ENV=production`.

**Required env vars (add in Render → your service → Environment):**

| Variable | Value | Required |
|----------|--------|----------|
| **NEXTAUTH_SECRET** | Run `openssl rand -base64 32` in a terminal, copy the output, and paste it here. **Without this you will see `NO_SECRET` errors in logs and auth will fail.** | **Yes** |
| **NEXTAUTH_URL** | Your Render URL, e.g. `https://squidai.onrender.com` (no trailing slash). If unset or localhost, the app uses Render’s **RENDER_EXTERNAL_URL** automatically. | **Yes** (or auto on Render) |
| **AUTH_TRUST_HOST** | `true` | **Yes** (for Google sign-in behind proxy) |
| **GOOGLE_CLIENT_ID** | From Google Cloud Console | If using Google sign-in |
| **GOOGLE_CLIENT_SECRET** | From Google Cloud Console | If using Google sign-in |
| GEMINI_API_KEY, MONGODB_URI, etc. | Same as in `.env.local` | As needed |

**If you see `NO_SECRET` or "Please define a secret in production" in Render logs:**  
Add **NEXTAUTH_SECRET** in Render → Environment (see table above), then click **Save Changes** and redeploy. The app does not read `.env.local` on Render — you must set every variable in the Render Environment tab.

**Google Auth:** In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → your OAuth 2.0 Client (Web application) → **Authorized redirect URIs**, add **exactly** (no trailing slash): `https://squidai.onrender.com/api/auth/callback/google`. Without this, Google sign-in will fail.

**If you see "Access blocked: Authorization Error" or Error 400: invalid_request:** The redirect URI in Google Console must match **exactly** (same protocol, no trailing slash). Add only: `https://squidai.onrender.com/api/auth/callback/google`. If your OAuth consent screen is in **Testing** mode, add your Gmail under OAuth consent screen → Test users.

**If you see "Server error" or "There is a problem with the server configuration" at `/api/auth/error`:**  
Same as above: add **NEXTAUTH_SECRET**, **NEXTAUTH_URL**, and **AUTH_TRUST_HOST** in Render → Environment, add the callback URL in Google Console, then redeploy.

**If after clicking your Google account you get "This site can't be reached" or the URL is `localhost:3000/api/auth/callback/google`:**  
NextAuth is using localhost as the callback URL. On **Render → Environment**, set **NEXTAUTH_URL** to your live URL: `https://squidai.onrender.com` (not `http://localhost:3000`). In **Google Cloud Console** → your OAuth client → **Authorized redirect URIs**, add `https://squidai.onrender.com/api/auth/callback/google`. Save and redeploy. Use `localhost` only for local dev (with `npm run dev`).

---

## 📜 License

This project is private/all rights reserved unless otherwise stated. Use and distribution subject to the repository license.

---

<p align="center">
  <strong>SquidAI</strong> — Your Ultimate Technical Assistant
</p>
