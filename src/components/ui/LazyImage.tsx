import React, { useState } from 'react';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export function LazyImage({
  src,
  alt,
  className = '',
  priority = false,
  fallbackSrc = '/auto_choice_official_logo.jpg',
  ...rest
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const displaySrc = hasError ? (fallbackSrc || src) : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-800/60 animate-pulse flex items-center justify-center z-10">
          <div className="w-5 h-5 rounded-full border-2 border-slate-600 border-t-sky-400 animate-spin" />
        </div>
      )}
      <img
        src={displaySrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError && fallbackSrc && src !== fallbackSrc) {
            setHasError(true);
          }
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  );
}

export default LazyImage;
