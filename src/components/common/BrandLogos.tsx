import React from 'react';

// Exact 100% actual logo assets uploaded by the user
export const BAZAR360_OFFICIAL_LOGO_SRC = '/bazar360_official_logo.jpg';
export const AUTO_CHOICE_OFFICIAL_LOGO_SRC = '/auto_choice_official_logo.jpg';

interface BaseLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  frame?: 'none' | 'rounded' | 'pill' | 'card' | 'glow' | 'glass';
  background?: 'transparent' | 'white' | 'dark' | 'navy' | 'slate' | 'blend';
  className?: string;
  onClick?: () => void;
  alt?: string;
}

/**
 * 100% Actual BAZAR360.online Official Master Logo
 * Renders the exact uploaded brand artwork with precision sizing, framing, and clean background blending.
 */
export const Bazar360Logo: React.FC<BaseLogoProps> = ({
  size = 'sm',
  frame = 'rounded',
  background = 'dark',
  className = '',
  onClick,
  alt = 'Bazar360.online - Everything You Need',
}) => {
  const heightPx = {
    xs: 22,
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
    hero: 72,
  }[size];

  const frameClasses = {
    none: 'overflow-hidden',
    rounded: 'rounded-xl overflow-hidden border border-slate-700/60 shadow-xs',
    pill: 'rounded-full overflow-hidden px-3 border border-slate-700/60 shadow-xs',
    card: 'rounded-2xl p-1 border border-slate-200 shadow-xs bg-white',
    glow: 'rounded-xl p-1 border border-[#00D2FF]/40 shadow-md shadow-[#00D2FF]/15',
    glass: 'rounded-xl p-1 bg-black/80 backdrop-blur-md border border-white/20 shadow-xs',
  }[frame];

  const bgClasses = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    dark: 'bg-[#0B1326]',
    navy: 'bg-[#060E20]',
    slate: 'bg-slate-900',
    blend: 'bg-[#0B1326]',
  }[background];

  return (
    <div
      onClick={onClick}
      style={{ 
        height: `${heightPx + 8}px`, 
        maxHeight: `${heightPx + 8}px`,
        maxWidth: '240px',
        display: 'inline-flex',
      }}
      className={`items-center justify-center shrink-0 overflow-hidden select-none px-2 ${
        onClick ? 'cursor-pointer transition-transform hover:scale-102 active:scale-98' : ''
      } ${frameClasses} ${bgClasses} ${className}`}
    >
      <img
        src={BAZAR360_OFFICIAL_LOGO_SRC}
        alt={alt}
        loading="eager"
        referrerPolicy="no-referrer"
        style={{
          height: `${heightPx}px`,
          maxHeight: `${heightPx}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
        className="shrink-0 transition-opacity duration-200"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes('images/')) {
            target.src = '/images/bazar360_official_logo.jpg';
          }
        }}
      />
    </div>
  );
};

/**
 * 100% Actual AUTO CHOICE Flagship Marketplace Logo
 * Renders the exact uploaded supercar + 360 loop artwork with precision sizing and luxury framing.
 */
export const AutoChoiceLogo: React.FC<BaseLogoProps> = ({
  size = 'sm',
  frame = 'rounded',
  background = 'dark',
  className = '',
  onClick,
  alt = 'Auto Choice - The Right Choice',
}) => {
  const heightPx = {
    xs: 22,
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
    hero: 72,
  }[size];

  const frameClasses = {
    none: 'overflow-hidden',
    rounded: 'rounded-xl overflow-hidden border border-[#3C494E]/60 shadow-xs',
    pill: 'rounded-full overflow-hidden px-3 border border-[#3C494E]/60 shadow-xs',
    card: 'rounded-xl p-1 border border-[#3C494E]/80 shadow-md bg-[#0B1326]',
    glow: 'rounded-xl p-1 border border-[#00D2FF]/40 shadow-md shadow-[#00D2FF]/20 bg-[#0B1326]',
    glass: 'rounded-xl p-1 bg-[#0B1326]/90 backdrop-blur-md border border-[#00D2FF]/30 shadow-md',
  }[frame];

  const bgClasses = {
    transparent: 'bg-transparent',
    white: 'bg-white p-0.5 rounded-lg',
    dark: 'bg-[#0B1326]',
    navy: 'bg-[#060E20]',
    slate: 'bg-slate-900',
    blend: 'bg-[#0B1326]',
  }[background];

  return (
    <div
      onClick={onClick}
      style={{ 
        height: `${heightPx + 8}px`, 
        maxHeight: `${heightPx + 8}px`,
        maxWidth: '260px',
        display: 'inline-flex',
      }}
      className={`items-center justify-center shrink-0 overflow-hidden select-none px-2 ${
        onClick ? 'cursor-pointer transition-transform hover:scale-102 active:scale-98' : ''
      } ${frameClasses} ${bgClasses} ${className}`}
    >
      <img
        src={AUTO_CHOICE_OFFICIAL_LOGO_SRC}
        alt={alt}
        loading="eager"
        referrerPolicy="no-referrer"
        style={{
          height: `${heightPx}px`,
          maxHeight: `${heightPx}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
        className="shrink-0 transition-opacity duration-200"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes('images/')) {
            target.src = '/images/auto_choice_official_logo.jpg';
          }
        }}
      />
    </div>
  );
};

/**
 * Dual Brand Emblem Badge
 */
export const DualBrandBadge: React.FC<{
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}> = ({ size = 'sm', className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-xl bg-[#0B1326] border border-[#3C494E]/70 shadow-sm shrink-0 overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-[#00D2FF]/50 transition-colors' : ''
      } ${className}`}
    >
      <div className="overflow-hidden flex items-center justify-center">
        <Bazar360Logo size={size} frame="none" background="transparent" />
      </div>

      <div className="h-4 w-[1px] bg-[#3C494E]" />

      <div className="overflow-hidden flex items-center justify-center">
        <AutoChoiceLogo size={size} frame="none" background="transparent" />
      </div>
    </div>
  );
};
