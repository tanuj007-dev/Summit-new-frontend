# Hostinger Deployment Configuration

## Overview
Updated all API endpoints from localhost (127.0.0.1:8000) to Hostinger Dynamic DNS endpoint.

## Hostinger Configuration
- **Dynamic DNS**: `mediumblue-finch-130496.hostingersite.com`
- **Protocol**: HTTPS (recommended for production)
- **API Base URL**: `https://mediumblue-finch-130496.hostingersite.com`

## Files Updated

### Frontend (React) - Main Directory
1. **src/axiosConfig.js**
   - Line 33: Updated `baseURL` from `http://127.0.0.1:8000` to `https://mediumblue-finch-130496.hostingersite.com`
   - Line 2: Updated commented baseUrl from `http://127.0.0.1:8000` to `https://mediumblue-finch-130496.hostingersite.com`

2. **src/components/Header.jsx**
   - Line 88: Updated search API endpoint from `http://127.0.0.1:8000` to `https://mediumblue-finch-130496.hostingersite.com`

3. **src/components/ExploreMoreCategories.jsx**
   - Line 108: Updated products API endpoint from `http://127.0.0.1:8000` to `https://mediumblue-finch-130496.hostingersite.com`

4. **src/components/productdetails/ProductDetails.jsx**
   - Line 113: Updated product details API endpoint from `http://127.0.0.1:8000` to `https://mediumblue-finch-130496.hostingersite.com`

### Frontend (React) - Duplicate Directory (summit-updated-frontend)
5. **summit-updated-frontend/src/axiosConfig.js**
   - Updated baseURL and commented baseUrl (same as #1)

6. **summit-updated-frontend/src/components/Header.jsx**
   - Updated search API endpoint (same as #2)

7. **summit-updated-frontend/src/components/ExploreMoreCategories.jsx**
   - Updated products API endpoint (same as #3)

8. **summit-updated-frontend/src/components/productdetails/ProductDetails.jsx**
   - Updated product details API endpoint (same as #4)

## API Endpoints Updated
All API calls now point to: `https://mediumblue-finch-130496.hostingersite.com`

### Updated Endpoints:
- `/api/search` - Global search functionality
- `/api/products/view` - Product list view
- `/api/products/view/{product_id}` - Product details
- All authenticated endpoints via JWT

## Notes

### About Database Configuration Files
The following PHP files were identified but NOT updated as they contain LOCAL database configuration:
- `userRegister.php` - Uses local database connection
- `updateUserInfo.php` - Uses local database connection

**These files are for local testing only** and should be handled separately if deployed to production.

### Database Host Configuration
If you need to point to a remote database on Hostinger:
- Update `backend/.env` with your database credentials:
  ```
  DB_HOST=your-hostinger-db-host
  DB_USERNAME=your-hostinger-db-user
  DB_PASSWORD=your-hostinger-db-password
  DB_DATABASE=your-hostinger-db-name
  ```

## Testing the Deployment

1. **Test Search Functionality**
   ```bash
   curl "https://mediumblue-finch-130496.hostingersite.com/api/search?search=pressure"
   ```

2. **Test Product Listing**
   ```bash
   curl "https://mediumblue-finch-130496.hostingersite.com/api/products/view"
   ```

3. **Test Authentication**
   ```bash
   curl -X POST "https://mediumblue-finch-130496.hostingersite.com/api/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

## Deployment Checklist

- [x] Update frontend API endpoints
- [x] Configure HTTPS protocol
- [ ] Test all API calls on production
- [ ] Verify CORS settings if needed
- [ ] Update backend .env for database connection
- [ ] Set up proper SSL certificate
- [ ] Configure environment variables on Hostinger

## Important Notes

1. **HTTPS Usage**: The configuration uses HTTPS. Ensure your Hostinger hosting supports SSL certificates.
2. **CORS**: Verify that your backend is configured to accept requests from the frontend domain.
3. **Token Storage**: JWT tokens are stored in localStorage - ensure this is secure in production.
4. **API Credentials**: Never commit .env files with sensitive credentials to version control.

## Reverting Changes

If you need to revert to localhost for local development, search and replace:
- `https://mediumblue-finch-130496.hostingersite.com` → `http://127.0.0.1:8000`

---
**Last Updated**: December 26, 2025
