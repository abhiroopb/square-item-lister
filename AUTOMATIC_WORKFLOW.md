# Automatic Workflow Guide

## 🎯 New Streamlined Experience

### What Happens Automatically

When you upload or capture an image, the app now **automatically**:

1. ✅ **Uploads** the image to the server
2. ✅ **Removes background** (hands, clutter, etc.) using remove.bg API
3. ✅ **Adds white background** for studio quality look
4. ✅ **Enhances** with professional lighting and sharpness
5. ✅ **Generates** title, description, and price using AI
6. ✅ **Displays** the studio-quality image and details

### User Actions

**Upload Image:**
- Click "📷 Use Camera" or "📁 Upload Image"
- Wait for automatic processing (15-30 seconds)
- Review the studio-quality result

**Regenerate:**
- Click "🔄 Regenerate" button to re-process
- Useful if you want different AI suggestions
- Re-runs enhancement + AI analysis

**Edit Details:**
- Manually edit title, price, or description
- Changes are saved in real-time

**Publish:**
- Click "🚀 Create Square Listing"
- Item is published to your Square catalog

---

## 🔧 Background Removal Setup (Optional)

For **professional background removal**, add remove.bg API key to Railway:

### Get API Key
1. Go to https://www.remove.bg/api
2. Sign up for free account (50 free API calls/month)
3. Copy your API key

### Add to Railway
1. Go to your Railway project
2. Click on your service
3. Go to "Variables" tab
4. Add new variable:
   - **Name:** `REMOVE_BG_API_KEY`
   - **Value:** Your remove.bg API key
5. Redeploy

### Without API Key
- App still works perfectly!
- Uses basic enhancement (resize, sharpen, white background)
- No background removal, but still looks professional

---

## 📊 Processing Time

- **With remove.bg:** 15-30 seconds
- **Without remove.bg:** 5-10 seconds

---

## 🎨 Studio Quality Features

### With Background Removal (remove.bg)
- ✅ Removes hands holding items
- ✅ Removes cluttered backgrounds
- ✅ Removes shadows and reflections
- ✅ Clean white background
- ✅ Professional product photo look

### Without Background Removal (Fallback)
- ✅ Resizes to optimal dimensions
- ✅ Enhances brightness/contrast
- ✅ Sharpens image
- ✅ Adds white background overlay
- ✅ Professional lighting adjustments

---

## 🚀 Deployment Status

- **Frontend:** https://square-item-lister.vercel.app/
- **Backend:** https://square-item-generator.up.railway.app/

Both will auto-deploy in 1-2 minutes after pushing to GitHub.

---

## 💡 Tips

1. **Best Results:** Take photos with good lighting and minimal background clutter
2. **Multiple Attempts:** Use "Regenerate" if first result isn't perfect
3. **Manual Edits:** Always review and edit AI-generated content before publishing
4. **Background Removal:** Add remove.bg API key for best quality (optional)

---

## 🐛 Troubleshooting

**Processing takes too long:**
- Check your internet connection
- Remove.bg API might be slow (fallback will kick in after timeout)

**Background not removed:**
- Check if REMOVE_BG_API_KEY is set in Railway
- Verify API key is valid and has remaining credits
- App will use fallback enhancement automatically

**AI not generating details:**
- Verify OpenAI API key is entered in Settings
- Check Railway logs for errors
- Try regenerating

---

## 📝 Environment Variables

### Railway (Backend)
```
PORT=3001
SQUARE_ACCESS_TOKEN=<your_sandbox_token>
SQUARE_ENVIRONMENT=sandbox
OPENAI_API_KEY=<your_openai_key>
CLIENT_URL=https://square-item-lister.vercel.app
REMOVE_BG_API_KEY=<optional_remove_bg_key>
```

### Vercel (Frontend)
```
VITE_API_URL=https://square-item-generator.up.railway.app/api
```
