# 🚀 Deploy Your App Now!

## ⏱️ Total Time: ~15 minutes

Your app is ready to deploy! Follow these simple steps to make it live.

---

## 🎯 What You'll Get

After deployment, anyone can visit your URL and:
- ✅ Upload product photos
- ✅ Get AI-enhanced images
- ✅ Generate titles and descriptions with AI
- ✅ Create Square catalog items

**Cost:** $0 (using free tiers)

---

## 📋 What You Need

1. ✅ GitHub account (free) - [Sign up](https://github.com/join)
2. ✅ Railway account (free) - [Sign up](https://railway.app)
3. ✅ Vercel account (free) - [Sign up](https://vercel.com/signup)

---

## 🚀 Quick Deploy (3 Steps)

### **Step 1: Push to GitHub** (5 min)

Open terminal and run:

```bash
cd /Users/abhiroop/Documents/Goose/square-item-lister

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Square Item Lister"

# Create repo on GitHub first, then:
# (Replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/square-item-lister.git

# Push
git push -u origin main
```

✅ **Done!** Your code is on GitHub.

---

### **Step 2: Deploy Backend** (5 min)

1. Go to **Railway**: https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `square-item-lister` repository
4. Click on the deployed service
5. Go to **"Settings"** → Set **Root Directory**: `server`
6. Go to **"Variables"** → Click **"New Variable"** and add:

```
PORT=3001
SQUARE_ACCESS_TOKEN=your_square_sandbox_token
SQUARE_ENVIRONMENT=sandbox
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=*
```

**Note:** Use your actual API keys from earlier in this conversation.

7. Railway will deploy automatically
8. **Copy your Railway URL** (e.g., `https://your-app-production.up.railway.app`)

✅ **Done!** Your backend is live.

---

### **Step 3: Deploy Frontend** (5 min)

1. Go to **Vercel**: https://vercel.com
2. Click **"Add New Project"**
3. Select your `square-item-lister` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Environment Variables"** → Add:
   ```
   VITE_API_URL=https://your-railway-url.railway.app/api
   ```
   (Use your actual Railway URL from Step 2)
6. Click **"Deploy"**
7. Wait 1-2 minutes
8. **Copy your Vercel URL** (e.g., `https://square-item-lister.vercel.app`)

✅ **Done!** Your frontend is live.

---

### **Step 4: Update CORS** (1 min)

1. Go back to **Railway**
2. Go to **"Variables"**
3. Find `CLIENT_URL` and change it to your Vercel URL:
   ```
   CLIENT_URL=https://square-item-lister.vercel.app
   ```
4. Railway will auto-redeploy

✅ **Done!** Everything is connected.

---

## 🎉 Your App is Live!

**Visit:** `https://square-item-lister.vercel.app`

**Test it:**
1. Upload a product photo
2. Click "Enhance Image"
3. Click "Generate with AI"
4. Click "Create Square Listing"
5. Check your Square Dashboard!

---

## 📤 Share Your App

Send this URL to anyone:
```
https://square-item-lister.vercel.app
```

They can use it to create AI-powered product listings!

---

## 🔄 Making Updates

When you want to update your app:

```bash
cd /Users/abhiroop/Documents/Goose/square-item-lister
git add .
git commit -m "Your update message"
git push
```

Railway and Vercel will automatically deploy your changes! 🚀

---

## 🆘 Need Help?

**Check these:**
- Backend health: `https://your-railway-url.railway.app/api/health`
- Railway logs: Railway dashboard → "Deployments" tab
- Vercel logs: Vercel dashboard → "Deployments" tab

**Common issues:**
- **CORS errors**: Make sure `CLIENT_URL` in Railway matches your Vercel URL
- **API not working**: Check Railway environment variables are set
- **Build fails**: Check Vercel build logs

---

## 📚 Full Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Detailed guide
- **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** - Step-by-step checklist

---

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Vercel (free!)
2. **Monitor Usage**: Check Railway/Vercel dashboards
3. **Analytics**: Add Google Analytics to track visitors
4. **Rate Limiting**: Consider adding if you get lots of traffic

---

**Ready? Let's deploy!** 🚀

Start with Step 1 above! ⬆️
