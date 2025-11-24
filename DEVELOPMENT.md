# Development Guide

## 🛠️ Making Changes to the App

### Adding New Features

#### 1. Add a New Form Field

**Frontend (client/src/components/ItemForm.jsx):**
```jsx
// Add to the form
<div className="form-group">
  <label htmlFor="category">Category</label>
  <select
    id="category"
    value={item.category}
    onChange={(e) => handleChange('category', e.target.value)}
  >
    <option value="">Select category</option>
    <option value="electronics">Electronics</option>
    <option value="clothing">Clothing</option>
  </select>
</div>
```

**Context (client/src/context/ItemContext.jsx):**
```jsx
// Add to initial state
const [item, setItem] = useState({
  // ... existing fields
  category: '',
});
```

**Backend (server/services/square.js):**
```jsx
// Add to catalog object
itemData: {
  // ... existing fields
  categoryId: itemData.category,
}
```

#### 2. Add a New AI Feature

**Backend (server/services/ai.js):**
```javascript
export async function generateTags(imagePath) {
  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Generate 5 tags for this product' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` }}
      ]
    }]
  });
  
  return response.choices[0].message.content.split(',').map(t => t.trim());
}
```

**Route (server/routes/upload.js):**
```javascript
router.post('/generate-tags', async (req, res) => {
  const { imagePath } = req.body;
  const tags = await generateTags(imagePath);
  res.json({ success: true, tags });
});
```

**Frontend Service (client/src/services/api.js):**
```javascript
generateTags: async (imagePath) => {
  const response = await axios.post(`${API_BASE}/upload/generate-tags`, { imagePath });
  return response.data;
}
```

#### 3. Add Background Removal (remove.bg)

**Install dependency:**
```bash
cd server
npm install remove.bg
```

**Update ai.js:**
```javascript
import RemoveBg from 'remove.bg';

export async function removeBackground(imagePath) {
  const removeBg = new RemoveBg(process.env.REMOVEBG_API_KEY);
  
  const outputPath = imagePath.replace(/(\.\w+)$/, '-nobg$1');
  
  await removeBg.removeBackgroundFromFile({
    path: imagePath,
    destination: outputPath,
    size: 'regular'
  });
  
  return { success: true, enhancedPath: outputPath };
}
```

**Add to .env:**
```
REMOVEBG_API_KEY=your_key_here
```

### Modifying Existing Features

#### Change AI Model

**In server/services/ai.js:**
```javascript
// Change from gpt-4o to gpt-4-turbo
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',  // Changed
  // ... rest of config
});
```

#### Adjust Image Enhancement

**In server/services/ai.js:**
```javascript
await sharp(imagePath)
  .resize(1600, 1600, {  // Increase size
    fit: 'inside',
    withoutEnlargement: true 
  })
  .modulate({
    brightness: 1.1,  // Add brightness boost
    saturation: 1.2   // Add saturation boost
  })
  .sharpen({ sigma: 2 })  // More aggressive sharpening
  .toFile(enhancedPath);
```

#### Customize UI Styling

**In client/src/App.css:**
```css
/* Change primary color */
.btn-primary {
  background: #ff6b6b;  /* New red color */
  color: white;
}

/* Change gradient */
body {
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
}
```

### Testing Changes

#### Test Backend Changes
```bash
cd server
npm run dev

# In another terminal, test with curl
curl -X POST http://localhost:3001/api/health
```

#### Test Frontend Changes
```bash
cd client
npm run dev

# Open browser to http://localhost:3000
# Check browser console for errors
```

#### Test Full Workflow
1. Upload image
2. Enhance image
3. Generate AI content
4. Create Square listing
5. Verify in Square Dashboard

### Debugging

#### Backend Debugging

**Add console logs:**
```javascript
console.log('Image path:', imagePath);
console.log('AI result:', result);
```

**Check server logs:**
```bash
# Server terminal will show all logs
```

#### Frontend Debugging

**Add console logs:**
```javascript
console.log('Item state:', item);
console.log('API response:', response);
```

**Check browser console:**
- Open DevTools (F12)
- Go to Console tab
- Look for errors or logs

**Check Network tab:**
- See all API requests
- Check request/response data
- Look for failed requests

### Common Modifications

#### 1. Change Upload File Size Limit

**In server/routes/upload.js:**
```javascript
const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB instead of 10MB
});
```

#### 2. Add More Image Formats

**In server/routes/upload.js:**
```javascript
fileFilter: (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;  // Added gif and webp
  // ... rest of code
}
```

#### 3. Change Default Price

**In client/src/context/ItemContext.jsx:**
```javascript
const [item, setItem] = useState({
  // ... other fields
  price: 9.99,  // Default to $9.99 instead of 0
});
```

#### 4. Add Validation

**In client/src/components/ItemForm.jsx:**
```javascript
const validateForm = () => {
  if (!item.title || item.title.length < 3) {
    setError('Title must be at least 3 characters');
    return false;
  }
  if (item.price <= 0) {
    setError('Price must be greater than 0');
    return false;
  }
  return true;
};
```

### Project Structure Reference

```
Key Files to Modify:
├── client/src/
│   ├── components/        # UI changes
│   ├── context/          # State changes
│   ├── services/api.js   # API calls
│   └── App.css          # Styling
├── server/
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   │   ├── ai.js       # AI features
│   │   ├── square.js   # Square integration
│   │   └── search.js   # Web search
│   └── config/config.js # Configuration
```

### Best Practices

1. **Always test locally first**
2. **Use meaningful variable names**
3. **Add error handling**
4. **Log important steps**
5. **Keep functions small and focused**
6. **Update documentation**
7. **Test edge cases**
8. **Handle loading states**
9. **Provide user feedback**
10. **Clean up temporary files**

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/add-tags

# Make changes
# ... edit files ...

# Test changes
npm run dev

# Commit changes
git add .
git commit -m "Add tag generation feature"

# Push to remote
git push origin feature/add-tags

# Create pull request on GitHub
```

### Performance Optimization

#### 1. Lazy Load Components
```javascript
import { lazy, Suspense } from 'react';

const ImagePreview = lazy(() => import('./components/ImagePreview'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <ImagePreview />
</Suspense>
```

#### 2. Debounce API Calls
```javascript
import { debounce } from 'lodash';

const debouncedAnalyze = debounce(analyzeImage, 1000);
```

#### 3. Cache API Responses
```javascript
const cache = new Map();

export const api = {
  analyzeImage: async (imagePath) => {
    if (cache.has(imagePath)) {
      return cache.get(imagePath);
    }
    const result = await axios.post(...);
    cache.set(imagePath, result.data);
    return result.data;
  }
};
```

### Security Checklist

- [ ] Validate all user inputs
- [ ] Sanitize file names
- [ ] Check file types
- [ ] Limit file sizes
- [ ] Use environment variables for secrets
- [ ] Add rate limiting
- [ ] Implement CORS properly
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Never log sensitive data

### Deployment

#### Build for Production

**Client:**
```bash
cd client
npm run build
# Deploy dist/ folder
```

**Server:**
```bash
cd server
# Set NODE_ENV=production
# Set all environment variables
npm start
```

### Getting Help

- Check console logs (browser & server)
- Review error messages carefully
- Search for similar issues online
- Check API documentation
- Test with minimal example
- Ask for help with specific error messages

---

Happy coding! 🚀
