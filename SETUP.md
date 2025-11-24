# Setup Guide

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Square Developer Account** - [Sign up](https://developer.squareup.com/)
3. **OpenAI API Key** - [Get key](https://platform.openai.com/api-keys)

## Step 1: Square Sandbox Setup

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create a new application or select existing one
3. Go to "Credentials" tab
4. Switch to **Sandbox** mode
5. Copy your **Sandbox Access Token**

## Step 2: OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (you won't be able to see it again!)

## Step 3: Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

## Step 4: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env
```

Add the following to `.env`:

```env
PORT=3001
SQUARE_ACCESS_TOKEN=your_sandbox_access_token_here
SQUARE_ENVIRONMENT=sandbox
OPENAI_API_KEY=your_openai_api_key_here
```

**Important:** Replace the placeholder values with your actual tokens!

## Step 5: Run the Application

Open two terminal windows:

**Terminal 1 - Start the server:**
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📦 Square Environment: sandbox
🔑 OpenAI API: Configured
🔑 Square API: Configured
```

**Terminal 2 - Start the client:**
```bash
cd client
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 6: Test the Application

1. Open your browser to `http://localhost:3000`
2. Click "Upload Image" or "Use Camera"
3. Upload a product photo
4. Click "Enhance Image"
5. Click "Generate with AI" to auto-fill title/description
6. Review and edit as needed
7. Click "Create Square Listing"
8. Check your [Square Dashboard](https://squareup.com/dashboard/items/library) to see the new item!

## Troubleshooting

### "OpenAI API: Not configured"
- Make sure you added `OPENAI_API_KEY` to `.env`
- Restart the server after adding environment variables

### "Square API: Not configured"
- Make sure you added `SQUARE_ACCESS_TOKEN` to `.env`
- Verify you're using the **Sandbox** token, not Production
- Restart the server

### Camera not working
- Make sure you're using HTTPS or localhost
- Grant camera permissions in your browser
- Try using "Upload Image" instead

### Image upload fails
- Check file size (max 10MB)
- Ensure file is .jpg, .jpeg, or .png
- Check server console for errors

### AI generation fails
- Verify OpenAI API key is valid
- Check you have credits in your OpenAI account
- Look at server console for detailed error messages

### Square item creation fails
- Verify Square access token is valid
- Make sure you're in Sandbox mode
- Check that title and price are filled in
- Look at server console for Square API errors

## Next Steps

### For Production Use:

1. **Get Production Square Credentials:**
   - Switch to Production in Square Dashboard
   - Get Production Access Token
   - Update `.env` with: `SQUARE_ENVIRONMENT=production`

2. **Add Background Removal:**
   - Sign up for [remove.bg API](https://www.remove.bg/api)
   - Update `server/services/ai.js` to integrate remove.bg

3. **Add Real Web Search:**
   - Sign up for [Google Custom Search API](https://developers.google.com/custom-search/v1/overview)
   - Update `server/services/search.js` to use real search

4. **Deploy:**
   - Deploy server to a hosting service (Heroku, Railway, etc.)
   - Deploy client to Vercel, Netlify, or similar
   - Update API endpoints in client

## Support

If you encounter issues:
1. Check the console logs (both browser and server)
2. Verify all environment variables are set correctly
3. Make sure all dependencies are installed
4. Try restarting both server and client

## Security Notes

- Never commit `.env` file to git
- Keep your API keys secret
- Use Sandbox for testing
- Only switch to Production when ready
