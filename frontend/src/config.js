// API configuration
const getApiUrl = () => {
  // If we're on localhost, use the local backend
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  // In production (Vercel), API routes are at /api
  return '';
};

export const API_BASE_URL = getApiUrl();
