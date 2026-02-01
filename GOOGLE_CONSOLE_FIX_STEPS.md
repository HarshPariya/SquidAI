# 🔑 Google Cloud Console - Fix Redirect URIs

## **STEP-BY-STEP GUIDE**

### **Step 1: Open Google Cloud Console**
- Go to: https://console.cloud.google.com/apis/credentials
- Make sure you're logged into the Google account that owns the project

### **Step 2: Find Your OAuth 2.0 Client**
- Look for section: **"OAuth 2.0 Client IDs"**
- You should see: `Web client` or similar
- Find the one with ID: `163581399345-if2jfasvsa8ikh6o1jvtoqu7t6ps8oc5.apps.googleusercontent.com`
- **Click on it to open** (blue link/button)

### **Step 3: Locate Authorized Redirect URIs**
You should see a form with these fields:
- Application name
- Client ID
- Client secret
- **Authorized redirect URIs** ← THIS ONE

### **Step 4: Update the Redirect URIs**
In **"Authorized redirect URIs"** section:

**REMOVE these (if present):**
- ❌ `http://localhost:3000/api/auth/callback/google`
- ❌ Any other localhost entries
- ❌ Any wrong URLs

**ADD these exactly:**
```
https://squidai.onrender.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### **Step 5: SAVE**
- Scroll down and click **"SAVE"** button
- Wait for confirmation message
- You should see: "Saved successfully" or similar

### **Step 6: Verify**
- Scroll back up to **"Authorized redirect URIs"**
- Confirm you see both URLs:
  - ✅ `https://squidai.onrender.com/api/auth/callback/google`
  - ✅ `http://localhost:3000/api/auth/callback/google`

---

## **SCREENSHOT CHECKLIST**

When looking at the form, you should see:
- [ ] "OAuth 2.0 Client IDs" heading
- [ ] Your client ID visible
- [ ] "Authorized redirect URIs" section with a text box
- [ ] SAVE button visible

---

## **COMMON MISTAKES**

❌ **Wrong:** Editing the API keys page instead of OAuth credentials  
✅ **Right:** Go to "Credentials" and find "OAuth 2.0 Client IDs" section

❌ **Wrong:** Adding URLs with trailing slashes: `https://squidai.onrender.com/api/auth/callback/google/`  
✅ **Right:** No trailing slash: `https://squidai.onrender.com/api/auth/callback/google`

❌ **Wrong:** Forgetting to click SAVE  
✅ **Right:** Always click SAVE after making changes

❌ **Wrong:** Only having one URL  
✅ **Right:** Have BOTH production and localhost URLs

---

## **AFTER SAVING**

1. Wait 5-10 minutes for Google to apply changes
2. Go to: https://squidai.onrender.com/
3. Click "Sign in with Google"
4. Choose your email
5. Should redirect to SquidAI chat ✅ (not localhost error)

---

## **IF STILL NOT WORKING**

1. Check the URL in browser - should NOT show localhost
2. Check Google Console again - confirm both URLs are there
3. Wait longer (sometimes takes 15+ minutes)
4. Clear browser cookies (F12 → Application → Cookies → Delete all)
5. Try in incognito mode

---

**CRITICAL:** The URL showing `localhost:3000` means Google is redirecting there, which means Google Cloud Console still doesn't have the production URL approved!

Make sure you SAVE after adding the URLs! 🔑
