# 📦 Square Item Lister

> AI-powered web app that transforms product photos into professional Square catalog listings

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange.svg)](https://openai.com/)
[![Square](https://img.shields.io/badge/Square-API-black.svg)](https://developer.squareup.com/)

## ✨ Features

### 📸 Smart Image Capture
- **Camera Access**: Take photos directly from your device
- **File Upload**: Support for JPG, PNG images
- **Image Enhancement**: Auto-improve quality with AI
- **Before/After Preview**: See the transformation

### 🤖 AI-Powered Content Generation
- **Smart Titles**: GPT-4 Vision analyzes images and creates catchy product names
- **Rich Descriptions**: AI-generated product descriptions with web search context
- **Price Suggestions**: Intelligent pricing recommendations
- **Instant Results**: Generate all content with one click

### 💰 Square Integration
- **Direct Publishing**: Create catalog items in Square with one click
- **Image Upload**: Automatic upload to Square CDN
- **Sandbox Testing**: Safe testing environment
- **Real-time Sync**: Items appear instantly in Square Dashboard

### 🎨 Beautiful UI
- **Mobile-First**: Responsive design works on all devices
- **Intuitive Workflow**: Step-by-step guided process
- **Real-time Feedback**: Loading states, error messages, success notifications
- **Modern Design**: Clean, professional interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Square Developer Account ([Sign up](https://developer.squareup.com/))
- OpenAI API Key ([Get key](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone or navigate to the project
cd square-item-lister

# Install dependencies
cd client && npm install
cd ../server && npm install
```

### Configuration

Create `server/.env`:
```env
PORT=3001
SQUARE_ACCESS_TOKEN=your_square_sandbox_token
SQUARE_ENVIRONMENT=sandbox
OPENAI_API_KEY=your_openai_api_key
```

### Run

**Option 1 - Quick Start Script:**
```bash
./start.sh
```

**Option 2 - Manual Start:**
```bash
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client
cd client && npm run dev
```

Open **http://localhost:3000** in your browser! 🎉

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](SETUP.md)** - Detailed setup with troubleshooting
- **[PROJECT.md](PROJECT.md)** - Architecture and technical details
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guide for making changes
- **[SUMMARY.md](SUMMARY.md)** - Complete build summary

## 🎯 How It Works

1. **📸 Capture** - Take a photo or upload an image
2. **✨ Enhance** - AI improves image quality automatically
3. **🤖 Generate** - AI creates title, description, and suggests price
4. **✏️ Review** - Edit any field as needed
5. **🚀 Publish** - Create listing in Square with one click

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sharp** - Image processing
- **OpenAI SDK** - GPT-4 Vision integration
- **Square SDK** - Catalog API integration
- **Multer** - File upload handling

## 📱 Screenshots

```
┌─────────────────────────────────────┐
│  📦 Square Item Lister              │
│  AI-powered product listing creator │
├─────────────────────────────────────┤
│                                     │
│  📸 Step 1: Capture or Upload       │
│  ┌─────────┐  ┌─────────┐         │
│  │ 📷 Use  │  │ 📁 Upload│         │
│  │ Camera  │  │  Image   │         │
│  └─────────┘  └─────────┘         │
│                                     │
│  ✨ Step 2: Enhance Image           │
│  [Original] → [Enhanced]            │
│                                     │
│  🤖 Step 3: Review & Edit           │
│  Title: [AI-generated title]        │
│  Price: [$XX.XX]                    │
│  Description: [AI description]      │
│                                     │
│  💰 Step 4: Publish to Square       │
│  [🚀 Create Square Listing]         │
└─────────────────────────────────────┘
```

## 🔐 Security

- ✅ Environment variables for API keys
- ✅ File type and size validation
- ✅ Sandbox testing environment
- ✅ CORS configuration
- ✅ Input sanitization
- ✅ No sensitive data in git

## 🧪 Testing

```bash
# Test server health
curl http://localhost:3001/api/health

# Test complete workflow
1. Upload image → Should return image path
2. Enhance image → Should return enhanced path
3. Analyze image → Should return AI-generated content
4. Create listing → Should return Square item ID
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd server
# Set environment variables
# Deploy with npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 🆘 Support

**Need help?**
1. Check [QUICKSTART.md](QUICKSTART.md) for setup
2. Read [SETUP.md](SETUP.md) for troubleshooting
3. Review console logs for errors
4. Verify API keys are correct

**Common Issues:**
- Camera not working? → Try file upload or use HTTPS
- AI not generating? → Check OpenAI API key and credits
- Square creation failing? → Verify Sandbox token
- Server won't start? → Check `.env` file exists

## 🎯 Roadmap

- [ ] Background removal integration (remove.bg)
- [ ] Real web search (Google Custom Search)
- [ ] Batch upload multiple items
- [ ] Image editing tools (crop, rotate)
- [ ] Category auto-detection
- [ ] Multiple images per item
- [ ] Mobile app version
- [ ] Multi-language support

## 🙏 Acknowledgments

- **OpenAI** - GPT-4 Vision API
- **Square** - Catalog API
- **Sharp** - Image processing
- **React** - UI framework
- **Vite** - Build tool

## 📊 Project Stats

- **Lines of Code**: 2,500+
- **Components**: 5 React components
- **API Endpoints**: 5 endpoints
- **Documentation**: 5 comprehensive guides
- **Dependencies**: 20+ packages

---

**Built with ❤️ using React, Node.js, OpenAI, and Square APIs**

[⭐ Star this repo](https://github.com/yourusername/square-item-lister) if you find it useful!
