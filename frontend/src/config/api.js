// Central API configuration
// In development: uses VITE_API_URL from .env.development (http://localhost:8000)
// In production:  uses VITE_API_URL from .env.production (your deployed backend URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_BASE_URL;
