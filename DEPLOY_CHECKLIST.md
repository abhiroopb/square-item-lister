# ✅ Deployment Checklist

## Quick Steps to Deploy

### 1️⃣ Push to GitHub (5 minutes)

```bash
cd /Users/abhiroop/Documents/Goose/square-item-lister
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/square-item-lister.git
git push -u origin main
```

- [ ] Code pushed to GitHub
- [ ] Repository is public

---

### 2️⃣ Deploy Backend to Railway (5 minutes)

1. [ ] Go to https://railway.app
2. [ ] Sign in with GitHub
3. [ ] Click "New Project" → "Deploy from GitHub repo"
4. [ ] Select `square-item-lister` repo
5. [ ] Go to "Settings" → Set Root Directory: `server`
6. [ ] Go to "Variables" → Add:
   - [ ] `PORT=3001`
   - [ ] `SQUARE_ACCESS_TOKEN=your_square_sandbox_token`
   - [ ] `SQUARE_ENVIRONMENT=sandbox`
   - [ ] `OPENAI_API_KEY=your_openai_api_key`
   - [ ] `CLIENT_URL=*`
7. [ ] Copy your Railway URL (e.g., `https://your-app.railway.app`)
8. [ ] Test: `https://your-app.railway.app/api/health`

**Your Backend URL:** `_______________________________`

---

### 3️⃣ Deploy Frontend to Vercel (5 minutes)

1. [ ] Go to https://vercel.com
2. [ ] Sign in with GitHub
3. [ ] Click "Add New Project"
4. [ ] Select `square-item-lister` repo
5. [ ] Configure:
   - [ ] Framework: Vite
   - [ ] Root Directory: `client`
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
6. [ ] Add Environment Variable:
   - [ ] Name: `VITE_API_URL`
   - [ ] Value: `https://your-app.railway.app/api` (your Railway URL)
7. [ ] Click "Deploy"
8. [ ] Copy your Vercel URL (e.g., `https://square-item-lister.vercel.app`)

**Your Frontend URL:** `_______________________________`

---

### 4️⃣ Update CORS (2 minutes)

1. [ ] Go back to Railway
2. [ ] Go to "Variables"
3. [ ] Update `CLIENT_URL` to your Vercel URL:
   - [ ] `CLIENT_URL=https://square-item-lister.vercel.app`
4. [ ] Railway will auto-redeploy

---

### 5️⃣ Test Everything (2 minutes)

1. [ ] Open your Vercel URL
2. [ ] Upload a test image
3. [ ] Click "Enhance Image"
4. [ ] Click "Generate with AI"
5. [ ] Click "Create Square Listing"
6. [ ] Check Square Dashboard for the item

---

## ✅ Success Criteria

- [ ] Backend health check works: `https://your-app.railway.app/api/health`
- [ ] Frontend loads: `https://square-item-lister.vercel.app`
- [ ] Can upload images
- [ ] AI generates content
- [ ] Items created in Square
- [ ] No CORS errors in browser console

---

## 🎉 You're Live!

**Share your app:** `https://square-item-lister.vercel.app`

---

## 📝 Notes

**Backend URL:** ___________________________________

**Frontend URL:** ___________________________________

**Deployed on:** ___________________________________

**Status:** ✅ Live / ⏸️ In Progress / ❌ Issues

---

## 🔄 Future Updates

To update your app:

```bash
git add .
git commit -m "Your update message"
git push
```

Both Railway and Vercel will auto-deploy! 🚀
