// import axios from 'axios';
// const baseUrl = 'https://api.summithomeappliance.com';
// const axiosInstance = axios.create({
//   baseURL: baseUrl, // Change to your actual API
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, 
//   timeout: 10000,
// });

// axiosInstance.interceptors.request.use((config) => {
//   const url = config.url;
//   if (!url) return config;
//   if (/^https?:\/\//i.test(url)) return config;

//   // Support both '/endpoint.php' and 'endpoint.php' usage.
//   if (url.startsWith('/')) {
//     config.url = `${baseUrl}${url}`;
//   } else {
//     config.url = `${baseUrl}/${url}`;
//   }

//   // baseURL is not needed since we fully rewrite config.url
//   config.baseURL = '';
//   return config;
// });

// export default axiosInstance;
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.summithomeappliance.com",
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

// Handle 401 errors - token might be expired
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      console.warn("Token expired or invalid, clearing localStorage");
      localStorage.removeItem("auth_token");
      // Optionally redirect to login
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


