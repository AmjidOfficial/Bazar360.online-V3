import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedUrl, getResponsiveSrcSet } from '../../lib/cloudinaryService';
import { NO_IMAGE_SVG } from '../../types';

export interface LazyImageProps {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  width?: number | string;
  height?: number | string;
  targetWidth?: number;
  targetHeight?: number;
  crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'limit';
  format?: 'webp' | 'auto' | 'png' | 'jpg';
  quality?: string;
  priority?: boolean;
  watermark?: boolean;
  aspectRatio?: string;
  fallbackSrc?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onClick?: () => void;
  rootMargin?: string;
}

/**
 * LazyImage Component
 * Uses IntersectionObserver API for performant lazy loading with Cloudinary dynamic WebP transformations.
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  imageClassName = '',
  width,
  height,
  targetWidth,
  targetHeight,
  crop = 'fill',
  format = 'webp',
  quality = 'auto',
  priority = false,
  watermark = false,
  aspectRatio,
  fallbackSrc = NO_IMAGE_SVG,
  referrerPolicy = 'no-referrer',
  onClick,
  rootMargin = '150px 0px',
}) => {
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer for on-demand viewport loading
  useEffect(() => {
    if (priority || isVisible) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    const currentEl = containerRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
      observer.disconnect();
    };
  }, [priority, rootMargin, isVisible]);

  // Compute optimized Cloudinary image source
  const rawSrc = hasError || !src ? fallbackSrc : src;
  
  // Transform Cloudinary URL if target dimensions or formats are specified
  const optimizedSrc = (isVisible && rawSrc && rawSrc !== fallbackSrc)
    ? getOptimizedUrl(rawSrc, {
        width: targetWidth || (typeof width === 'number' ? width : undefined),
        height: targetHeight || (typeof height === 'number' ? height : undefined),
        crop,
        format,
        quality,
        watermark,
      })
    : rawSrc;

  // Generate responsive srcset for high-res displays if Cloudinary
  const isCloudinary = typeof rawSrc === 'string' && rawSrc.includes('cloudinary.com');
  const srcSet = (isVisible && isCloudinary && !hasError && targetWidth)
    ? getResponsiveSrcSet(rawSrc, [
        Math.round(targetWidth * 0.75),
        targetWidth,
        Math.round(targetWidth * 1.5),
        Math.round(targetWidth * 2),
      ])
    : undefined;

  const containerStyle: React.CSSProperties = {
    aspectRatio: aspectRatio || (width && height ? `${width} / ${height}` : undefined),
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onClick={onClick}
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800/60 ${className}`}
    >
      {/* Shimmer / Skeleton Placeholder while unobserved or loading */}
      {(!isLoaded || !isVisible) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-200/60 dark:bg-slate-800/80 animate-pulse">
          <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 border-t-[#00D2FF] rounded-full animate-spin opacity-40" />
        </div>
      )}

      {/* Render Image once observed into viewport */}
      {isVisible && (
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy={referrerPolicy}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-98 blur-xs'
          } ${imageClassName}`}
        />
      )}
    </div>
  );
};

export default LazyImage;
