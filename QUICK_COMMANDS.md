# ⚡ Quick Commands Reference

## 🚀 Start the App

### Terminal 1 - Server
```bash
export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH"
cd /Users/abhiroop/Documents/Goose/square-item-lister/server
npm run dev
```

### Terminal 2 - Client
```bash
export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH"
cd /Users/abhiroop/Documents/Goose/square-item-lister/client
npm run dev
```

### Open Browser
http://localhost:3000

---

## 🛑 Stop the App

Press **Ctrl+C** in both terminal windows

---

## 🧪 Test Commands

### Test Server
```bash
curl http://localhost:3001/api/health
```

### Kill Processes on Ports
```bash
lsof -ti:3001 | xargs kill -9  # Kill server
lsof -ti:3000 | xargs kill -9  # Kill client
```

### Check What's Running
```bash
lsof -i:3001  # Check server port
lsof -i:3000  # Check client port
```

---

## 📁 Project Locations

### Project Root
```bash
cd /Users/abhiroop/Documents/Goose/square-item-lister
```

### Server
```bash
cd /Users/abhiroop/Documents/Goose/square-item-lister/server
```

### Client
```bash
cd /Users/abhiroop/Documents/Goose/square-item-lister/client
```

---

## 🔧 Useful Commands

### Reinstall Dependencies
```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### Check Node/NPM Version
```bash
export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH"
node --version
npm --version
```

### View Server Logs
```bash
cd /Users/abhiroop/Documents/Goose/square-item-lister
tail -f server.log
```

---

## 🌐 URLs

- **Client**: http://localhost:3000
- **Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Square Dashboard**: https://squareup.com/dashboard/items/library

---

## 📚 Documentation Quick Links

- **[EASY_START.md](EASY_START.md)** ⭐ Simplest startup guide
- **[READY_TO_USE.md](READY_TO_USE.md)** - Complete guide
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup
- **[CHECKLIST.md](CHECKLIST.md)** - Step-by-step checklist

---

## 💾 Copy-Paste Aliases (Optional)

Add to `~/.zshrc` or `~/.bashrc`:

```bash
# Square Item Lister Aliases
alias square-server='export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH" && cd /Users/abhiroop/Documents/Goose/square-item-lister/server && npm run dev'
alias square-client='export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH" && cd /Users/abhiroop/Documents/Goose/square-item-lister/client && npm run dev'
alias square-cd='cd /Users/abhiroop/Documents/Goose/square-item-lister'
alias square-kill='lsof -ti:3001 | xargs kill -9 2>/dev/null; lsof -ti:3000 | xargs kill -9 2>/dev/null; echo "Ports cleared"'
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

Use:
```bash
square-server  # Start server
square-client  # Start client
square-cd      # Go to project
square-kill    # Kill all processes
```

---

## 🎯 One-Line Testers

### Quick Server Test
```bash
export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH" && curl http://localhost:3001/api/health
```

### Quick Full Test
```bash
export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH" && cd /Users/abhiroop/Documents/Goose/square-item-lister/server && npm run dev &
sleep 5
curl http://localhost:3001/api/health
```

---

**Keep this file handy for quick reference!** 📌
