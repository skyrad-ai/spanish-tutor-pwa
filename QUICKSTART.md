# Quick Start Guide

Get the Spanish Tutor PWA running in 5 minutes!

## 1. Add Your API Key

Edit `backend/.env` and add your Anthropic API key:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

Get an API key at: https://console.anthropic.com/

## 2. Add PWA Icons (Optional)

For the PWA to install properly on your iPhone, add two icon files:

```bash
# Quick method: Download from https://favicon.io/emoji-favicons/
# Search for "book" emoji, download, then rename:

mv android-chrome-192x192.png frontend/public/icon-192.png
mv android-chrome-512x512.png frontend/public/icon-512.png
```

Or skip this step and add icons later. See ICONS.md for details.

## 3. Run the App

```bash
cd spanish-tutor-pwa
npm run dev
```

This starts both the frontend (http://localhost:5173) and backend (http://localhost:3001).

## 4. Test on Your iPhone

### Option A: Local Network (Development)
1. Find your computer's IP address:
   ```bash
   # On Mac/Linux:
   ifconfig | grep "inet "
   # Look for something like: 192.168.1.XXX
   ```
2. On your iPhone, open Safari and visit: `http://YOUR_IP:5173`
3. Grant camera permissions when prompted

### Option B: Deploy to Xpogo (Production - Recommended)
1. Follow the instructions in DEPLOYMENT.md
2. Visit your Xpogo URL in Safari on your iPhone
3. Install the PWA: Tap Share button (📤) → "Add to Home Screen"

## 5. Try It Out

1. **Study Screen**: Tap the camera button, photograph a Spanish textbook page
2. Claude will analyze the page and start tutoring you
3. Answer the questions in the chat
4. Your mistakes automatically become flashcards

5. **Flashcards Screen**: Review your mistakes with spaced repetition

6. **Dashboard**: Track your learning streak and progress

## Troubleshooting

**"API key not found"**
- Make sure you edited `backend/.env` with a valid key
- Restart the backend server

**Camera not working on iPhone**
- Must use Safari (not Chrome or other browsers)
- On local network: Use HTTPS or your computer's IP address
- If prompted, allow camera access in iOS Settings → Safari → Camera

**Icons not showing**
- The app works fine without icons
- Follow ICONS.md to add them when ready

**Port already in use**
- Backend uses port 3001, frontend uses 5173
- Change in `backend/src/server.js` and `frontend/vite.config.js`

## Next Steps

- Read README.md for full documentation
- Check DEPLOYMENT.md for deploying to Xpogo
- Customize the app styling in `frontend/src/App.css`

Happy learning! 🇪🇸
