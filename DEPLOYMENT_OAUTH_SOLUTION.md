# 🎯 GOOGLE OAUTH - RENDER DEPLOYMENT FIX

**Current Issue:** Error 400: redirect_uri_mismatch  
**Root Cause:** NEXTAUTH_URL on Render is not set to https://squidai.onrender.com  
**Status:** FIXABLE - Follow steps below

---

## 📋 YOUR CURRENT SETUP

### Local (.env.local) - ✅ CORRECT
```
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
NEXTAUTH_SECRET=<your-nextauth-secret>
MONGODB_URI=<your-mongodb-uri>
```

### Production (Render) - ❌ NEEDS UPDATE
```
NEXTAUTH_URL = ??? (MISSING OR WRONG)
GOOGLE_CLIENT_ID = (same as local)
GOOGLE_CLIENT_SECRET = (same as local)
NEXTAUTH_SECRET = (same as local)
```

**The problem:** Render needs NEXTAUTH_URL to be EXACTLY: `https://squidai.onrender.com`

---

## 🔧 FIX - FOLLOW THESE EXACT STEPS

### PART A: Fix Google Console (2 minutes)

1. **Open:** https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client ID** (looks like: `163581399345-...apps.googleusercontent.com`)

3. **Click on it** to open settings

4. **Find "Authorized redirect URIs"** section

5. **Currently you probably have:**
   - ❌ http://localhost:3000/api/auth/callback/google
   - ❌ https://squidai.onrender.com/api/auth/callback/google (if you added this wrong)

6. **DELETE** any old entries and **ADD these exactly:**
   ```
   https://squidai.onrender.com/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```

7. **Click SAVE**

### PART B: Fix Render Environment (3 minutes)

1. **Open:** https://dashboard.render.com/

2. **Click on your squidai project**

3. **Go to:** Settings → Environment

4. **Add/Update these variables** (copy-paste exactly):

   | Variable | Value |
   |----------|-------|
   | NEXTAUTH_URL | https://squidai.onrender.com |
   | NEXTAUTH_SECRET | <your-nextauth-secret> |
   | GOOGLE_CLIENT_ID | <your-google-client-id> |
   | GOOGLE_CLIENT_SECRET | <your-google-client-secret> |
   | MONGODB_URI | <your-mongodb-uri> |
   | MONGODB_DB_NAME | squidai |
   | GEMINI_API_KEY | <your-gemini-api-key> |

5. **Click SAVE**

### PART C: Redeploy (2 minutes)

1. **In Render dashboard, click your squidai project**

2. **Click "Manual Deploy"** (or wait for auto-deploy)

3. **Wait for green checkmark** (deployment complete)

4. **Wait 1-2 minutes** for environment variables to activate

### PART D: Test (1 minute)

1. **Open:** https://squidai.onrender.com/

2. **Click "Sign in with Google"**

3. **Expected: Google login page appears** ✅

4. **If error still shows:** Clear browser cache (F12 → Application → Storage → Clear all)

---

## ✨ What Should Happen

**Before Fix:**
```
Click "Sign in with Google"
  ↓
Error: "Error 400: redirect_uri_mismatch"
```

**After Fix:**
```
Click "Sign in with Google"
  ↓
Redirects to Google login ✅
Sign in with Google ✅
Redirects back to chat interface ✅
```

---

## 🚨 TROUBLESHOOTING

**Still seeing error?**

1. ✅ **Check Google Console again:**
   - Go to https://console.cloud.google.com/apis/credentials
   - Confirm redirect URI shows: `https://squidai.onrender.com/api/auth/callback/google`
   - Make sure you clicked SAVE

2. ✅ **Check Render dashboard:**
   - Go to your project
   - Settings → Environment
   - Confirm NEXTAUTH_URL = `https://squidai.onrender.com` (exactly, no trailing slash)

3. ✅ **Wait for deployment:**
   - Render needs 1-2 minutes to apply env var changes
   - Check if green checkmark visible

4. ✅ **Clear browser cache:**
   - F12 → Application → Storage
   - Select all and delete
   - Refresh page

5. ✅ **Check logs:**
   - Go to Render project
   - Click "Logs"
   - Look for any errors during startup

---

## ✅ VERIFICATION CHECKLIST

Before testing, confirm:

- [ ] Google Console updated with https://squidai.onrender.com/api/auth/callback/google
- [ ] Render environment has NEXTAUTH_URL=https://squidai.onrender.com
- [ ] All 7 environment variables set on Render
- [ ] Render deployment shows green checkmark
- [ ] Waited 1-2 minutes after deployment
- [ ] Browser cache cleared

---

## 🎊 EXPECTED RESULT

After completing all steps:

✅ Click "Sign in with Google"  
✅ See Google login page  
✅ Sign in with your Google account  
✅ Chat interface loads  
✅ Your email shows in top-right  
✅ Can start chatting  

**Status:** 🟢 WORKING

---

## 📞 NEED HELP?

If still stuck:
1. Screenshot Google Console showing redirect URI
2. Screenshot Render env variables
3. Screenshot the error message
4. Check Render logs for detailed error

All information provided for smooth deployment! 🚀
