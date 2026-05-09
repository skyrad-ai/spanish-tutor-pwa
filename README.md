# Spanish Tutor PWA

A mobile-first Progressive Web App for learning Spanish with AI tutoring powered by Claude.

## Features

- **Study Screen**: Photograph textbook pages and get interactive AI tutoring
- **Flashcard Review**: Spaced repetition system for reviewing mistakes
- **Dashboard**: Track your learning progress with streaks and stats

## Tech Stack

- Frontend: React + Vite
- Backend: Express.js
- AI: Anthropic Claude API (claude-sonnet-4-20250514)
- Storage: JSON files (single user)

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Anthropic API key

### Installation

1. Clone and navigate to the project:
   ```bash
   cd spanish-tutor-pwa
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Create environment file for the backend:
   ```bash
   cd backend
   cp .env.example .env
   ```

4. Add your Anthropic API key to `backend/.env`:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

5. (Optional) Add PWA icons:
   - Place 192x192px icon at `frontend/public/icon-192.png`
   - Place 512x512px icon at `frontend/public/icon-512.png`
   - These can be any image representing your app (suggested: Spanish flag or book emoji)

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy API requests to the backend on port 3001.

### Building for Production

```bash
npm run build
```

The build output will be in `frontend/dist/`.

## Deployment to Xpogo

### Option 1: Static Frontend + Backend

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `frontend/dist` folder as a static site on Xpogo

3. Deploy the backend separately and update the frontend to point to the backend URL by modifying `frontend/vite.config.js`:
   ```js
   server: {
     proxy: {
       '/api': {
         target: 'https://your-backend-url.xpogo.com',
         changeOrigin: true
       }
     }
   }
   ```

### Option 2: Combined Deployment

Create a simple server that serves both:

1. Create `server.js` in the root:
   ```js
   import express from 'express';
   import { fileURLToPath } from 'url';
   import path from 'path';

   const app = express();
   const __dirname = path.dirname(fileURLToPath(import.meta.url));

   // Serve static frontend
   app.use(express.static(path.join(__dirname, 'frontend/dist')));

   // API routes (import from backend)
   // ... your backend routes here

   app.listen(process.env.PORT || 3000);
   ```

2. Deploy to Xpogo following their Node.js deployment guide

## PWA Installation

### On iPhone (Safari):

1. Open the app in Safari (must be Safari, not Chrome)
2. Tap the Share button (📤) at the bottom
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" - the app will appear on your home screen

### On Android (Chrome):

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. The app will install and appear on your home screen

The app will work offline after the first visit and can access your camera for photographing textbook pages.

**See IPHONE_SETUP.md for detailed iPhone instructions and troubleshooting.**

## Usage

1. **Study**: Tap the camera button, photograph a textbook page, and start an interactive tutoring session
2. **Review**: Visit the Flashcards screen to review mistakes using spaced repetition
3. **Track Progress**: Check the Dashboard for your streak, due cards, and session history

## Data Storage

All data is stored in JSON files in `backend/data/`:
- `mistakes.json`: Flashcards created from errors
- `sessions.json`: Chat session history
- `stats.json`: User statistics and streak data

## License

MIT
