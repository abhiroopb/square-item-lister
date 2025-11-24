# 📋 Getting Started Checklist

Use this checklist to get your Square Item Lister up and running!

## ✅ Pre-Setup

- [ ] Node.js 18+ is installed
  - Check: Run `node --version` in terminal
  - If not installed: [Download Node.js](https://nodejs.org/)

- [ ] You have a text editor (VS Code, Sublime, etc.)

- [ ] You have a terminal/command line open

## 🔑 API Keys Setup

### Square Sandbox Token
- [ ] Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
- [ ] Create a new application (or select existing)
- [ ] Click on "Credentials" tab
- [ ] Switch to **Sandbox** mode (toggle at top)
- [ ] Copy "Sandbox Access Token"
- [ ] Save it somewhere safe (you'll need it in a moment)

### OpenAI API Key
- [ ] Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- [ ] Sign in or create account
- [ ] Click "Create new secret key"
- [ ] Give it a name (e.g., "Square Item Lister")
- [ ] Copy the key (you can only see it once!)
- [ ] Save it somewhere safe

## 💻 Installation

- [ ] Navigate to project folder
  ```bash
  cd /Users/abhiroop/Documents/Goose/square-item-lister
  ```

- [ ] Install client dependencies
  ```bash
  cd client
  npm install
  ```
  ✅ Should see "added XX packages"

- [ ] Install server dependencies
  ```bash
  cd ../server
  npm install
  ```
  ✅ Should see "added XX packages"

## ⚙️ Configuration

- [ ] Create `.env` file in server folder
  ```bash
  cd server
  touch .env
  ```

- [ ] Open `.env` file in text editor

- [ ] Add your API keys:
  ```env
  PORT=3001
  SQUARE_ACCESS_TOKEN=paste_your_square_token_here
  SQUARE_ENVIRONMENT=sandbox
  OPENAI_API_KEY=paste_your_openai_key_here
  ```

- [ ] Replace `paste_your_square_token_here` with your actual Square token

- [ ] Replace `paste_your_openai_key_here` with your actual OpenAI key

- [ ] Save the file

## 🚀 Running the App

### Option 1: Quick Start (Recommended)
- [ ] From project root, run:
  ```bash
  ./start.sh
  ```
- [ ] Server should start on port 3001
- [ ] Client should start on port 3000

### Option 2: Manual Start

#### Terminal 1 - Server
- [ ] Open first terminal
- [ ] Navigate to server folder
  ```bash
  cd server
  ```
- [ ] Start server
  ```bash
  npm run dev
  ```
- [ ] Should see:
  ```
  🚀 Server running on http://localhost:3001
  📦 Square Environment: sandbox
  🔑 OpenAI API: Configured
  🔑 Square API: Configured
  ```

#### Terminal 2 - Client
- [ ] Open second terminal
- [ ] Navigate to client folder
  ```bash
  cd client
  ```
- [ ] Start client
  ```bash
  npm run dev
  ```
- [ ] Should see:
  ```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
  ```

## 🧪 Testing

- [ ] Open browser to http://localhost:3000

- [ ] You should see the app with purple gradient background

- [ ] Test image upload:
  - [ ] Click "📁 Upload Image"
  - [ ] Select a product photo
  - [ ] Image should appear in preview

- [ ] Test image enhancement:
  - [ ] Click "✨ Enhance Image"
  - [ ] Should see before/after comparison

- [ ] Test AI generation:
  - [ ] Click "🔍 Generate with AI"
  - [ ] Should see title, description, and price filled in

- [ ] Test Square integration:
  - [ ] Review the generated content
  - [ ] Click "🚀 Create Square Listing"
  - [ ] Should see success message with item ID

- [ ] Verify in Square:
  - [ ] Go to [Square Dashboard](https://squareup.com/dashboard/items/library)
  - [ ] Switch to Sandbox mode
  - [ ] Your item should appear in the list!

## ✅ Success Indicators

You know it's working when:
- ✅ Server shows "Configured" for both APIs
- ✅ Client opens in browser without errors
- ✅ You can upload/capture images
- ✅ Image enhancement works
- ✅ AI generates title and description
- ✅ Square listing is created successfully
- ✅ Item appears in Square Dashboard

## 🐛 Troubleshooting

### Server won't start
- [ ] Check `.env` file exists in `server/` folder
- [ ] Verify API keys are correct (no extra spaces)
- [ ] Make sure port 3001 is not in use
- [ ] Try restarting terminal

### "OpenAI API: Not configured"
- [ ] Check `OPENAI_API_KEY` is in `.env`
- [ ] Verify key is correct
- [ ] Restart server after adding key

### "Square API: Not configured"
- [ ] Check `SQUARE_ACCESS_TOKEN` is in `.env`
- [ ] Verify you're using **Sandbox** token
- [ ] Restart server after adding token

### Camera not working
- [ ] Try using Chrome or Safari
- [ ] Grant camera permissions when prompted
- [ ] Use "Upload Image" instead

### AI generation fails
- [ ] Check OpenAI API key is valid
- [ ] Verify you have credits in OpenAI account
- [ ] Check server console for error messages

### Square creation fails
- [ ] Verify Square token is valid
- [ ] Make sure you're in Sandbox mode
- [ ] Check title and price are filled in
- [ ] Look at server console for errors

## 📚 Next Steps

Once everything is working:
- [ ] Read [PROJECT.md](PROJECT.md) to understand the architecture
- [ ] Read [DEVELOPMENT.md](DEVELOPMENT.md) to learn how to make changes
- [ ] Experiment with different product photos
- [ ] Try editing the AI-generated content
- [ ] Check your Square Dashboard to see all items

## 🎉 You're Done!

Congratulations! You now have a fully functional AI-powered Square item listing app!

**What you can do now:**
- Create professional product listings in seconds
- Let AI do the heavy lifting
- Build your Square catalog faster
- Impress your friends with your new app!

---

Need help? Check [SETUP.md](SETUP.md) for detailed troubleshooting!
