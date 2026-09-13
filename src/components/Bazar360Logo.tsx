import React from 'react';
import lightLogo from '../assets/images/bazar360_logo_light_1784988945062.jpg';
import darkLogo from '../assets/images/bazar360_logo_dark_1784988926736.jpg';
import lightIcon from '../assets/images/bazar360_icon_light_1784989011055.jpg';
import darkIcon from '../assets/images/bazar360_icon_dark_1784988992104.jpg';

export interface Bazar360LogoProps {
  variant?: 'full' | 'header' | 'icon' | 'badge' | 'footer';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export function Bazar360InfinityIcon({ className = 'w-8 h-8', lightMode = false }: { className?: string; lightMode?: boolean }) {
  return <img src={lightMode ? lightIcon : darkIcon} alt="Bazar360.online" className={`${className} object-contain`} loading="eager" decoding="async" />;
}

export default function Bazar360Logo({ variant = 'header', theme = 'auto', className = '', showTagline = true, size = 'md', onClick }: Bazar360LogoProps) {
  const isLight = theme === 'light' || (theme === 'auto' && typeof document !== 'undefined' && !document.documentElement.classList.contains('dark'));
  const sizeMap = { sm: 'h-8', md: 'h-10 sm:h-12', lg: 'h-14 sm:h-16', xl: 'h-20 sm:h-24' }[size];

  if (variant === 'icon') {
    return <button type="button" onClick={onClick} className={`inline-flex shrink-0 ${className}`} aria-label="Bazar360.online"><Bazar360InfinityIcon className="h-9 w-9 rounded-xl object-contain" lightMode={isLight} /></button>;
  }

  return (
    <button type="button" onClick={onClick} className={`inline-flex min-w-0 items-center gap-3 text-left ${className}`} aria-label="Bazar360.online">
      <img src={isLight ? lightLogo : darkLogo} alt="Bazar360.online" className={`${sizeMap} w-auto max-w-[220px] object-contain`} loading="eager" decoding="async" />
      {showTagline && variant !== 'badge' ? <span className="hidden border-l border-slate-200 pl-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-white/10 dark:text-slate-400 sm:block">Pakistan's Smart Marketplace</span> : null}
    </button>
  );
}
