/**
 * IMAGE OPTIMIZATION IMPLEMENTATION GUIDE
 * 
 * Quick-start examples for common components in your app.
 * Copy these patterns directly into your components.
 */

// ============================================
// 1. HEADER/LOGO IMAGES (Navigation)
// ============================================

// BEFORE:
// <img src="/asset/images/Logo.png" alt="Summit" className="size-12" />

// AFTER:
import OptimizedImage from './OptimizedImage';

export function HeaderLogo() {
  return (
    <OptimizedImage
      src="/asset/images/Logo.png"
      alt="Summit"
      width={48}
      height={48}
      className="size-12 rounded-full"
      priority={true}  // In header, loads immediately
    />
  );
}

// ============================================
// 2. HERO BANNER (Above-fold, LCP critical)
// ============================================

// BEFORE:
// <img src={bannerImage} alt="Hero" className="w-full h-96" />

// AFTER:
export function HeroBanner({ imageUrl }) {
  return (
    <div className="w-full h-96 overflow-hidden">
      <OptimizedImage
        src={imageUrl}
        alt="Welcome to Summit"
        width={1920}
        height={600}
        priority={true}  // ← Critical! This is above-fold
        className="w-full h-full object-cover"
        sizes="100vw"
      />
    </div>
  );
}

// ============================================
// 3. PRODUCT GRID CARDS (Lazy loaded)
// ============================================

// BEFORE:
// <img src={product.image} alt={product.name} />

// AFTER:
export function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-square bg-gray-100">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          placeholder="/asset/images/dummy-image-square.jpg"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </div>
    </div>
  );
}

// ============================================
// 4. SEARCH RESULT IMAGES (Thumbnails)
// ============================================

// BEFORE:
// <img src={item.image} alt={item.name} className="w-16 h-16" />

// AFTER:
export function SearchResult({ item }) {
  return (
    <div className="flex gap-3 p-2 rounded hover:bg-gray-50">
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
        <OptimizedImage
          src={item.image || '/asset/images/dummy-image-square.jpg'}
          alt={item.name}
          width={64}
          height={64}
          className="w-full h-full object-cover rounded"
          sizes="64px"
        />
      </div>
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-gray-600">{item.price}</p>
      </div>
    </div>
  );
}

// ============================================
// 5. GALLERY / CAROUSEL (Lazy with thumbnails)
// ============================================

// BEFORE:
// <img src={images[activeIndex]} alt="Gallery" />

// AFTER:
export function ImageGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image - priority for LCP if first item */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <OptimizedImage
          src={images[activeIndex]}
          alt="Gallery image"
          width={600}
          height={600}
          priority={activeIndex === 0}
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-16 h-16 flex-shrink-0 rounded border-2 overflow-hidden ${
              idx === activeIndex ? 'border-red-600' : 'border-gray-300'
            }`}
          >
            <OptimizedImage
              src={img}
              alt={`Thumbnail ${idx}`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 6. FEEDBACK/REVIEW AVATARS
// ============================================

// BEFORE:
// <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />

// AFTER:
export function ReviewCard({ review }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <OptimizedImage
            src={review.userAvatar}
            alt={review.userName}
            width={40}
            height={40}
            placeholder="/asset/images/default-avatar.jpg"
            className="w-full h-full object-cover rounded-full"
            sizes="40px"
          />
        </div>
        <div>
          <p className="font-semibold">{review.userName}</p>
          <p className="text-sm text-gray-600">{review.date}</p>
        </div>
      </div>
      <p className="text-gray-700">{review.text}</p>
    </div>
  );
}

// ============================================
// 7. BLOG FEATURED IMAGES
// ============================================

// BEFORE:
// <img src={blog.image} alt={blog.title} className="w-full h-64" />

// AFTER:
export function BlogCard({ blog }) {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      {/* Featured image - responsive for blog cards */}
      <div className="h-64 bg-gray-100 overflow-hidden">
        <OptimizedImage
          src={blog.featuredImage}
          alt={blog.title}
          width={600}
          height={300}
          placeholder="/asset/images/blog-placeholder.jpg"
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg">{blog.title}</h3>
        <p className="text-gray-600 text-sm">{blog.excerpt}</p>
        <time className="text-gray-500 text-xs">{blog.publishDate}</time>
      </div>
    </article>
  );
}

// ============================================
// 8. CATEGORY SELECTION (Grid layout)
// ============================================

// BEFORE:
// <img src={category.image} alt={category.name} />

// AFTER:
export function CategoryTile({ category }) {
  return (
    <button className="group relative overflow-hidden rounded-lg">
      {/* Background image with overlay */}
      <div className="aspect-square bg-gray-100">
        <OptimizedImage
          src={category.image}
          alt={category.name}
          width={200}
          height={200}
          placeholder="/asset/images/category-placeholder.jpg"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Text overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
        <h3 className="text-white font-bold text-lg">{category.name}</h3>
      </div>
    </button>
  );
}

// ============================================
// 9. CHECKOUT/CART ITEMS
// ============================================

// BEFORE:
// <img src={item.image} alt={item.name} className="w-20 h-20" />

// AFTER:
export function CartItem({ item }) {
  return (
    <div className="flex gap-4 p-3 border-b">
      {/* Product thumbnail */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        <OptimizedImage
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          placeholder="/asset/images/dummy-image-square.jpg"
          className="w-full h-full object-cover"
          sizes="80px"
        />
      </div>

      {/* Product info */}
      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-gray-600">Qty: {item.quantity}</p>
        <p className="text-gray-600">${item.price}</p>
      </div>
    </div>
  );
}

// ============================================
// 10. RESPONSIVE BANNER PATTERN
// ============================================

// For full-width responsive banners with multiple breakpoints
export function ResponsiveBanner({ mobileSrc, desktopSrc }) {
  return (
    <div className="w-full h-64 md:h-96 bg-gray-100 overflow-hidden">
      <OptimizedImage
        src={desktopSrc}
        alt="Banner"
        width={1920}
        height={400}
        priority={true}
        className="w-full h-full object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
      />
    </div>
  );
}

// ============================================
// IMPLEMENTATION CHECKLIST
// ============================================

/*
☐ 1. Import OptimizedImage component
   import OptimizedImage from './OptimizedImage';

☐ 2. Replace <img> tags in these components:
   - Header.jsx (logo)
   - HeroSlider.jsx (banner)
   - ProductGrid.jsx (product cards)
   - Cart.jsx (cart items)
   - Gallery.jsx (image gallery)
   - Feedback.jsx (user avatars)
   - Blogs.jsx (featured images)

☐ 3. Mark above-fold images with priority={true}
   - Hero banners
   - Header logo
   - Featured product images

☐ 4. Test in Chrome DevTools:
   - Throttling (Fast 3G, Slow 3G)
   - Lighthouse audit
   - Network tab (image sizes)

☐ 5. Monitor metrics:
   - Run Lighthouse before/after
   - Check Largest Contentful Paint (LCP)
   - Verify Cumulative Layout Shift (CLS)

☐ 6. Deploy and validate
   - Test on real devices
   - Monitor Core Web Vitals
   - Check error logs

*/

// ============================================
// QUICK MIGRATION: Convert LazyImage to OptimizedImage
// ============================================

// If you're using existing LazyImage component:
// 1. Replace: import LazyImage from './LazyImage';
// 2. With:    import OptimizedImage from './OptimizedImage';
// 3. Usage is similar: <OptimizedImage src={...} width={300} height={300} />

export default {
  HeaderLogo,
  HeroBanner,
  ProductCard,
  SearchResult,
  ImageGallery,
  ReviewCard,
  BlogCard,
  CategoryTile,
  CartItem,
  ResponsiveBanner
};
