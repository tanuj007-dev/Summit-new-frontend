import axios from 'axios';
const baseUrl = 'https://api.summithomeappliance.com/php_controllar/contraollers';
// const baseUrl = 'http://localhost/sumithomeappliances/backend/php_controllar/contraollers';
const axiosInstance = axios.create({
  baseURL: baseUrl, // Change to your actual API
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
  timeout: 10000,
});

export default axiosInstance;
