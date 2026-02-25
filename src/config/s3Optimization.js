/**
 * S3 IMAGE OPTIMIZATION CONFIG
 * 
 * AWS S3 specific configuration for faster image loading
 * - CloudFront CDN integration
 * - Image transformation & compression
 * - Presigned URL handling
 * - Smart caching strategies
 */

// ============================================
// S3 CONFIGURATION
// ============================================

export const S3_CONFIG = {
  // Your S3 bucket name
  bucketName: process.env.VITE_S3_BUCKET || 'your-bucket-name',
  
  // AWS Region
  region: process.env.VITE_AWS_REGION || 'ap-south-1', // Change to your region
  
  // CloudFront Domain (CRITICAL for speed!)
  // Replace with your CloudFront distribution domain
  cloudFrontDomain: process.env.VITE_CLOUDFRONT_DOMAIN || 'https://d123example.cloudfront.net',
  
  // S3 Direct Access (fallback if CloudFront not available)
  s3Direct: `https://${process.env.VITE_S3_BUCKET || 'your-bucket'}.s3.${process.env.VITE_AWS_REGION || 'ap-south-1'}.amazonaws.com`,
  
  // Enable image transformation (requires Lambda@Edge or third-party)
  enableTransformation: true,
  
  // Cache duration (in seconds)
  cacheDuration: 2592000, // 30 days
  
  // Compression quality
  quality: {
    default: 80,
    high: 85,
    medium: 75,
    low: 60,
    mobile: 65
  },
  
  // Image format priority (modern to fallback)
  formats: ['webp', 'avif', 'jpg'],
};

// ============================================
// S3 IMAGE PATHS & NAMING CONVENTION
// ============================================

export const S3_PATHS = {
  // Organize images by type in S3 buckets
  products: 'products/',
  categories: 'categories/',
  blogs: 'blogs/',
  banners: 'banners/',
  avatars: 'users/avatars/',
  feedback: 'feedback/',
  gallery: 'gallery/',
  
  // Variants folder (for different sizes)
  variants: {
    thumbnail: 'variants/thumbnails/',
    small: 'variants/small/',
    medium: 'variants/medium/',
    large: 'variants/large/',
    original: 'variants/original/'
  }
};

// ============================================
// RESPONSIVE IMAGE SIZES FOR S3
// ============================================

export const S3_RESPONSIVE_SIZES = {
  // Product images
  productThumbnail: [150, 200, 300],
  productCard: [300, 400, 600],
  productGallery: [600, 800, 1200],
  
  // Category images
  category: [200, 300, 400],
  categoryTile: [400, 600, 800],
  
  // Blog images
  blogCard: [300, 400, 600],
  blogFeatured: [600, 800, 1200],
  
  // Hero banners
  heroBanner: [800, 1200, 1920],
  
  // Avatars
  avatar: [40, 50, 80],
};

// ============================================
// S3 URL BUILDERS (with CloudFront)
// ============================================

/**
 * Build S3 URL with CloudFront CDN
 * This makes images load MUCH faster
 */
export const buildS3Url = (key, options = {}) => {
  const {
    useCloudFront = true,
    size = null,
    quality = 80,
    format = 'auto'
  } = options;
  
  // Remove leading slash if present
  const cleanKey = key.startsWith('/') ? key.substring(1) : key;
  
  // Use CloudFront (fastest!)
  if (useCloudFront && S3_CONFIG.cloudFrontDomain) {
    let url = `${S3_CONFIG.cloudFrontDomain}/${cleanKey}`;
    
    // Add query parameters for transformation (if supported)
    const params = [];
    if (size) params.push(`w=${size}`);
    if (quality) params.push(`q=${quality}`);
    if (format !== 'auto') params.push(`f=${format}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return url;
  }
  
  // Fallback to direct S3 access
  return `${S3_CONFIG.s3Direct}/${cleanKey}`;
};

/**
 * Build responsive srcSet for S3 images
 * Generates multiple sizes for different devices
 */
export const buildS3SrcSet = (key, sizes = [300, 600, 1200], quality = 80) => {
  const srcSet = sizes
    .map(size => {
      const url = buildS3Url(key, { size, quality });
      return `${url} ${size}w`;
    })
    .join(', ');
  
  return srcSet;
};

/**
 * Build sizes attribute for responsive images
 * Tells browser which size to use for different viewports
 */
export const buildS3Sizes = (breakpoints = {}) => {
  const defaults = {
    mobile: '100vw',
    tablet: '80vw',
    desktop: '1200px'
  };
  
  const final = { ...defaults, ...breakpoints };
  
  return `(max-width: 640px) ${final.mobile}, (max-width: 1024px) ${final.tablet}, ${final.desktop}`;
};

// ============================================
// S3 IMAGE URL PATTERNS
// ============================================

/**
 * S3 paths follow this pattern:
 * s3://bucket/type/id/filename.jpg
 * 
 * Examples:
 * s3://bucket/products/123/main.jpg
 * s3://bucket/products/123/variants/thumbnail.jpg
 * s3://bucket/categories/5/banner.jpg
 * s3://bucket/blogs/post-1/featured.jpg
 */

export const S3_URL_PATTERNS = {
  productImage: (productId, filename = 'main.jpg') => 
    `products/${productId}/${filename}`,
  
  productVariant: (productId, variant = 'thumbnail') => 
    `products/${productId}/variants/${variant}.jpg`,
  
  categoryImage: (categoryId, filename = 'image.jpg') => 
    `categories/${categoryId}/${filename}`,
  
  blogImage: (blogId, filename = 'featured.jpg') => 
    `blogs/${blogId}/${filename}`,
  
  userAvatar: (userId) => 
    `users/avatars/${userId}/avatar.jpg`,
  
  banner: (bannerId, filename = 'banner.jpg') => 
    `banners/${bannerId}/${filename}`,
};

// ============================================
// S3 PRESETS FOR COMMON USE CASES
// ============================================

export const S3_PRESETS = {
  // Product thumbnail (small, fast load)
  productThumbnail: {
    quality: 65,
    sizes: [150, 200, 300],
    mobileSize: 150,
    tabletSize: 200,
    desktopSize: 300,
    format: 'webp'
  },
  
  // Product card (medium, grid)
  productCard: {
    quality: 75,
    sizes: [300, 400, 600],
    mobileSize: 300,
    tabletSize: 400,
    desktopSize: 600,
    format: 'webp'
  },
  
  // Product gallery (large, high quality)
  productGallery: {
    quality: 85,
    sizes: [600, 800, 1200],
    mobileSize: 600,
    tabletSize: 800,
    desktopSize: 1200,
    format: 'webp'
  },
  
  // Hero banner (full width, priority)
  heroBanner: {
    quality: 80,
    sizes: [800, 1200, 1920],
    mobileSize: 800,
    tabletSize: 1200,
    desktopSize: 1920,
    priority: true,
    format: 'webp'
  },
  
  // Blog featured image
  blogFeatured: {
    quality: 75,
    sizes: [600, 800, 1200],
    mobileSize: 600,
    tabletSize: 800,
    desktopSize: 1200,
    format: 'webp'
  },
  
  // Avatar (small, fast)
  userAvatar: {
    quality: 70,
    sizes: [40, 50, 80],
    mobileSize: 40,
    tabletSize: 50,
    desktopSize: 80,
    format: 'webp'
  }
};

// ============================================
// CLOUDFRONT OPTIMIZATION
// ============================================

/**
 * CloudFront caching headers
 * Add these to your S3 bucket CORS or CloudFront behaviors
 */
export const CLOUDFRONT_HEADERS = {
  // Cache static images for 30 days
  'Cache-Control': 'public, max-age=2592000, immutable',
  
  // Enable gzip compression
  'Content-Encoding': 'gzip',
  
  // Enable browser caching
  'Expires': new Date(Date.now() + 2592000000).toUTCString(),
  
  // Enable CDN caching
  'CloudFront-Cache-Control': 'public, max-age=2592000'
};

// ============================================
// S3 IMAGE UPLOAD HELPERS
// ============================================

/**
 * Generate S3 key from image data
 * Use this when uploading images to S3
 */
export const generateS3Key = (type, id, filename) => {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${type}/${id}/${timestamp}-${sanitized}`;
};

/**
 * Get optimal size based on device
 */
export const getOptimalSize = () => {
  if (typeof window === 'undefined') return 600;
  
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  
  if (width < 480) return 300 * dpr; // Mobile
  if (width < 768) return 400 * dpr; // Tablet
  return 600 * dpr; // Desktop
};

/**
 * Format detection helper
 * Determine best image format for browser
 */
export const getPreferredFormat = () => {
  if (typeof window === 'undefined') return 'jpg';
  
  const canvas = document.createElement('canvas');
  
  if (canvas.toDataURL('image/webp').indexOf('webp') === 5) {
    return 'webp';
  }
  
  return 'jpg';
};

// ============================================
// BATCH OPERATIONS (for multiple images)
// ============================================

/**
 * Pre-generate URLs for multiple images
 * Useful for product listings
 */
export const preGenerateS3Urls = (images, preset = S3_PRESETS.productCard) => {
  return images.map(image => ({
    original: buildS3Url(image.key),
    thumb: buildS3Url(image.key, { size: preset.mobileSize, quality: preset.quality }),
    mobile: buildS3Url(image.key, { size: preset.mobileSize, quality: preset.quality }),
    tablet: buildS3Url(image.key, { size: preset.tabletSize, quality: preset.quality }),
    desktop: buildS3Url(image.key, { size: preset.desktopSize, quality: preset.quality }),
    srcSet: buildS3SrcSet(image.key, preset.sizes, preset.quality)
  }));
};

// ============================================
// EXPORT EVERYTHING
// ============================================

export default {
  S3_CONFIG,
  S3_PATHS,
  S3_RESPONSIVE_SIZES,
  S3_PRESETS,
  buildS3Url,
  buildS3SrcSet,
  buildS3Sizes,
  S3_URL_PATTERNS,
  CLOUDFRONT_HEADERS,
  generateS3Key,
  getOptimalSize,
  getPreferredFormat,
  preGenerateS3Urls
};
