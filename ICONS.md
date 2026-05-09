# PWA Icons

The PWA manifest requires two icon files:
- `frontend/public/icon-192.png` (192x192 pixels)
- `frontend/public/icon-512.png` (512x512 pixels)

## Quick Solution: Use an Emoji

The easiest way to create icons is to use an emoji:

1. Visit https://favicon.io/emoji-favicons/
2. Search for "book" or "Spain flag" emoji
3. Download the generated icons
4. Rename and place:
   - `android-chrome-192x192.png` → `frontend/public/icon-192.png`
   - `android-chrome-512x512.png` → `frontend/public/icon-512.png`

## Alternative: Create Custom Icons

Use any graphic design tool (Figma, Canva, Photoshop) to create:
- 192x192px PNG with transparent background
- 512x512px PNG with transparent background
- Suggested colors: Purple (#4F46E5) for consistency with the app theme

## Temporary Solution

If you want to test the PWA without icons, you can:
1. Create simple solid-color squares in any image editor
2. Save as PNG files at the required sizes
3. Place them in `frontend/public/`

The app will work without icons, but Android won't show an icon when you "Add to Home Screen".
