// API configuration
const getApiUrl = () => {
  // If we're on localhost, use the proxy
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '';
  }
  // Otherwise, use the backend directly on port 3001
  return `http://${window.location.hostname}:3001`;
};

export const API_BASE_URL = getApiUrl();
