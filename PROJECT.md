# Square Item Lister - Project Documentation

## 🎯 Project Overview

An AI-powered web application that transforms product photos into professional Square catalog listings with auto-generated titles, descriptions, and pricing.

## ✨ Features

### Phase 1 - Core Functionality ✅
- 📸 **Image Capture**: Camera access or file upload
- 🖼️ **Image Preview**: Side-by-side comparison
- 📝 **Manual Entry**: Edit title, price, description
- 💾 **State Management**: React Context API

### Phase 2 - AI Integration ✅
- ✨ **Image Enhancement**: Auto-improve quality with Sharp
- 🤖 **AI Title Generation**: GPT-4 Vision analyzes images
- 📄 **AI Description**: Context-aware product descriptions
- 💰 **Price Suggestions**: AI-powered pricing recommendations
- 🔍 **Web Search**: Product research integration

### Phase 3 - Square Integration ✅
- 🏪 **Square Catalog API**: Create items in Square
- 📤 **Image Upload**: Upload to Square CDN
- 🔐 **Sandbox Testing**: Safe testing environment
- ✅ **Complete Workflow**: End-to-end listing creation

## 🏗️ Architecture

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/          # UI Components
│   │   ├── ImageCapture.jsx    # Camera/upload interface
│   │   ├── ImagePreview.jsx    # Before/after comparison
│   │   ├── ItemForm.jsx        # Title/price/description form
│   │   ├── SquarePublish.jsx   # Final review & publish
│   │   └── StatusBar.jsx       # Loading/error/success states
│   ├── context/
│   │   └── ItemContext.jsx     # Centralized state management
│   ├── services/
│   │   └── api.js              # API client
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Styles
│   └── main.jsx                # Entry point
├── index.html
├── vite.config.js
└── package.json
```

### Backend (Node.js + Express)
```
server/
├── routes/
│   ├── upload.js               # Image upload & AI processing
│   └── square.js               # Square API integration
├── services/
│   ├── ai.js                   # OpenAI GPT-4 Vision integration
│   ├── search.js               # Web search for product info
│   └── square.js               # Square Catalog API client
├── config/
│   └── config.js               # Environment configuration
├── uploads/                    # Temporary image storage
├── server.js                   # Express app
└── package.json
```

## 🔄 Data Flow

1. **Image Upload**
   - User captures/uploads image
   - File sent to `/api/upload`
   - Stored in `server/uploads/`
   - Path returned to client

2. **Image Enhancement**
   - Client sends image path to `/api/upload/enhance`
   - Sharp processes image (resize, normalize, sharpen)
   - Enhanced image saved
   - Enhanced path returned

3. **AI Analysis**
   - Client sends image path to `/api/upload/analyze`
   - Server calls OpenAI GPT-4 Vision API
   - Generates title, description, price
   - Optional web search for context
   - Results returned to client

4. **Square Publishing**
   - Client sends complete item data to `/api/square/create-item`
   - Server uploads image to Square
   - Creates catalog item with image reference
   - Returns Square item ID and URL

## 🛠️ Technology Stack

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool & dev server
- **Axios**: HTTP client
- **Context API**: State management
- **CSS3**: Styling with gradients & animations

### Backend
- **Node.js 18+**: Runtime
- **Express**: Web framework
- **Multer**: File upload handling
- **Sharp**: Image processing
- **OpenAI SDK**: GPT-4 Vision integration
- **Square SDK**: Catalog API integration
- **dotenv**: Environment variables

## 📡 API Endpoints

### Upload Routes (`/api/upload`)
- `POST /` - Upload image file
- `POST /enhance` - Enhance image quality
- `POST /analyze` - AI analysis (title, description, price)

### Square Routes (`/api/square`)
- `POST /create-item` - Create catalog item
- `GET /items` - List catalog items

### Health Check
- `GET /api/health` - Server status

## 🔐 Environment Variables

```env
# Server Configuration
PORT=3001

# Square API
SQUARE_ACCESS_TOKEN=your_sandbox_token
SQUARE_ENVIRONMENT=sandbox

# OpenAI API
OPENAI_API_KEY=your_openai_key
```

## 🎨 UI/UX Design

### Color Scheme
- Primary: Purple gradient (#667eea → #764ba2)
- Success: Green (#28a745)
- Error: Red (#dc3545)
- Secondary: Gray (#6c757d)

### Layout
- **Mobile-first**: Responsive design
- **Progressive disclosure**: Step-by-step workflow
- **Visual feedback**: Loading states, animations
- **Accessibility**: Semantic HTML, ARIA labels

### User Flow
1. Upload/capture image → Preview
2. Enhance image → See before/after
3. Generate AI content → Review/edit
4. Publish to Square → Success confirmation

## 🧪 Testing Checklist

### Frontend
- [ ] Camera access works on mobile
- [ ] File upload accepts jpg/png
- [ ] Image preview displays correctly
- [ ] Form validation works
- [ ] Error messages display properly
- [ ] Success states show correctly
- [ ] Responsive on mobile/tablet/desktop

### Backend
- [ ] Image upload endpoint works
- [ ] Image enhancement processes correctly
- [ ] AI title generation works
- [ ] AI description generation works
- [ ] Price suggestion works
- [ ] Square item creation works
- [ ] Image upload to Square works
- [ ] Error handling works

### Integration
- [ ] End-to-end workflow completes
- [ ] Items appear in Square Dashboard
- [ ] Images display in Square
- [ ] Pricing is correct
- [ ] Descriptions are accurate

## 🚀 Deployment Considerations

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set environment variables for API URL

### Backend Deployment (Railway/Heroku)
1. Set environment variables
2. Ensure `uploads/` directory is writable
3. Configure CORS for frontend domain
4. Use production Square credentials

### Production Checklist
- [ ] Switch to Square Production environment
- [ ] Add remove.bg API for background removal
- [ ] Add Google Custom Search API
- [ ] Set up error monitoring (Sentry)
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Set up SSL/HTTPS
- [ ] Configure CDN for images

## 🔒 Security Considerations

1. **API Keys**: Never commit to git
2. **Input Validation**: Sanitize all user inputs
3. **File Upload**: Limit size and types
4. **CORS**: Configure for specific domains
5. **Rate Limiting**: Prevent abuse
6. **HTTPS**: Required for camera access
7. **Square Sandbox**: Use for testing only

## 📈 Future Enhancements

### Short Term
- [ ] Batch upload multiple items
- [ ] Save drafts locally
- [ ] Export to CSV
- [ ] Category auto-detection
- [ ] Inventory quantity input

### Medium Term
- [ ] Background removal integration (remove.bg)
- [ ] Real web search (Google Custom Search)
- [ ] Multiple image upload per item
- [ ] Image editing tools (crop, rotate)
- [ ] Template system for descriptions

### Long Term
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Integration with other platforms (Shopify, WooCommerce)
- [ ] Analytics dashboard
- [ ] Bulk operations
- [ ] User accounts & saved items

## 🐛 Known Issues

1. **Camera on iOS**: May require HTTPS
2. **Large Images**: May timeout on slow connections
3. **AI Accuracy**: Depends on image quality
4. **Price Suggestions**: May not be accurate for all items

## 📚 Resources

- [Square API Docs](https://developer.squareup.com/docs)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 👥 Support

For issues or questions:
1. Check SETUP.md for configuration help
2. Review console logs for errors
3. Verify API keys are correct
4. Test with Square Sandbox first

---

Built with ❤️ using React, Node.js, OpenAI, and Square APIs
