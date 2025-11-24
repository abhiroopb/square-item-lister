# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get API Keys (2 minutes)

**Square Sandbox Token:**
1. Go to https://developer.squareup.com/apps
2. Create/select app → Credentials → Switch to Sandbox
3. Copy "Sandbox Access Token"

**OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create new key
3. Copy the key

### Step 2: Configure (1 minute)

Create `server/.env`:
```bash
PORT=3001
SQUARE_ACCESS_TOKEN=paste_your_square_token_here
SQUARE_ENVIRONMENT=sandbox
OPENAI_API_KEY=paste_your_openai_key_here
```

### Step 3: Run (2 minutes)

**Option A - Use the start script:**
```bash
./start.sh
```

**Option B - Manual start:**

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

### Step 4: Use the App

1. Open http://localhost:3000
2. Upload a product photo
3. Click "Enhance Image"
4. Click "Generate with AI"
5. Review and edit
6. Click "Create Square Listing"
7. Done! 🎉

## 📋 Checklist

- [ ] Node.js 18+ installed
- [ ] Square Developer account created
- [ ] OpenAI API key obtained
- [ ] Dependencies installed (`npm install` in both folders)
- [ ] `.env` file created with API keys
- [ ] Server running on port 3001
- [ ] Client running on port 3000
- [ ] Camera/upload working
- [ ] AI generation working
- [ ] Square listing created successfully

## 🆘 Quick Troubleshooting

**Server won't start:**
- Check `.env` file exists in `server/` folder
- Verify API keys are correct
- Make sure port 3001 is not in use

**AI not working:**
- Verify OpenAI API key is valid
- Check you have credits in OpenAI account
- Look at server console for errors

**Square creation fails:**
- Use Sandbox token, not Production
- Verify token is correct
- Check Square Dashboard for errors

**Camera not working:**
- Use Chrome/Safari (not all browsers support camera)
- Grant camera permissions
- Try "Upload Image" instead

## 📖 Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup
- Read [PROJECT.md](PROJECT.md) for architecture details
- Check [README.md](README.md) for feature overview

## 🎯 Test It Works

1. Upload any product photo
2. Should see enhanced version
3. Should get AI-generated title/description
4. Should create item in Square Sandbox
5. Check https://squareup.com/dashboard/items/library

Success! You're ready to create listings! 🚀
