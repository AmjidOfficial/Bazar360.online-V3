import React, { useState, useEffect } from 'react';
import { Car, ImageOff } from 'lucide-react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. 'aspect-[16/10]' or 'aspect-video'
  placeholderSrc?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-[16/10]',
  placeholderSrc,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Fallback fallback asset if external link fails
  const fallbackAsset = '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg';
  const effectiveSrc = hasError ? fallbackAsset : src;

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${aspectRatio} ${containerClassName}`}>
      {/* 1. Shimmer / Blur-Up Placeholder */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 transition-opacity duration-700 ease-out ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-pulse'
        }`}
      >
        <div className="w-full h-full flex items-center justify-center text-slate-700">
          <Car size={32} className="opacity-30" />
        </div>
      </div>

      {/* 2. High-Res Image with Blur-Up Transition */}
      <img
        src={effectiveSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoaded 
            ? 'opacity-100 blur-0 scale-100' 
            : 'opacity-0 blur-md scale-105'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
