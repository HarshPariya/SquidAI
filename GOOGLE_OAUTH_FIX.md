# Google OAuth Error 400: redirect_uri_mismatch - SOLUTION GUIDE

## Problem
You're getting: `Error 400: redirect_uri_mismatch` when trying to sign in with Google.

This happens when the redirect URL sent by your app doesn't exactly match what's registered in Google Cloud Console.

---

## Solution: 3-Step Fix

### STEP 1: Configure Environment Variables

Update your `.env.local` file with your actual URLs:

```env
# For Local Development (http://localhost:3000)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# For Production (Render/Deployment)
# NEXTAUTH_URL=https://your-production-domain.com
# RENDER_EXTERNAL_URL=https://your-production-domain.onrender.com

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GEMINI_API_KEY=your_gemini_key_here
```

**Important Notes:**
- ❌ NO trailing slashes (e.g., ❌ `https://yourdomain.com/`)
- ✅ Use the exact domain format (e.g., ✅ `https://yourdomain.com`)
- For Render deployments, NEXTAUTH_URL should be your custom domain or the onrender.com URL

### STEP 2: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID (Web application)
3. Click Edit and update **Authorized redirect URIs**:

#### For Local Development:
```
http://localhost:3000/api/auth/callback/google
```

#### For Production:
```
https://your-production-domain.com/api/auth/callback/google
```

**⚠️ IMPORTANT:** The redirect URI must match EXACTLY what you set in NEXTAUTH_URL + `/api/auth/callback/google`

4. Save changes

### STEP 3: Update Authorized JavaScript Origins (Optional but Recommended)

In the same OAuth 2.0 Client ID settings, add your domain to **Authorized JavaScript origins**:

#### For Local Development:
```
http://localhost:3000
```

#### For Production:
```
https://your-production-domain.com
```

---

## How the Updated Code Works

The new implementation in [app/api/auth/[...nextauth]/route.ts](app/api/auth/[...nextauth]/route.ts):

1. **Builds the correct base URL** from environment variables in order of priority:
   - `NEXTAUTH_URL` (highest priority)
   - `RENDER_EXTERNAL_URL` (fallback for Render)
   - `http://localhost:3000` (development default)

2. **Normalizes the URL** by removing trailing slashes (prevents mismatch errors)

3. **Explicitly sets the redirect_uri** in Google OAuth params to ensure it matches Google Console exactly

4. **Includes `trustHost: true`** to properly handle host headers in production

---

## Testing the Fix

### Local Development:
```bash
npm run dev
# Visit http://localhost:3000
# Try signing in with Google
```

### After Deployment:
```bash
# Set these in your Render Environment Variables:
NEXTAUTH_URL=https://your-actual-domain.com
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
```

Then deploy and test the sign-in flow.

---

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `https://yourdomain.com/` | `https://yourdomain.com` |
| `yourdomain.com` | `https://yourdomain.com` |
| `http://yourdomain.com/api/auth/callback/google/` | `https://yourdomain.com/api/auth/callback/google` |
| Empty or missing `NEXTAUTH_URL` in production | Set `NEXTAUTH_URL=https://yourdomain.com` |

---

## UI Enhancement: SquidAI Logo

The login page now displays the SquidAI squid logo instead of a generic sparkles icon!

**What changed:**
- Replaced generic `<Sparkles />` icon with a custom SVG squid icon
- Squid icon has pink-to-red gradient matching SquidAI branding
- Animated with the same glow effect as before
- Fully responsive

---

## Still Getting Errors?

### Error: "This app isn't verified"
- This is normal for development. Click "Continue anyway" or verify your app in Google Console.

### Error: "Redirect URI doesn't match"
1. Check for trailing slashes in NEXTAUTH_URL
2. Verify the redirect URI is listed in Google Console settings
3. Restart your dev server after changing `.env.local`
4. Clear browser cache/cookies

### Error: "Invalid client_id or secret"
- Double-check you copied the credentials correctly from Google Cloud Console
- Make sure they're in `.env.local` (NOT `.env` or `.env.local.example`)

---

## Need to Generate a New NEXTAUTH_SECRET?

Run this command:
```bash
openssl rand -base64 32
```

Then copy the output to your `.env.local`:
```env
NEXTAUTH_SECRET=your_generated_secret
```

---

## Reference Files Modified

- [app/api/auth/[...nextauth]/route.ts](app/api/auth/[...nextauth]/route.ts) - Updated OAuth configuration
- [components/auth/auth-ui.tsx](components/auth/auth-ui.tsx) - Added SquidAI squid logo

---

**Questions?** Check the [NextAuth Documentation](https://next-auth.js.org/providers/google) or review the comments in the route.ts file.
