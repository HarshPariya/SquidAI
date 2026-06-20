# Deploy SquidAI on Vercel

## Fix: "GEMINI_API_KEY already exists"

You are **adding a duplicate**. Do **not** type `GEMINI_API_KEY` again in a new row.

1. Click the **minus (−)** on the red/error row (the duplicate you just added).
2. **Scroll** the Environment Variables list — find the **first** `GEMINI_API_KEY`.
3. Click **Edit** on that row and paste your API key value.
4. Click **Deploy**.

Or skip env vars on the import screen → deploy once → **Project → Settings → Environment Variables** → edit each key there.

---

## One-time: connect GitHub

1. [vercel.com](https://vercel.com) → **Add New → Project**
2. Import **HarshPariya/SquidAI**
3. Framework: **Next.js** (auto)
4. Root: `./` — leave build settings as default
5. Fix env vars (above), then **Deploy**

---

## Required environment variables

| Variable | Notes |
|----------|--------|
| `GEMINI_API_KEY` | Required for chat |
| `GEMINI_MODEL` | Optional, e.g. `gemini-2.5-flash` |
| `MONGODB_URI` | Optional; use `%40` for `@` in password |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | For Google sign-in |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://YOUR-APP.vercel.app` (no trailing slash) |
| `AUTH_TRUST_HOST` | `true` |

Do **not** set `NODE_ENV=development` on Vercel.

---

## Google OAuth (after you know your Vercel URL)

[Google Cloud Console](https://console.cloud.google.com/) → Credentials → your Web client:

**Authorised redirect URIs** — add:

```text
https://YOUR-APP.vercel.app/api/auth/callback/google
```

**Authorised JavaScript origins** — add:

```text
https://YOUR-APP.vercel.app
```

Keep `http://localhost:3000/...` for local dev.

---

## CLI (optional)

```powershell
cd H:\SquidAI
npx vercel login
.\scripts\vercel-setup.ps1 -VercelUrl "https://your-app.vercel.app"
npx vercel --prod
```

---

## Security

If your API key appeared in a screenshot or chat, **rotate** it at [Google AI Studio](https://aistudio.google.com/apikey).
