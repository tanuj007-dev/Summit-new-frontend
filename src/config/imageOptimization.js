/**
 * IMAGE OPTIMIZATION CONFIG & PRESETS
 * 
 * Centralized configuration for OptimizedImage component.
 * Use presets for consistent image optimization across your app.
 */

// Common image dimensions across your app
export const IMAGE_DIMENSIONS = {
  // Hero & Banners
  heroLarge: { width: 1920, height: 600 },
  heroBanner: { width: 1200, height: 400 },
  heroBannerSmall: { width: 800, height: 300 },

  // Product Images
  productThumbnail: { width: 150, height: 150 },
  productCard: { width: 300, height: 300 },
  productFeatured: { width: 600, height: 600 },
  productGalleryLarge: { width: 1200, height: 1200 },

  // Category & Collection
  categoryCard: { width: 200, height: 200 },
  categoryTile: { width: 400, height: 400 },
  collectionBanner: { width: 1000, height: 300 },

  // Blog & Content
  blogFeatured: { width: 800, height: 400 },
  blogCardImage: { width: 600, height: 400 },
  blogThumbnail: { width: 300, height: 200 },

  // User & Social
  userAvatar: { width: 40, height: 40 },
  userAvatarLarge: { width: 128, height: 128 },
  reviewerAvatar: { width: 50, height: 50 },

  // Cart & Checkout
  cartItemImage: { width: 80, height: 80 },
  checkoutImage: { width: 100, height: 100 },

  // Misc
  logoSmall: { width: 48, height: 48 },
  logoLarge: { width: 120, height: 120 },
  iconSmall: { width: 24, height: 24 },
  iconMedium: { width: 32, height: 32 },
};

// Responsive sizes for different screen breakpoints
export const RESPONSIVE_SIZES = {
  // Full width on mobile, half on desktop
  heroSection: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px',

  // Products - full width on mobile, grid on desktop
  productGrid: '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',

  // Categories - responsive grid
  categoryGrid: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',

  // Blog - responsive cards
  blogCards: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',

  // Small thumbnails
  thumbnails: '(max-width: 480px) 50px, 80px',

  // Avatars - fixed size
  avatars: '40px',

  // Standard responsive
  default: '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px',
};

// Placeholder images for different types
export const PLACEHOLDERS = {
  product: '/asset/images/dummy-image-square.webp',
  blog: '/asset/images/dummy-image-square.webp',
  category: '/asset/images/dummy-image-square.webp',
  avatar: '/asset/images/dummy-image-square.webp',
  banner: '/asset/images/dummy-image-square.webp',
  gallery: '/asset/images/dummy-image-square.webp',
  default: '/asset/images/dummy-image-square.webp',
};

// Preset configurations for common use cases
export const PRESETS = {
  // Hero banner - above fold, critical for LCP
  heroBanner: {
    priority: true,
    sizes: RESPONSIVE_SIZES.heroSection,
    placeholder: PLACEHOLDERS.banner,
    ...IMAGE_DIMENSIONS.heroBanner,
  },

  // Product card - lazy loaded, grid layout
  productCard: {
    priority: false,
    sizes: RESPONSIVE_SIZES.productGrid,
    placeholder: PLACEHOLDERS.product,
    ...IMAGE_DIMENSIONS.productCard,
  },

  // Product thumbnail - small, lazy loaded
  productThumbnail: {
    priority: false,
    sizes: RESPONSIVE_SIZES.thumbnails,
    placeholder: PLACEHOLDERS.product,
    ...IMAGE_DIMENSIONS.productThumbnail,
  },

  // Product featured - large, can be priority
  productFeatured: {
    priority: false,
    sizes: '(max-width: 768px) 100vw, 600px',
    placeholder: PLACEHOLDERS.product,
    ...IMAGE_DIMENSIONS.productFeatured,
  },

  // Category card - responsive grid
  categoryCard: {
    priority: false,
    sizes: RESPONSIVE_SIZES.categoryGrid,
    placeholder: PLACEHOLDERS.category,
    ...IMAGE_DIMENSIONS.categoryCard,
  },

  // Blog featured - lazy loaded
  blogFeatured: {
    priority: false,
    sizes: RESPONSIVE_SIZES.blogCards,
    placeholder: PLACEHOLDERS.blog,
    ...IMAGE_DIMENSIONS.blogFeatured,
  },

  // User avatar - fixed size
  userAvatar: {
    priority: false,
    sizes: RESPONSIVE_SIZES.avatars,
    placeholder: PLACEHOLDERS.avatar,
    ...IMAGE_DIMENSIONS.userAvatar,
  },

  // Cart item - small, fast load
  cartItem: {
    priority: false,
    sizes: '80px',
    placeholder: PLACEHOLDERS.product,
    ...IMAGE_DIMENSIONS.cartItemImage,
  },

  // Logo - always visible, small
  logo: {
    priority: true,
    sizes: '48px',
    placeholder: PLACEHOLDERS.default,
    ...IMAGE_DIMENSIONS.logoSmall,
  },
};

/**
 * USAGE EXAMPLES
 * 
 * // Using preset with all defaults
 * <OptimizedImage
 *   src={product.image}
 *   alt={product.name}
 *   {...PRESETS.productCard}
 * />
 * 
 * // Using dimension preset
 * <OptimizedImage
 *   src={banner.image}
 *   alt={banner.title}
 *   {...IMAGE_DIMENSIONS.heroBanner}
 *   priority={true}
 *   sizes={RESPONSIVE_SIZES.heroSection}
 * />
 * 
 * // Using sizes preset
 * <OptimizedImage
 *   src={product.image}
 *   alt={product.name}
 *   width={300}
 *   height={300}
 *   sizes={RESPONSIVE_SIZES.productGrid}
 * />
 */

// Performance optimization flags
export const OPTIMIZATION_CONFIG = {
  // Enable lazy loading by default
  lazyLoading: true,

  // Intersection Observer margin (px before image enters viewport)
  observerMargin: '100px',

  // Animation duration for image fade-in (ms)
  fadeInDuration: 300,

  // Enable blur-up placeholder while loading
  blurUpPlaceholder: true,

  // Enable automatic WebP format detection
  autoWebP: false, // Set to true if your server supports it

  // Fallback placeholder strategy
  fallbackStrategy: 'blur', // 'blur' | 'solid' | 'gradient'
};

// Default quality settings
export const QUALITY_SETTINGS = {
  low: '60', // Mobile data saver
  medium: '75', // Standard
  high: '85', // Premium
  auto: 'auto', // Let browser decide
};

// Image format support detection helper
export const getImageFormatSupport = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  return {
    webp: canvas.toDataURL('image/webp') !== 'data:image/webp',
    avif: canvas.toDataURL('image/avif') !== 'data:image/avif',
    heic: canvas.toDataURL('image/heic') !== 'data:image/heic',
  };
};

/**
 * HOW TO USE THIS CONFIG
 * 
 * Step 1: Import presets into your component
 * import { PRESETS, IMAGE_DIMENSIONS, RESPONSIVE_SIZES } from '@/config/imageOptimization';
 * 
 * Step 2: Apply preset to OptimizedImage
 * <OptimizedImage src={image} alt="..." {...PRESETS.productCard} />
 * 
 * Step 3: Override any preset value if needed
 * <OptimizedImage 
 *   src={image} 
 *   alt="..." 
 *   {...PRESETS.productCard}
 *   priority={true}  // Override priority for hero
 * />
 * 
 * Step 4: Keep consistent across app
 * - All product cards use PRESETS.productCard
 * - All banners use PRESETS.heroBanner
 * - All avatars use PRESETS.userAvatar
 */

// Helper function to merge presets
export const mergePreset = (preset, overrides) => ({
  ...preset,
  ...overrides,
});

// Validation helper
export const validateImageConfig = (config) => {
  const required = ['src', 'alt', 'width', 'height'];
  const provided = Object.keys(config);
  
  const missing = required.filter(key => !provided.includes(key));
  
  if (missing.length > 0) {
    console.warn(
      `OptimizedImage warning: Missing required props: ${missing.join(', ')}`
    );
  }
  
  return missing.length === 0;
};

export default {
  IMAGE_DIMENSIONS,
  RESPONSIVE_SIZES,
  PLACEHOLDERS,
  PRESETS,
  OPTIMIZATION_CONFIG,
  QUALITY_SETTINGS,
  getImageFormatSupport,
  mergePreset,
  validateImageConfig,
};
