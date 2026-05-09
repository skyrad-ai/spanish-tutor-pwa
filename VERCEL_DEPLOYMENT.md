# Deploy Spanish Tutor PWA to Vercel

This guide will help you deploy your Spanish Tutor app to Vercel so it's accessible from anywhere in the world.

## Prerequisites

- GitHub account
- Anthropic API key (from https://console.anthropic.com/)

## Step 1: Prepare the Repository

The project is already configured for Vercel deployment. You just need to:

1. **Commit all files to git:**
   ```bash
   cd ~/spanish-tutor-pwa
   git add .
   git commit -m "Prepare for Vercel deployment"
   ```

2. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Create a new repository (name it `spanish-tutor-pwa`)
   - Don't initialize with README (you already have one)

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/spanish-tutor-pwa.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

## Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com/signup
   - Click "Continue with GitHub"
   - Authorize Vercel to access your GitHub account

2. **Import your project:**
   - Click "Add New..." → "Project"
   - Find and select your `spanish-tutor-pwa` repository
   - Click "Import"

3. **Configure the project:**
   - **Framework Preset:** Leave as detected (Vite)
   - **Root Directory:** Leave as `./`
   - **Build Command:** `npm run build:all`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** Leave default

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** Your Anthropic API key (from https://console.anthropic.com/)
   - **Environment:** All (Production, Preview, Development)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment to complete

## Step 3: Test Your Deployment

1. Once deployed, Vercel will show you a URL like: `https://spanish-tutor-pwa.vercel.app`
2. Click the URL to test your app
3. Try:
   - Opening the app
   - Uploading a textbook image
   - Having a conversation with the tutor

## Step 4: Install on Your Phone

### iPhone (Safari only):
1. Open Safari and go to your Vercel URL
2. Tap the Share button (📤)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. The app icon will appear on your home screen

### Android (Chrome):
1. Open Chrome and go to your Vercel URL
2. Tap the menu (⋮)
3. Select "Add to Home screen"
4. The app icon will appear on your home screen

## Using the App in Mexico (or anywhere!)

Once deployed to Vercel:
- ✅ Works from anywhere in the world
- ✅ Your computer can be off
- ✅ Fast loading thanks to Vercel's global CDN
- ✅ Free hosting (Vercel's free tier is generous)

## Troubleshooting

### API Key Errors
- Go to your Vercel dashboard
- Click on your project → Settings → Environment Variables
- Verify `ANTHROPIC_API_KEY` is set correctly
- Redeploy: Deployments → ⋮ → Redeploy

### Deployment Fails
- Check the build logs in Vercel dashboard
- Common issues:
  - Missing dependencies (check package.json)
  - Environment variables not set
  - Build command errors

### Camera Not Working
- Camera requires HTTPS (Vercel provides this automatically)
- On iPhone, must use Safari (not Chrome)
- Check browser permissions for camera access

## Data Persistence

**Important:** Vercel's serverless functions are stateless. Each request may run on a different server.

For production use, you should:
1. Use a database (PostgreSQL, MongoDB) instead of JSON files
2. Or use Vercel's storage options:
   - Vercel KV (Redis)
   - Vercel Postgres
   - External storage like Supabase

The current JSON file approach will work for testing but data may not persist reliably.

## Custom Domain (Optional)

Want to use your own domain like `spanish.yourdomain.com`?

1. Go to Vercel dashboard → your project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Vercel will automatically provision SSL/HTTPS

## Updating Your App

When you make changes:
1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update app"
   git push
   ```
2. Vercel will automatically redeploy (takes ~2 minutes)

## Support

- Vercel Docs: https://vercel.com/docs
- Anthropic API Docs: https://docs.anthropic.com/
- Vercel Support: https://vercel.com/support

## Costs

- **Vercel Free Tier:**
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Perfect for personal projects

- **Anthropic API:**
  - Pay per use
  - Claude Sonnet 4 costs approximately:
    - $3 per million input tokens
    - $15 per million output tokens
  - Typical tutoring session: $0.01-0.05

## Next Steps

Consider:
1. Adding user authentication
2. Migrating to a proper database
3. Adding analytics to track usage
4. Custom domain for easier sharing

Your app is now live and accessible from anywhere! 🎉
