import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'https://api.summithomeappliance.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Ensure credentials are sent with all requests
  config.withCredentials = true;
  return config;
});

// Helper to clean malformed JSON with leading garbage text (e.g. leaked PHP code)
const cleanMalformedData = (data) => {
  if (typeof data === 'string' && (data.includes('[') || data.includes('{'))) {
    try {
      const potentialStarts = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i] === '[' || data[i] === '{') {
          potentialStarts.push(i);
        }
      }

      for (let i = potentialStarts.length - 1; i >= 0; i--) {
        const startIdx = potentialStarts[i];
        const potentialJson = data.substring(startIdx);
        try {
          const parsed = JSON.parse(potentialJson);
          if (parsed) return parsed;
        } catch (e) {
          // Continue to next start
        }
      }
    } catch (e) {
      console.debug("Failed to clean malformed data", e);
    }
  }
  return data;
};

// Handle responses
axiosInstance.interceptors.response.use(
  (response) => {
    response.data = cleanMalformedData(response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      error.response.data = cleanMalformedData(error.response.data);
    }
    
    if (error.response?.status === 401) {
      console.warn("Token expired or invalid, clearing localStorage");
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
