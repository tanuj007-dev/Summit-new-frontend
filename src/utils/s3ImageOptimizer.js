/**
 * AWS S3 Image Optimizer
 * Optimizes S3 CDN image loading with format negotiation, responsive sizing, and caching
 */

/**
 * Detect supported image formats in browser
 */
export const getImageFormatSupport = () => {
  const canvas = document.createElement('canvas');
  
  return {
    webp: canvas.toDataURL('image/webp').indexOf('image/webp') === 5,
    avif: false, // AVIF support check (more complex, using format fallback)
  };
};

/**
 * Generate optimized S3 image URL with CloudFront parameters
 * @param {string} s3Url - S3 URL or CloudFront URL
 * @param {object} options - Optimization options
 * @returns {string} - Optimized URL
 */
export const getOptimizedS3ImageUrl = (s3Url, options = {}) => {
  if (!s3Url) {
    return '/asset/images/dummy-image-square.webp';
  }

  // Default options
  const {
    width = 400,
    quality = 80,
    format = 'auto', // 'webp', 'jpg', 'png', 'auto'
    dpr = 1, // Device pixel ratio (1, 2, etc.)
  } = options;

  // If local/relative path, return as-is
  if (!s3Url.startsWith('http')) {
    return s3Url;
  }

  // Presigned S3 URLs (X-Amz-Signature, etc.) must not be modified or the signature is invalid
  if (s3Url.includes('X-Amz-Signature') || s3Url.includes('X-Amz-Algorithm')) {
    return s3Url;
  }

  // For S3/CloudFront URLs, add optimization parameters
  const separator = s3Url.includes('?') ? '&' : '?';
  
  let optimizedUrl = s3Url;

  // Add width parameter (CloudFront/S3 image processing)
  optimizedUrl += `${separator}w=${Math.round(width * dpr)}`;

  // Add quality parameter
  optimizedUrl += `&q=${quality}`;

  // Add format parameter
  if (format !== 'auto') {
    optimizedUrl += `&f=${format}`;
  }

  // Add cache bust parameter to prevent stale images
  // Remove this if you want aggressive caching
  // optimizedUrl += `&_=${Date.now()}`;

  return optimizedUrl;
};

/**
 * Get responsive image srcset for different screen sizes
 * @param {string} s3Url - S3 URL
 * @param {object} options - Configuration options
 * @returns {string} - srcset string
 */
export const getResponsiveImageSrcSet = (s3Url, options = {}) => {
  if (!s3Url) {
    return '';
  }

  const {
    baseSizes = [320, 640, 960, 1280],
    quality = 80,
  } = options;

  // Generate srcset for different screen sizes
  return baseSizes
    .map((size) => {
      const url = getOptimizedS3ImageUrl(s3Url, {
        width: size,
        quality,
      });
      return `${url} ${size}w`;
    })
    .join(', ');
};

/**
 * Get responsive image srcset with device pixel ratio
 * @param {string} s3Url - S3 URL
 * @param {number} baseWidth - Base width in pixels
 * @param {object} options - Configuration options
 * @returns {string} - srcset string
 */
export const getResponsiveDPRSrcSet = (s3Url, baseWidth = 400, options = {}) => {
  if (!s3Url) {
    return '';
  }

  const { quality = 80 } = options;

  // Generate srcset for 1x, 2x, 3x DPR
  return [1, 2, 3]
    .map((dpr) => {
      const url = getOptimizedS3ImageUrl(s3Url, {
        width: baseWidth,
        quality,
        dpr,
      });
      return `${url} ${dpr}x`;
    })
    .join(', ');
};

/**
 * Preload an image for faster rendering
 * @param {string} s3Url - S3 URL
 * @param {object} options - Optimization options
 */
export const preloadS3Image = (s3Url, options = {}) => {
  if (!s3Url || !document) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getOptimizedS3ImageUrl(s3Url, options);
  document.head.appendChild(link);
};

/**
 * Prefetch an image (lower priority than preload)
 * @param {string} s3Url - S3 URL
 */
export const prefetchS3Image = (s3Url) => {
  if (!s3Url || !document) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'image';
  link.href = s3Url;
  document.head.appendChild(link);
};

/**
 * Get best image format based on browser support
 * @param {string} s3Url - S3 URL
 * @param {object} supportedFormats - Supported formats in browser
 * @returns {string} - Format to use
 */
export const getBestImageFormat = (s3Url, supportedFormats = {}) => {
  if (!s3Url) {
    return 'jpg';
  }

  const { webp = false, avif = false } = supportedFormats;

  // Priority: AVIF > WebP > Original format
  if (avif) return 'avif';
  if (webp) return 'webp';

  // Return original format
  const urlParts = s3Url.split('.');
  const ext = urlParts[urlParts.length - 1]?.split('?')[0]?.toLowerCase();
  
  return ext || 'jpg';
};

/**
 * Calculate optimal image quality based on network speed
 * @param {string} effectiveType - Effective connection type (4g, 3g, 2g, slow-2g)
 * @returns {number} - Quality percentage (1-100)
 */
export const getQualityByNetwork = (effectiveType = '4g') => {
  const qualityMap = {
    'slow-2g': 60,
    '2g': 65,
    '3g': 75,
    '4g': 85,
    'unknown': 80,
  };

  return qualityMap[effectiveType] || 80;
};

/**
 * Get connection speed info from Network Information API
 * @returns {object} - Connection info
 */
export const getConnectionSpeed = () => {
  if (typeof navigator === 'undefined') {
    return { effectiveType: '4g', downlink: null, rtt: null, saveData: false };
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) {
    return { effectiveType: '4g', downlink: null, rtt: null, saveData: false };
  }

  return {
    effectiveType: connection.effectiveType || '4g',
    downlink: connection.downlink || null,
    rtt: connection.rtt || null,
    saveData: navigator.saveData || false,
  };
};

/**
 * Generate picture element HTML for multiple formats
 * @param {string} s3Url - S3 URL
 * @param {object} options - Configuration options
 * @returns {string} - HTML string
 */
export const generatePictureHTML = (s3Url, options = {}) => {
  if (!s3Url) {
    return '<img src="/asset/images/dummy-image-square.webp" alt="Product" />';
  }

  const {
    alt = 'Product image',
    className = '',
    width = 400,
    height = 400,
    quality = 80,
  } = options;

  const formats = getImageFormatSupport();
  const bestFormat = getBestImageFormat(s3Url, formats);

  const srcset = getResponsiveImageSrcSet(s3Url, {
    quality,
    baseSizes: [320, 640, 960, 1280],
  });

  // Build picture element with format fallbacks
  let html = '<picture>';

  // WebP source
  if (formats.webp) {
    const webpUrl = getOptimizedS3ImageUrl(s3Url, {
      width,
      quality,
      format: 'webp',
    });
    html += `<source srcset="${webpUrl}" type="image/webp">`;
  }

  // AVIF source (future-proofing)
  const avifUrl = getOptimizedS3ImageUrl(s3Url, {
    width,
    quality,
    format: 'avif',
  });
  html += `<source srcset="${avifUrl}" type="image/avif">`;

  // Fallback image
  html += `<img 
    src="${getOptimizedS3ImageUrl(s3Url, { width, quality })}"
    srcset="${srcset}"
    alt="${alt}"
    width="${width}"
    height="${height}"
    loading="lazy"
    class="${className}"
    decoding="async"
  />`;

  html += '</picture>';

  return html;
};

/**
 * Analytics: Track image load performance
 * @param {string} imageName - Image identifier
 * @param {number} duration - Load time in ms
 * @param {boolean} success - Whether image loaded successfully
 */
export const trackImageLoadPerformance = (imageName, duration, success = true) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'image_load', {
      image_name: imageName,
      load_time: duration,
      success: success,
      timestamp: new Date().toISOString(),
    });
  }
};

export default {
  getImageFormatSupport,
  getOptimizedS3ImageUrl,
  getResponsiveImageSrcSet,
  getResponsiveDPRSrcSet,
  preloadS3Image,
  prefetchS3Image,
  getBestImageFormat,
  getQualityByNetwork,
  getConnectionSpeed,
  generatePictureHTML,
  trackImageLoadPerformance,
};
