# Deployment Guide for Xpogo

This guide explains how to deploy the Spanish Tutor PWA to Xpogo.

## Prerequisites

1. Xpogo account
2. Anthropic API key (get one at https://console.anthropic.com/)

## Quick Start

1. Push this project to Xpogo:
   ```bash
   cd spanish-tutor-pwa
   # Follow Xpogo's deployment instructions for your account
   ```

2. Set environment variables in Xpogo dashboard:
   - `ANTHROPIC_API_KEY`: Your Claude API key
   - `NODE_ENV`: production

3. The app will build and deploy automatically

## Architecture

The deployment includes:
- **Frontend**: React SPA served as static files from `frontend/dist`
- **Backend**: Express.js API server running on port 3001
- **Storage**: JSON files stored in `backend/data/`

## Environment Variables

Required:
- `ANTHROPIC_API_KEY`: Your Anthropic API key

Optional:
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (default: production)

## PWA Features

The app includes:
- Service worker for offline functionality
- Web manifest for "Add to Home Screen" capability
- Camera API access for photographing textbook pages

### Installing on iPhone

1. Visit your deployed Xpogo URL in **Safari** (must use Safari)
2. Tap the Share button (📤)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. The app will install and work offline

**Note**: On iPhone, you MUST use Safari to install PWAs. Chrome and other browsers don't support "Add to Home Screen" on iOS.

See **IPHONE_SETUP.md** for detailed iPhone instructions.

### Installing on Android

1. Visit your deployed Xpogo URL in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home screen"
4. The app will install and work offline

## Data Persistence

The app stores data in JSON files at `backend/data/`:
- `mistakes.json`: User's flashcard errors
- `sessions.json`: Tutoring session history
- `stats.json`: Learning statistics

**Important**: These files persist on the Xpogo server. If you need to backup or migrate data, download these files from the server.

## Troubleshooting

### Camera not working

On iPhone:
- Must use Safari (Camera API doesn't work in Chrome on iOS)
- HTTPS is required for camera access
- Check iOS Settings → Safari → Camera permissions

On Android:
- Works in Chrome and most modern browsers
- HTTPS is required for camera access
- Check browser permissions for camera access

### API key errors
- Verify `ANTHROPIC_API_KEY` is set in Xpogo environment variables
- Check the API key is valid at https://console.anthropic.com/

### Service worker issues
- Clear browser cache and reload
- Uninstall and reinstall the PWA

## Scaling Considerations

This app is designed for single-user use with JSON file storage. For multi-user deployment, consider:
- Adding user authentication
- Migrating to a database (PostgreSQL, MongoDB)
- Implementing user-specific data isolation

## Support

For issues with:
- Xpogo deployment: Contact Xpogo support
- Claude API: Check https://docs.anthropic.com/
- App bugs: Open an issue in the project repository
