# Fix API 500 / CORS for Summit Home Appliances

## Option A: Use the built-in proxy (no backend change)

This project includes **api-proxy.php** so your live site can call the API without CORS:

1. **Build for production:** `npm run build` (uses `.env.production` so all API calls go to `/api-proxy.php/...` on your domain).
2. **Deploy the whole `dist/` folder** to your host (e.g. Hostinger), including **api-proxy.php** in the same folder as **index.html**.
3. Your site (e.g. mediumblue-finch-130496.hostingersite.com) will send API requests to the same origin; the PHP script forwards them to api.summithomeappliance.com. No CORS, no backend changes.

Make sure your hosting runs PHP and that **api-proxy.php** is uploaded and reachable at `https://your-site.com/api-proxy.php`.

---

## Option B: Fix CORS on the backend (api.summithomeappliance.com)

Your APIs work in **Postman** but fail in the **browser** with **CORS errors** and **500** because:

1. **CORS**: Browsers block cross-origin requests unless the API server allows your frontend origin. Postman does not enforce CORS.
2. **500 errors**: Sometimes the server returns 500 when it receives a browser request (e.g. missing CORS headers, or the app crashing when handling the `Origin` header).

## What to do on the backend (api.summithomeappliance.com)

Your API must send these **response headers** for requests from your website:

| Header | Value |
|--------|--------|
| `Access-Control-Allow-Origin` | `https://mediumblue-finch-130496.hostingersite.com` (or `*` for any origin) |
| `Access-Control-Allow-Credentials` | `true` (required because the frontend uses cookies/credentials) |
| `Access-Control-Allow-Methods` | `GET, POST, PUT, PATCH, DELETE, OPTIONS` |
| `Access-Control-Allow-Headers` | `Content-Type, Authorization, Accept` |

And you must **respond to OPTIONS (preflight) requests** with status **204** or **200** and the same headers.

---

### If your API is **Laravel (PHP)**

1. Install CORS package (if not already):
   ```bash
   composer require fruitcake/laravel-cors
   ```
   Or use Laravel 9+ built-in: in `config/cors.php` set:

   ```php
   'paths' => ['api/*', 'getMegaMenu.php', 'products.php', 'php_admin_panel/*', 'products', 'api/admin/*'],
   'allowed_origins' => ['https://mediumblue-finch-130496.hostingersite.com'],
   'allowed_methods' => ['*'],
   'allowed_headers' => ['*'],
   'supports_credentials' => true,
   ```

2. Ensure middleware is applied to your API routes (e.g. in `app/Http/Kernel.php` or route files).

---

### If your API is **plain PHP**

At the top of your entry file (e.g. `index.php` or a shared bootstrap file), before any output:

```php
header('Access-Control-Allow-Origin: https://mediumblue-finch-130496.hostingersite.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
```

---

### If your API is **Node (Express)**

```bash
npm install cors
```

```js
const cors = require('cors');
app.use(cors({
  origin: 'https://mediumblue-finch-130496.hostingersite.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
```

---

### If your API is **Django**

```bash
pip install django-cors-headers
```

In `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # as high as possible
    ...
]
CORS_ALLOWED_ORIGINS = ['https://mediumblue-finch-130496.hostingersite.com']
CORS_ALLOW_CREDENTIALS = True
```

---

## After adding CORS on the backend

1. Deploy the backend changes to **api.summithomeappliance.com**.
2. Clear browser cache or test in incognito.
3. Reload your site at **mediumblue-finch-130496.hostingersite.com** and check the Network tab again.

Once the API sends the correct CORS headers, the browser will allow the responses and the 500s that were caused by CORS/preflight should stop.

---

## Local development (already fixed in this repo)

For **local dev** (`npm run dev`), the app uses a **Vite proxy**: requests go to the same origin (e.g. `/api/...`) and Vite forwards them to `https://api.summithomeappliance.com`. That avoids CORS in the browser while developing. No backend CORS change is required for local dev.
