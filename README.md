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

1. **Set environment variables** in your host (Vercel, Netlify, etc.):  
   `GEMINI_API_KEY`, `MONGODB_URI` (if used), `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (e.g. `https://yourdomain.com`), and Google OAuth vars if you use sign-in.

2. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

3. **NextAuth:** Add your production URL to Google OAuth redirect URIs (e.g. `https://yourdomain.com/api/auth/callback/google`).

The app uses `next build --webpack` to avoid Turbopack symlink issues (e.g. on Windows) with the MongoDB package.

**Render:** If you see a "non-standard NODE_ENV" warning during build, set the build environment variable `NODE_ENV=production` in your Render service settings.

---

## 📄 Docs

- [MongoDB setup](./MONGODB_SETUP.md) — Connect MongoDB Atlas for chat history.
- [Screenshots](./docs/screenshots/README.md) — How to add screenshots for the README.

---

## 📜 License

This project is private/all rights reserved unless otherwise stated. Use and distribution subject to the repository license.

---

<p align="center">
  <strong>SquidAI</strong> — Your Ultimate Technical Assistant
</p>
