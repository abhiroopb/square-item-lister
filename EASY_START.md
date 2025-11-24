# 🚀 Easy Start Guide

## The Simplest Way to Run Your App

### Step 1: Open Two Terminals

You'll need two terminal windows open.

---

## Terminal 1 - Start the Server

Copy and paste this entire block:

```bash
export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH"
cd /Users/abhiroop/Documents/Goose/square-item-lister/server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📦 Square Environment: sandbox
🔑 OpenAI API: Configured
🔑 Square API: Configured
```

✅ **Leave this terminal running!**

---

## Terminal 2 - Start the Client

Copy and paste this entire block:

```bash
export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH"
cd /Users/abhiroop/Documents/Goose/square-item-lister/client
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

## Step 2: Open Your Browser

Go to: **http://localhost:3000**

You should see the Square Item Lister app! 🎉

---

## 📸 How to Use

1. **Click "📁 Upload Image"** - Choose a product photo
2. **Click "✨ Enhance Image"** - AI improves the quality
3. **Click "🔍 Generate with AI"** - AI creates title, description, price
4. **Review and edit** - Adjust anything you want
5. **Click "🚀 Create Square Listing"** - Publish to Square!

---

## 🛑 To Stop the App

In each terminal window, press: **Ctrl+C**

---

## ✅ Quick Test

To verify everything works:

**Terminal 1 (Server Test):**
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{"status":"ok","message":"Square Item Lister API is running","environment":"sandbox"}
```

**Terminal 2 (Client Test):**
Open http://localhost:3000 in your browser - you should see the app!

---

## 🐛 Troubleshooting

### "npm: command not found"
Make sure you include the `export PATH=...` line at the start!

### "Port already in use"
Kill existing processes:
```bash
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Server shows errors
Check the server terminal for error messages. Common issues:
- Missing .env file (should be created already)
- Invalid API keys (check the keys are correct)

### Client shows blank page
- Make sure server is running first
- Check browser console (F12) for errors
- Try refreshing the page

---

## 💡 Pro Tip

Create aliases in your `~/.zshrc` or `~/.bashrc`:

```bash
alias square-server='export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH" && cd /Users/abhiroop/Documents/Goose/square-item-lister/server && npm run dev'
alias square-client='export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH" && cd /Users/abhiroop/Documents/Goose/square-item-lister/client && npm run dev'
```

Then you can just run:
- `square-server` in terminal 1
- `square-client` in terminal 2

---

## 🎉 That's It!

Your app is now running. Start creating amazing product listings! 🚀

**Need more help?** Check [READY_TO_USE.md](READY_TO_USE.md) for detailed information.
