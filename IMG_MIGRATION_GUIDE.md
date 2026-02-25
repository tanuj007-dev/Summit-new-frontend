# 🔧 Migration Helper - Replace <img> with S3OptimizedImage

This guide helps you systematically replace `<img>` tags with `<S3OptimizedImage>` components.

---

## 📋 Step 1: Find All Image Tags

### Command to find all `<img>` tags:
```bash
grep -r "<img" src/components src/pages --include="*.jsx"
```

### Expected output:
```
src/components/ProductGrid.jsx:      <img src={imageUrl} alt={product.name} />
src/components/Header.jsx:    <img src={logoUrl} alt="Logo" />
src/components/HeroSlider.jsx:      <img src={bannerUrl} alt={banner.title} />
... (and more)
```

---

## 📝 Step 2: Categorize Images by Type

### Category 1: **Hero/Banner Images** (Priority=true)
```
Components: HeroSlider.jsx, No1Banner.jsx, PromoBanner.jsx
Preset: heroBanner
Priority: true
Quality: 80-85
```

### Category 2: **Product Grid Images** (Lazy load)
```
Components: ProductGrid.jsx, ByPrice.jsx, Available.jsx
Preset: productCard
Priority: false
Quality: 75-80
```

### Category 3: **Product Detail Images** (Higher quality)
```
Components: DetailProduct.jsx
Preset: productGallery
Priority: false
Quality: 85
```

### Category 4: **Blog/Content Images** (Lazy load)
```
Components: AllBlogs.jsx, Blogs.jsx, Gallery.jsx
Preset: blogFeatured or custom
Priority: false
Quality: 80
```

### Category 5: **Avatar/Small Images** (Quick load)
```
Components: UserProfile.jsx, Comments.jsx, Reviews.jsx
Preset: userAvatar
Priority: false
Quality: 70
```

---

## 🔄 Step 3: Replace Images Component by Component

### Template: General Replacement Pattern

**Before:**
```jsx
<img 
  src={imageUrl}
  alt={altText}
  className="w-full h-auto"
  onError={handleError}
/>
```

**After:**
```jsx
<S3OptimizedImage
  s3Key={imageUrl}  // or convert to S3 key format
  alt={altText}
  width={300}       // Required for CLS prevention
  height={300}      // Required for CLS prevention
  className="w-full h-auto"
  preset="productCard"  // Use appropriate preset
  quality={75}      // Optional: override default
  onError={handleError}  // Optional: keep custom handler
/>
```

---

## 💡 Common Replacement Patterns

### Pattern 1: Product Grid Image
**Before:**
```jsx
<img 
  src={product.image} 
  alt={product.name}
  className="w-full object-cover rounded"
/>
```

**After:**
```jsx
<S3OptimizedImage
  s3Key={`products/${product.id}/main.jpg`}
  alt={product.name}
  width={300}
  height={300}
  preset="productCard"
  className="w-full object-cover rounded"
/>
```

### Pattern 2: Product Gallery/Detail
**Before:**
```jsx
<img 
  src={selectedImage} 
  alt="Product gallery"
  className="w-full"
/>
```

**After:**
```jsx
<S3OptimizedImage
  s3Key={`products/${productId}/gallery-${index}.jpg`}
  alt="Product gallery"
  width={600}
  height={600}
  preset="productGallery"
  quality={85}
  className="w-full"
/>
```

### Pattern 3: Hero Banner (LCP)
**Before:**
```jsx
<img 
  src={banner.url} 
  alt={banner.title}
  className="w-full h-96 object-cover"
/>
```

**After:**
```jsx
<S3OptimizedImage
  s3Key={banner.s3Key || `banners/${banner.id}/main.jpg`}
  alt={banner.title}
  width={1920}
  height={600}
  preset="heroBanner"
  priority={true}  // Critical for LCP!
  className="w-full h-96 object-cover"
/>
```

### Pattern 4: Avatar/Small Image
**Before:**
```jsx
<img 
  src={user.avatar} 
  alt={user.name}
  className="w-10 h-10 rounded-full"
/>
```

**After:**
```jsx
<S3OptimizedImage
  s3Key={`users/avatars/${user.id}/avatar.jpg`}
  alt={user.name}
  width={40}
  height={40}
  preset="userAvatar"
  className="w-10 h-10 rounded-full"
/>
```

### Pattern 5: Blog/Article Image
**Before:**
```jsx
<img 
  src={article.featured} 
  alt={article.title}
  className="w-full rounded-lg"
/>
```

**After:**
```jsx
<S3OptimizedImage
  s3Key={`blogs/${article.id}/featured.jpg`}
  alt={article.title}
  width={800}
  height={400}
  preset="blogFeatured"
  className="w-full rounded-lg"
/>
```

---

## 🔑 Converting URLs to S3 Keys

### URL Format Conversion

**If images are currently stored as files:**
```
File: /asset/images/products/123.jpg
S3 Key: products/123/main.jpg
```

**If images are full URLs:**
```
URL: https://s3.amazonaws.com/bucket/products/123/main.jpg
S3 Key: products/123/main.jpg
```

**If images have full paths:**
```
Path: /public/asset/images/product.jpg
S3 Key: products/main.jpg
```

### Helper Function: Convert URLs to S3 Keys
```javascript
// In your utils or as needed
const urlToS3Key = (url) => {
  if (!url) return null;
  
  // Remove domain and bucket
  const key = url
    .replace(/^https?:\/\/[^/]+\//, '')  // Remove domain
    .replace(/^[^/]+\//, '');            // Remove bucket
  
  return key;
};

// Usage
const s3Key = urlToS3Key(imageUrl);
// or
const s3Key = `products/${id}/main.jpg`;
```

---

## 📦 Component Import Setup

### Add to each file you modify:
```jsx
import S3OptimizedImage from '@/components/S3OptimizedImage';
```

### Or create a barrel export for easier imports:
```javascript
// src/components/index.js
export { default as S3OptimizedImage } from './S3OptimizedImage';
export { default as OptimizedImage } from './OptimizedImage';

// Then in any component:
import { S3OptimizedImage } from '@/components';
```

---

## 📋 Component-by-Component Checklist

Create this checklist and check off as you progress:

### Week 1: Hero & LCP Images
- [ ] HeroSlider.jsx
- [ ] Header.jsx (logo)
- [ ] No1Banner.jsx
- [ ] PromoBanner.jsx (if exists)

### Week 2-3: Product Images
- [ ] ProductGrid.jsx
- [ ] ByPrice.jsx
- [ ] Available.jsx
- [ ] DetailProduct.jsx
- [ ] Trends.jsx

### Week 3-4: Content Images
- [ ] AllBlogs.jsx
- [ ] Blogs.jsx
- [ ] Gallery.jsx
- [ ] Feedback.jsx
- [ ] FeedbackProduct.jsx

### Week 4+: Remaining Components
- [ ] Cart.jsx
- [ ] Checkout.jsx
- [ ] AccountsPage.jsx
- [ ] Contact.jsx
- [ ] About.jsx
- [ ] CookerFinder.jsx
- [ ] GasStoveSection.jsx
- [ ] ExploreMoreCategories.jsx
- [ ] Footer.jsx
- [ ] DesktopFooter.jsx
- [ ] Contactus.jsx

---

## 🧪 Testing After Replacement

### Test 1: Visual Check
```
✅ Image renders correctly
✅ No broken/missing images
✅ Dimensions look right (no stretching)
✅ Alt text displays on hover
```

### Test 2: Network Check
```
DevTools → Network → Images
✅ Load from cloudfront.net (not s3.amazonaws.com)
✅ Reasonable file size
✅ Has Cache-Control headers
```

### Test 3: Responsive Check
```
DevTools → Responsive Design Mode
✅ Mobile (375px) - loads small version
✅ Tablet (768px) - loads medium version
✅ Desktop (1920px) - loads large version
```

### Test 4: Error Handling
```
Simulate error:
✅ Placeholder shows gracefully
✅ No console errors
✅ Component doesn't crash
```

### Test 5: Performance
```
DevTools → Lighthouse
✅ LCP improves
✅ CLS reduces
✅ Performance score increases
```

---

## 🚀 Batch Replacement (Advanced)

### Find and Replace in VS Code

**Option 1: Simple find-replace (Limited)**
```
Find: <img src="
Replace: <!-- NEEDS MANUAL REPLACEMENT: IMG TAG -->
```

**Option 2: Regex replace (More control)**
```
Find: <img\s+src=\{?([^}]+)\}?\s+alt=\{?([^}]+)\}?([^/>]*)/>
```
Note: Regex replace won't fully work - manual replacement is safer

### Recommended: Manual replacement with checklist
- More reliable
- Ensures proper S3 key format
- Allows optimization per component
- Reduces bugs and issues

---

## 📝 Tips for Smooth Migration

### Tip 1: Start with High-Traffic Components
1. HeroSlider (homepage banner)
2. ProductGrid (product listings)
3. DetailProduct (product detail page)
→ These give the most performance gain first

### Tip 2: Batch Similar Components
```
All product images → Same preset
All banners → Same preset
All avatars → Same preset
→ Easier to maintain and optimize
```

### Tip 3: Keep Original Images During Migration
```javascript
// Option: Support both formats during migration
const imageUrl = s3Key || originalImageUrl;

<S3OptimizedImage 
  s3Key={imageUrl}
  alt={alt}
  ...
/>
```

### Tip 4: Update S3 Keys Gradually
```javascript
// Phase 1: Keep existing URLs, use S3OptimizedImage
// (will work but slower)

// Phase 2: Migrate to proper S3 key format
// (faster with CloudFront)
```

### Tip 5: Monitor Performance
```javascript
// Track performance gains by component
// Document improvements in commit messages
// Share results with team
```

---

## 🔍 Validation Checklist

After all replacements:

- [ ] Zero `<img>` tags remain (grep confirms)
- [ ] All components import `S3OptimizedImage`
- [ ] All presets match image types
- [ ] Width/height set on all images
- [ ] priority={true} on LCP images only
- [ ] No console errors on page
- [ ] Images load from cloudfront.net
- [ ] Lighthouse score improved
- [ ] All images display correctly
- [ ] Responsive images work
- [ ] Error handling works

---

## ✨ Success Indicators

When you see:
- ✅ All images from cloudfront.net
- ✅ Lighthouse LCP < 1.5s (from 3.5s)
- ✅ Performance score > 85
- ✅ Users report "faster loading"
- ✅ Network tab shows smaller files

**You've successfully migrated to S3 optimization!** 🚀

---

## 📞 Need Help?

1. **Image not loading?**
   → Check s3Key format matches S3 bucket structure

2. **Still loading from S3?**
   → Verify VITE_CLOUDFRONT_DOMAIN in .env.local

3. **Quality too low?**
   → Increase quality prop: `quality={85}`

4. **Layout looks wrong?**
   → Ensure width/height are set correctly

5. **Performance not improving?**
   → CloudFront must be deployed and active

---

Good luck with the migration! You'll have blazing fast images soon! 🚀
