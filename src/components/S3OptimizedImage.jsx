/**
 * S3OptimizedImage Component
 * 
 * Specialized for AWS S3 images with:
 * - CloudFront CDN integration (FASTEST!)
 * - Automatic image compression
 * - Responsive sizes per device
 * - Smart caching
 * - Automatic format selection (WebP/AVIF)
 * - Presigned URL support
 * 
 * Drop-in replacement for OptimizedImage when using S3
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  buildS3Url,
  buildS3SrcSet,
  buildS3Sizes,
  S3_PRESETS,
  getOptimalSize,
  getPreferredFormat
} from '@/config/s3Optimization';

const S3OptimizedImage = ({
  s3Key,                    // S3 object key (path)
  alt = 'Image',
  width,
  height,
  className = '',
  preset = 'productCard',   // Use preset config
  quality,                  // Override quality
  placeholder = '/asset/images/dummy-image-square.jpg',
  onError,
  onLoad,
  priority = false,
  sizes,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Get preset if string provided
  const config = typeof preset === 'string' ? S3_PRESETS[preset] : preset;
  const finalQuality = quality || config?.quality || 75;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.01,
        rootMargin: '100px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  // Build URLs with S3 optimization
  const imageUrl = isInView && !hasError 
    ? buildS3Url(s3Key, { quality: finalQuality })
    : placeholder;

  const responsiveSrcSet = isInView && !hasError
    ? buildS3SrcSet(s3Key, config?.sizes || [300, 600, 1200], finalQuality)
    : undefined;

  const responsiveSizes = sizes || buildS3Sizes({
    mobile: `${config?.mobileSize || 300}px`,
    tablet: `${config?.tabletSize || 600}px`,
    desktop: `${config?.desktopSize || 1200}px`
  });

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg"
          aria-hidden="true"
          style={{ zIndex: 0 }}
        />
      )}

      {/* S3 Image - optimized from CloudFront */}
      {isInView && (
        <img
          ref={imgRef}
          src={imageUrl}
          alt={alt}
          srcSet={responsiveSrcSet}
          sizes={responsiveSizes}
          width={width}
          height={height}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          {...(!priority && { fetchPriority: 'low' })}
          {...(priority && { fetchPriority: 'high' })}
          {...props}
        />
      )}

      {/* Placeholder while loading */}
      {!isInView && (
        <img
          src={placeholder}
          alt=""
          width={width}
          height={height}
          className="w-full h-full object-cover blur-sm opacity-50"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default S3OptimizedImage;
