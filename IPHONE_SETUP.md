# iPhone Setup Guide

This PWA works great on iPhone! Here's what you need to know.

## Installing on iPhone

### From Xpogo (Recommended)
1. Deploy your app to Xpogo (see DEPLOYMENT.md)
2. Open Safari on your iPhone
3. Visit your Xpogo URL (e.g., `https://your-app.xpogo.com`)
4. Tap the Share button (📤 at the bottom)
5. Scroll down and tap "Add to Home Screen"
6. Tap "Add" in the top right
7. The app appears on your home screen like a native app!

### Local Testing (Development)
1. Make sure your iPhone and computer are on the same WiFi
2. On your Mac, find your IP address:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Look for something like: inet 192.168.1.XXX
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. On your iPhone in Safari, visit: `http://YOUR_IP:5173`
5. You can test, but won't be able to "Add to Home Screen" without HTTPS

## iPhone-Specific Features

### Camera Access
- The camera button opens your iPhone's camera directly
- First time: iOS will ask for camera permission
- Works in Safari only (not Chrome or other browsers)
- If camera doesn't work, check: Settings → Safari → Camera → Ask

### Offline Mode
- After first visit, app works without internet
- Study sessions require internet (Claude API calls)
- Flashcard review works offline
- Data syncs when you're back online

### Full-Screen Mode
When installed to home screen:
- Runs in full-screen (no Safari UI)
- Looks and feels like a native app
- Swipe up to return to home screen
- Multitask like any other app

### Status Bar
- Respects iPhone notch/Dynamic Island
- Status bar shows time, battery, signal
- Theme color: Purple (#4F46E5)

## iOS Limitations (vs Android)

1. **Service Worker**: iOS has stricter service worker limits
   - May clear cache after ~1 week of no use
   - Just visit the app again to re-cache

2. **Background Sync**: Not supported on iOS
   - App must be open to sync data
   - Not a problem for this single-user app

3. **Push Notifications**: Not supported for web apps on iOS
   - This app doesn't use them anyway

4. **Installation**: Must use Safari
   - Chrome/Firefox on iOS can't install PWAs
   - This is an Apple limitation

## Troubleshooting

### "Add to Home Screen" option missing
- Make sure you're using Safari (not Chrome)
- Make sure you're on HTTPS (or Xpogo deployment)
- Local IP addresses won't show this option

### Camera not working
1. Make sure you're in Safari, not another browser
2. Check iOS Settings → Safari → Camera → "Ask" or "Allow"
3. Try reloading the page (pull down to refresh)
4. Make sure you're on HTTPS (required for camera on iOS)

### App won't load after installing
- Check your internet connection
- Try removing and re-adding to home screen
- Clear Safari cache: Settings → Safari → Clear History and Website Data

### Keyboard covering input
- The app layout should adjust automatically
- If not, try rotating to landscape and back

### Icons not showing
- Make sure `icon-192.png` exists in `frontend/public/`
- Re-add the app to home screen after adding icons
- See ICONS.md for how to create icons

## Best Practices

1. **Deploy to Xpogo**: Local testing works, but for full PWA features you need HTTPS
2. **Use Safari**: Only Safari supports full PWA features on iOS
3. **Grant Permissions**: Allow camera access when prompted
4. **Stay Updated**: iOS updates sometimes improve PWA support

## Why Safari Only?

Apple restricts PWA features to Safari on iOS:
- Only Safari can "Add to Home Screen" with full PWA features
- Other browsers (Chrome, Firefox) are required to use Safari's web engine on iOS
- This is an Apple policy, not a limitation of this app

## Getting Help

Camera issues: Check iOS settings for Safari camera permissions
Installation issues: Make sure you're using Safari and HTTPS
API errors: Verify your Anthropic API key in the Xpogo environment variables

Enjoy learning Spanish! 🇪🇸📱
