// import axios from 'axios';
// const baseUrl = 'http://127.0.0.1:8000';
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
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true, // 🔥 VERY IMPORTANT
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default axiosInstance;


