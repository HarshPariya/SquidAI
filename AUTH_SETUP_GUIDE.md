# SquidAI Auth Setup Guide

## Current Status
✅ **Auth code is correct** - No compilation errors found
❌ **Production issues**: Missing `NEXTAUTH_SECRET` and incorrect `NEXTAUTH_URL` on Render

---

## Problem Summary

1. **NO_SECRET error**: NextAuth requires `NEXTAUTH_SECRET` in production
2. **State cookie missing**: Caused by `NEXTAUTH_URL` pointing to `localhost:3000` instead of production URL
3. **OAuth redirect mismatch**: Google OAuth requires exact URL matching

---

## Solution: Configure Render Environment Variables

### Step 1: Generate NEXTAUTH_SECRET

Run this command locally:
```bash
openssl rand -base64 32
```

Or use Python:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

This will output something like: `K7x9mN2pQ+zL3vB8wX5yC4dE6fG9hJ0kL1mN2pQ==`

---

### Step 2: Get New Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Find your project "SquidAI"
3. Go to **APIs & Services** → **Credentials**
4. Edit the OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, ensure this exact URL exists:
   ```
   https://squidai.onrender.com/api/auth/callback/google
   ```
6. Copy the **Client ID** and **Client Secret**

---

### Step 3: Set Environment Variables on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your **squidai** service
3. Click **Settings** (top right)
4. Scroll to **Environment**
5. Add/Update these variables:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `NEXTAUTH_URL` | `https://squidai.onrender.com` |
| `NEXTAUTH_SECRET` | *Paste the generated secret here* |
| `GOOGLE_CLIENT_ID` | *Your new Google Client ID* |
| `GOOGLE_CLIENT_SECRET` | *Your new Google Client Secret* |
| `GEMINI_API_KEY` | *Your Gemini API Key* |
| `MONGODB_URI` | `mongodb+srv://user:password@cluster.mongodb.net/` |
| `GEMINI_MODEL` | `gemini-2.5-flash` |

6. Click **Save** (does NOT auto-redeploy)
7. Click **Manual Deploy** or wait for next auto-deployment

---

### Step 4: Verify on Render

After deployment completes:

1. Visit `https://squidai.onrender.com`
2. Try clicking "Sign in with Google"
3. You should be redirected to Google login
4. After login, you should return to the app

**If you see errors:**
- Check Render logs: Click **Logs** tab in dashboard
- Look for messages like `[NextAuth]` to diagnose issues

---

## Local Development (No Changes Needed)

Your `.env.local` is correctly configured for local development:
- ✅ `NEXTAUTH_URL=http://localhost:3000` 
- ✅ `NEXTAUTH_SECRET` is set (used for local testing)

Run locally with:
```bash
npm install
npm run dev
```

---

## Files Status

| File | Status | Notes |
|------|--------|-------|
| `components/auth/auth-context.tsx` | ✅ OK | Handles authentication state |
| `components/auth/auth-ui.tsx` | ✅ OK | UI for login/register |
| `components/auth/client-providers.tsx` | ✅ OK | Wraps app with SessionProvider |
| `components/auth/dynamic-providers.tsx` | ✅ OK | Dynamic loading for SSR compatibility |
| `components/auth/session-provider.tsx` | ✅ OK | NextAuth SessionProvider |
| `app/api/auth/[...nextauth]/route.ts` | ✅ OK | NextAuth configuration |

---

## Common Issues & Solutions

### "Please define a `secret` in production"
**Cause**: `NEXTAUTH_SECRET` not set in Render environment  
**Fix**: Add `NEXTAUTH_SECRET` to Render environment variables

### "State cookie was missing" during Google login
**Cause**: `NEXTAUTH_URL` mismatch (set to localhost but running on Render URL)  
**Fix**: Set `NEXTAUTH_URL=https://squidai.onrender.com` in Render environment

### "Error 400: invalid_request" after Google login
**Cause**: Redirect URI doesn't match Google Console configuration  
**Fix**: Ensure `https://squidai.onrender.com/api/auth/callback/google` is in Google Console

### "Cannot read properties of null (reading 'useState')"
**Status**: Already fixed ✅  
**Method**: Dynamic loading with `ssr: false` in `dynamic-providers.tsx`

---

## Next Steps

1. ✅ Generate `NEXTAUTH_SECRET` using the command above
2. ✅ Get new Google OAuth credentials from Google Cloud Console
3. ✅ Add all variables to Render environment
4. ✅ Deploy on Render
5. ✅ Test Google login at `https://squidai.onrender.com`

After this, all red errors should be resolved! 🎉
