# 🚀 Deployment Guide - Full App

## Overview

This guide will help you deploy the complete Square Item Lister app so anyone can use it online.

**What we're deploying:**
- **Backend (Server)** → Railway (free tier)
- **Frontend (Client)** → Vercel (free)

**Total Cost:** $0 (using free tiers)

---

## 📋 Prerequisites

1. GitHub account (free)
2. Railway account (free) - https://railway.app
3. Vercel account (free) - https://vercel.com
4. Your API keys:
   - Square Sandbox Token
   - OpenAI API Key

---

## Part 1: Deploy Backend to Railway

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Name: `square-item-lister`
3. Make it **Public** (so anyone can use it)
4. Click "Create repository"

### Step 2: Push Code to GitHub

```bash
cd /Users/abhiroop/Documents/Goose/square-item-lister

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Square Item Lister"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/square-item-lister.git

# Push
git push -u origin main
```

### Step 3: Deploy Server to Railway

1. **Go to Railway**: https://railway.app
2. **Sign in** with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `square-item-lister` repository
6. Railway will detect it's a Node.js app

### Step 4: Configure Environment Variables in Railway

1. Click on your deployed service
2. Go to **"Variables"** tab
3. Add these variables:

```
PORT=3001
SQUARE_ACCESS_TOKEN=your_square_sandbox_access_token_here
SQUARE_ENVIRONMENT=sandbox
OPENAI_API_KEY=your_openai_api_key_here
CLIENT_URL=*
```

### Step 5: Configure Build Settings

1. In Railway, go to **"Settings"**
2. Set **Root Directory**: `server`
3. Set **Start Command**: `node server.js`
4. Click **"Deploy"**

### Step 6: Get Your Backend URL

1. After deployment, Railway will give you a URL like:
   ```
   https://your-app-name.railway.app
   ```
2. **Copy this URL** - you'll need it for the frontend!
3. Test it: `https://your-app-name.railway.app/api/health`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Build Frontend with Backend URL

```bash
cd /Users/abhiroop/Documents/Goose/square-item-lister/client

# Set the backend URL (replace with your Railway URL)
export VITE_API_URL=https://your-app-name.railway.app/api

# Build
npm run build
```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. Click **"Add New Project"**
4. Select your `square-item-lister` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variable

1. In Vercel project settings
2. Go to **"Environment Variables"**
3. Add:
   ```
   Name: VITE_API_URL
   Value: https://your-app-name.railway.app/api
   ```
   (Use your actual Railway URL)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. Vercel will give you a URL like:
   ```
   https://square-item-lister.vercel.app
   ```

---

## Part 3: Update CORS in Backend

Now that you have your frontend URL, update the backend:

1. Go back to **Railway**
2. Go to **"Variables"**
3. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://square-item-lister.vercel.app
   ```
4. Railway will automatically redeploy

---

## ✅ Testing Your Deployed App

1. **Open your Vercel URL**: `https://square-item-lister.vercel.app`
2. **Try the workflow:**
   - Upload an image
   - Enhance it
   - Generate AI content
   - Create Square listing
3. **Check Square Dashboard** to see the created item!

---

## 🌐 Share Your App

Your app is now live! Share these URLs:

**Public URL**: `https://square-item-lister.vercel.app`

Anyone can:
- Upload product photos
- Get AI-generated titles and descriptions
- Create Square catalog items (using your API keys)

---

## 🔐 Security Note

**Important:** Your API keys are stored securely in Railway's environment variables. They are NOT exposed to users.

However, users will be creating items in YOUR Square account. Consider:

1. **For Public Use:**
   - Keep it in Sandbox mode
   - Monitor usage
   - Set up rate limiting

2. **For Production:**
   - Each user should use their own API keys
   - Add authentication
   - Implement user accounts

---

## 💰 Cost Breakdown

**Railway Free Tier:**
- 500 hours/month
- $5 credit/month
- More than enough for moderate use

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- Custom domain support

**Total:** $0/month for moderate use

---

## 🔄 Updating Your App

When you make changes:

```bash
# Commit changes
git add .
git commit -m "Update feature"
git push

# Railway and Vercel will auto-deploy!
```

---

## 🐛 Troubleshooting

### Backend Issues
- Check Railway logs
- Verify environment variables
- Test health endpoint: `/api/health`

### Frontend Issues
- Check Vercel deployment logs
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors

### CORS Issues
- Make sure `CLIENT_URL` in Railway matches your Vercel URL
- Include the protocol (`https://`)

---

## 🎉 You're Done!

Your app is now live and anyone can use it!

**Next Steps:**
- Share the URL
- Monitor usage in Railway/Vercel dashboards
- Check Square Dashboard for created items
- Consider adding analytics

---

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Your App Health**: Check `/api/health` endpoint

---

**Congratulations! Your AI-powered product listing app is now live!** 🚀
