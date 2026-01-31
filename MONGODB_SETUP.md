# MongoDB connection setup for SquidAI

Follow these steps to connect your app to MongoDB Atlas.

## 1. Add the connection string to `.env.local`

Create or edit **`.env.local`** in the project root (same folder as `package.json`).

**Your password contains `@`** — it must be URL-encoded or the connection will fail:

- `@` → `%40`
- So `Harsh@2005` becomes `Harsh%402005`

Add this line (use your actual password encoding):

```env
MONGODB_URI=mongodb+srv://hpariya195_squidai:Harsh%402005@cluster0.wjeqjuo.mongodb.net/
```

- No space around `=`
- No quotes around the value
- If your password has other special characters: `#` → `%23`, `?` → `%3F`, `:` → `%3A`

## 2. Allow your IP in MongoDB Atlas (Network Access)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and sign in.
2. Select your project → **Network Access** (left sidebar).
3. Click **Add IP Address**.
4. Either:
   - Click **Add Current IP Address** and confirm, or
   - For development only: choose **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Save. It can take 1–2 minutes to apply.

## 3. Restart the dev server

Stop the server (Ctrl+C) and start again:

```bash
npm run dev
```

## 4. Test the connection

Open in your browser:

**http://localhost:3000/api/mongodb-status**

- **`"ok": true`** — Connected. You’re done.
- **`"ok": false`** — Read the `error` and `fix` fields; they tell you what to change.

## Common errors

| Error / message | What to do |
|-----------------|------------|
| `MONGODB_URI not set` | Add `MONGODB_URI=...` to `.env.local` and restart the server. |
| `authentication failed` | Fix the password: use `%40` for `@`, and check username (e.g. `hpariya195_squidai`). |
| `ENOTFOUND` / `getaddrinfo` | Check the hostname (e.g. `cluster0.wjeqjuo.mongodb.net`) and your internet. |
| `timed out` / `timeout` | Add your IP (or `0.0.0.0/0`) in Atlas **Network Access**. |

After connection works, chats and logged-in users will be stored in the **squidai** database in MongoDB.
