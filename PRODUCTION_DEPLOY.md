# Production deploy (fix CORS / 500 on live site)

To stop CORS and 500 errors on **mediumblue-finch-130496.hostingersite.com**, use the same-origin proxy.

## Steps

1. **Build**
   ```bash
   npm run build
   ```
   This uses `.env.production`, so the app will call `/api-proxy.php/...` on your own domain instead of `api.summithomeappliance.com` directly.

2. **Upload the whole `dist/` folder** to your Hostinger site (same place as your current site), so that:
   - `dist/index.html` is your main page
   - `dist/api-proxy.php` is in the **same directory** as `index.html`

3. **Confirm PHP**  
   Your host must run PHP so `api-proxy.php` can forward requests to api.summithomeappliance.com.

4. **Test**  
   Open your site in the browser; API calls should go to your domain and no longer show CORS or 500 from cross-origin.

## If you don’t use the proxy

If you prefer not to use the proxy, you must add CORS headers on **api.summithomeappliance.com** as described in **BACKEND_CORS_SETUP.md**, and then build with the real API URL (e.g. use `.env` without `.env.production`, or set `VITE_APP_API_BASE_URL=https://api.summithomeappliance.com` in production).
