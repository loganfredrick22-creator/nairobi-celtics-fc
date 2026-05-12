# Nairobi Celtics FC — Deployment Guide

## Architecture Overview

```
GitHub (Source Code)
    ├── Vercel → Frontend (React/Vite)  → https://nairobi-celtics-fc.vercel.app
    └── Render → Backend (Express/API)  → https://nairobi-celtics-fc.onrender.com
                        ↕
                MongoDB Atlas (Database)
```

---

## 1. MongoDB Atlas Setup

### Step 1.1 — Create a Cluster
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign in (or create account)
2. Click **Create** → **Cluster** → Choose **M0 Free Tier** (Shared)
3. Select a cloud provider (AWS) and region closest to you (e.g., **Frankfurt - eu-central-1**)
4. Click **Create Cluster** (takes 3–5 minutes)

### Step 1.2 — Create Database User
1. In the left sidebar, go to **Security** → **Database Access**
2. Click **Add New Database User**
3. Choose **Password Authentication**
4. Set username: `ncfc_admin`
5. Set password: copy a strong password (save this)
6. Click **Add User**

### Step 1.3 — Whitelist IP Addresses
1. Go to **Security** → **Network Access**
2. Click **Add IP Address**
3. For production: click **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

### Step 1.4 — Get Connection String
1. Go to **Deployment** → **Database** → Click **Connect**
2. Select **Drivers**
3. Copy the connection string:
   ```
   mongodb+srv://ncfc_admin:<password>@cluster0.xxxxx.mongodb.net/nairobi-celtics-fc?retryWrites=true&w=majority
   ```
4. Replace `<password>` with the password you set in Step 1.2
5. Save this string — you'll need it for Render and Vercel

---

## 2. GitHub Setup

### Step 2.1 — Create Repository
```bash
cd nairobi-celtics-fc
git init
git add -A
git commit -m "Initial commit: Nairobi Celtics FC full-stack MERN"
gh repo create nairobi-celtics-fc --public --source=. --remote=origin --push
```

### Step 2.2 — Alternative: Manual Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/nairobi-celtics-fc.git
git branch -M main
git push -u origin main
```

---

## 3. Vercel Deployment (Frontend)

### Step 3.1 — Connect Vercel to GitHub
1. Go to [https://vercel.com](https://vercel.com) and sign in (or create account)
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Select **nairobi-celtics-fc** from your GitHub repos
5. Vercel auto-detects it's a Vite project

### Step 3.2 — Configure Project
Set these **Environment Variables** in Vercel:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://nairobi-celtics-fc.onrender.com/api` |

Or leave blank if using relative `/api` paths (Vite proxy only works in dev).

### Step 3.3 — Important: Vercel SPA Routing
The `client/vercel.json` already has this rewrite rule:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
This ensures React Router works on all paths.

### Step 3.4 — Deploy Settings
- **Root Directory:** `client` (Vercel should auto-detect)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 20.x

### Step 3.5 — Deploy
Click **Deploy**. Vercel will build and deploy automatically.
First deploy takes ~2 minutes.

### Step 3.6 — Custom Domain (Optional)
1. Go to Project → **Settings** → **Domains**
2. Add your domain (e.g., `nairoliceltics.co.ke`)
3. Configure DNS records as instructed by Vercel

---

## 4. Render Deployment (Backend)

### Step 4.1 — Create Web Service
1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Select your GitHub repo: **nairobi-celtics-fc**
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `nairobi-celtics-fc-api` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free |
| **Plan** | Free ($0/month) |

### Step 4.2 — Environment Variables
Click **Advanced** and add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://ncfc_admin:<password>@cluster0.xxxxx.mongodb.net/nairobi-celtics-fc?retryWrites=true&w=majority` | From MongoDB Atlas |
| `JWT_ACCESS_SECRET` | `your-random-64-char-secret` | `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | `your-random-64-char-secret` | Different from above |
| `CLIENT_URL` | `https://nairobi-celtics-fc.vercel.app` | Your Vercel URL |
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render sets this automatically |

### Step 4.3 — Deploy
Click **Create Web Service**. Render will:
- Pull from GitHub
- Install npm dependencies
- Start the Express server
- The service URL will be: `https://nairobi-celtics-fc-api.onrender.com`

### Step 4.4 — Verify
```bash
curl https://nairobi-celtics-fc-api.onrender.com/api/health
# {"success":true,"message":"Nairobi Celtics FC API is running"}
```

### Step 4.5 — Seed the Database on Render
Render has a **Shell** tab in your service dashboard. Use it to seed:
```bash
cd server && node seed/seedAll.js
```

Alternatively, create a one-off task:
1. Go to Dashboard → **New** → **Cron Job** or use Render's **Shell** access
2. Run: `node seed/seedAll.js`

### Step 4.6 — Free Tier Sleep Note
On Render's free tier, the service spins down after 15 minutes of inactivity.
First request after inactivity takes ~30 seconds to wake up.

For no spin-down, upgrade to **Starter** plan ($7/month).

---

## 5. Connecting Frontend to Backend

### 5.1 — Update API Base URL for Production
Edit `client/src/services/api.js`:

```javascript
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://nairobi-celtics-fc-api.onrender.com/api' 
    : '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
```

### 5.2 — Update CORS in Backend
The server's `app.js` already reads `CLIENT_URL` from env:
```javascript
app.use(cors({ origin: config.clientUrl, credentials: true }));
```
On Render, set `CLIENT_URL` to your Vercel domain (e.g., `https://nairobi-celtics-fc.vercel.app`).

---

## 6. Post-Deployment Checklist

### 6.1 — Test All Endpoints
```bash
# API Health
curl https://nairobi-celtics-fc-api.onrender.com/api/health

# Players
curl https://nairobi-celtics-fc-api.onrender.com/api/players

# Fixtures
curl https://nairobi-celtics-fc-api.onrender.com/api/fixtures

# Products
curl https://nairobi-celtics-fc-api.onrender.com/api/products

# News
curl https://nairobi-celtics-fc-api.onrender.com/api/news
```

### 6.2 — Test Frontend
Visit your Vercel URL and test:
- [ ] Homepage loads with hero, stats, fixtures
- [ ] News page loads with articles
- [ ] Squad page loads with 22 players
- [ ] Shop page loads with 20 products
- [ ] Ticketing wizard works
- [ ] Login/Register works
- [ ] All navigation links work

### 6.3 — Monitor
- **Render**: Check logs in Dashboard → Service → Logs
- **Vercel**: Check deployments and serverless function logs

---

## 7. Environment Summary

| Service | URL |
|---------|-----|
| GitHub | `https://github.com/FREDRICK-OTIENO/nairobi-celtics-fc` |
| Vercel (Frontend) | `https://nairobi-celtics-fc.vercel.app` |
| Render (Backend) | `https://nairobi-celtics-fc-api.onrender.com` |
| MongoDB Atlas | `mongodb+srv://ncfc_admin:<password>@cluster0.xxxxx.mongodb.net/nairobi-celtics-fc` |

### Render Environment Variables
```
MONGODB_URI=mongodb+srv://ncfc_admin:<password>@cluster0.xxxxx.mongodb.net/nairobi-celtics-fc
JWT_ACCESS_SECRET=<64-char-random>
JWT_REFRESH_SECRET=<64-char-random>
CLIENT_URL=https://nairobi-celtics-fc.vercel.app
NODE_ENV=production
```

### Vercel Environment Variables
```
VITE_API_URL=https://nairobi-celtics-fc-api.onrender.com/api
```

---

## 8. Troubleshooting

| Issue | Solution |
|-------|----------|
| **CORS error** | Ensure `CLIENT_URL` in Render env matches your Vercel domain exactly (no trailing slash) |
| **MongoDB connection refused** | Check Atlas IP whitelist — must allow 0.0.0.0/0 or Render's IPs |
| **Blank page on Vercel** | Check vercel.json is in client/ directory with rewrite rules |
| **API returns 404** | Check all routes are prefixed with `/api/` in app.js |
| **Free tier cold start** | First request after inactivity takes ~30s — use a uptime monitor like UptimeRobot to ping every 14 minutes |
| **JWT tokens invalid** | Regenerate secrets with `openssl rand -hex 32` and update Render env vars |
| **Images not loading** | Store images in Cloudinary or AWS S3 for production — local paths won't work on serverless |

---

## 9. Production Image Storage

For production, replace local `/images/` paths with a CDN:
1. Upload all images to **Cloudinary** (free tier: 25GB storage)
2. Alternatively, upload to **AWS S3** (cheap, pay-per-use)
3. Update `ImageWithFallback` component to use CDN URLs
4. Player images in `server/seed/seedPlayers.js` use `/images/player-1.jpg` — update to CDN paths

---

## 10. CI/CD

### GitHub Actions — Auto Deploy
Both Vercel and Render auto-deploy when you push to the `main` branch:

```bash
git add -A
git commit -m "feat: update feature"
git push origin main
# Vercel and Render deploy automatically
```

To disable auto-deploy:
- **Vercel**: Project Settings → Git → Disable Auto-Deploy
- **Render**: Dashboard → Service → Settings → Auto-Deploy → No
