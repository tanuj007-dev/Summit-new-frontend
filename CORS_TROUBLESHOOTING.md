# CORS Issue Troubleshooting Guide

## Problem
APIs work in Postman but fail in the browser due to CORS (Cross-Origin Resource Sharing) policy.

## Root Cause
Your backend at `api.summithomeappliances.com` is not configured to accept requests from your frontend origin (`localhost:5173` for development or `mediumblue-finch-130496.hostingersite.com` for production).

## Solutions

### Solution 1: Fix Backend CORS Configuration (REQUIRED for Production)

Your backend server needs to add these CORS headers to all API responses:

#### For Development (localhost):
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With
Access-Control-Max-Age: 86400
```

#### For Production:
```
Access-Control-Allow-Origin: https://mediumblue-finch-130496.hostingersite.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With
Access-Control-Max-Age: 86400
```

#### For Both (if your backend supports it):
```
Access-Control-Allow-Origin: http://localhost:5173, https://mediumblue-finch-130496.hostingersite.com
```

Or use a wildcard for development (NOT recommended for production):
```
Access-Control-Allow-Origin: *
```

### Solution 2: Use Vite Proxy (Development Only - Already Configured)

I've updated your `vite.config.js` to use the proxy. This will work for local development only.

**How it works:**
- Instead of calling `https://api.summithomeappliances.com/api/...`
- Call `/api/...` (relative path)
- Vite will proxy it to your backend

**Important:** You need to restart your dev server for this to take effect!

### Solution 3: Update API Calls to Use Relative Paths (For Development)

For the proxy to work, you need to use relative URLs in development. Here's what needs to change:

**Current (won't work with proxy):**
```javascript
axios.get('https://api.summithomeappliances.com/api/products/view')
```

**Should be (works with proxy):**
```javascript
axios.get('/api/products/view')
```

## Immediate Action Required

### Step 1: Restart Dev Server
Stop your current dev server (Ctrl+C) and restart:
```bash
npm run dev
```

### Step 2: Check Browser Console
Open browser DevTools (F12) → Console tab
Look for CORS errors. They should now be gone if the proxy is working.

### Step 3: Backend Configuration (Contact Your Backend Team)
Share these CORS headers with your backend developer:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, Accept
```

## Why Postman Works But Browser Doesn't

Postman doesn't enforce CORS policy because it's not a web browser. Browsers implement CORS as a security feature to prevent malicious websites from making unauthorized requests to your APIs.

## Testing

After restarting the dev server, test one API call:
1. Open browser console (F12)
2. Go to Network tab
3. Try loading a page that makes API calls
4. Check if requests succeed
5. Look for any CORS-related errors

## Production Deployment

For production, you MUST fix the backend CORS configuration. The Vite proxy only works in development.

Contact your backend team and provide them with the production origin:
`https://mediumblue-finch-130496.hostingersite.com`
