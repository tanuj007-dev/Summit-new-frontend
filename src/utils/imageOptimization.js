/**
 * Image Optimization Utilities
 * Handles lazy loading, responsive images, and format conversion
 */

/**
 * Get optimized image source with quality and size parameters
 * Supports both local and external image sources
 */
export const getOptimizedImageSrc = (
  img,
  width = 400,
  quality = 80,
  format = 'webp'
) => {
  if (!img) return '/asset/images/dummy-image-square.webp';

  // If it's a local/relative path, return as-is
  if (!img.startsWith('http')) {
    return img;
  }

  // For S3/external URLs with image optimization service support
  // Example for AWS CloudFront or similar service
  try {
    const url = new URL(img);
    
    // Add optimization parameters if using a CDN with image optimization
    // Uncomment and adjust based on your CDN provider
    // url.searchParams.set('w', width);
    // url.searchParams.set('q', quality);
    // url.searchParams.set('fm', format);
    
    return url.toString();
  } catch {
    return img;
  }
};

/**
 * Get srcset for responsive images
 * Returns multiple resolution versions for different device sizes
 */
export const getResponsiveImageSrcSet = (img, baseWidth = 400) => {
  if (!img || !img.startsWith('http')) return img;

  return `
    ${getOptimizedImageSrc(img, baseWidth * 0.5, 85)} 1x,
    ${getOptimizedImageSrc(img, baseWidth, 80)} 2x,
    ${getOptimizedImageSrc(img, baseWidth * 1.5, 75)} 3x
  `.trim();
};

/**
 * Format image size in human-readable format
 */
export const formatImageSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if browser supports modern image formats
 */
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
};

export const supportsAVIF = () => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/avif').indexOf('image/avif') === 0;
};

/**
 * Get best image format based on browser support
 */
export const getBestImageFormat = () => {
  if (supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'jpg';
};

/**
 * Preload image for better perceived performance
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Generate picture element with multiple formats and sizes
 * Used for maximum optimization of images
 */
export const generatePictureHTML = (src, alt, sizes = {}) => {
  return `
    <picture>
      <source srcset="${getOptimizedImageSrc(src, sizes.mobile || 300, 85)}" media="(max-width: 640px)">
      <source srcset="${getOptimizedImageSrc(src, sizes.tablet || 600, 80)}" media="(max-width: 1024px)">
      <source srcset="${getOptimizedImageSrc(src, sizes.desktop || 1200, 75)}" media="(min-width: 1025px)">
      <img src="${getOptimizedImageSrc(src, 400, 80)}" alt="${alt}" loading="lazy" decoding="async">
    </picture>
  `;
};

/**
 * Get optimized image URL for different use cases
 */
export const getImageUrl = (img, options = {}) => {
  const {
    width = 400,
    quality = 80,
    format = 'auto',
    crop = false,
    fit = 'cover',
  } = options;

  if (!img) return '/asset/images/dummy-image-square.webp';

  if (!img.startsWith('http')) {
    return img;
  }

  try {
    const url = new URL(img);
    
    // Add optimization parameters based on options
    if (url.searchParams) {
      url.searchParams.set('w', width);
      url.searchParams.set('q', quality);
      if (format !== 'auto') url.searchParams.set('fm', format);
      if (crop) url.searchParams.set('crop', 'faces');
      url.searchParams.set('fit', fit);
    }
    
    return url.toString();
  } catch {
    return img;
  }
};
