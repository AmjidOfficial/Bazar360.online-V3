import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, 
  User, 
  Menu, 
  MessageSquare, 
  Sparkles,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ShoppingBag,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Building2
} from 'lucide-react';

import { UserProfile } from '../lib/dbService';
import { DualSwipingBrandLogo } from './DualSwipingBrandLogo';
import { getOptimizedUrl } from '../lib/cloudinaryService';
import { useTheme } from './ThemeContext';
import { cinematicAudio } from '../lib/cinematicAudio';


interface TopAppBarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onPostAdClick?: () => void;
  onOpenShowroomLogin?: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onBackToGateway?: () => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  isWithTicker?: boolean;
  currentCategory?: 'gateway' | 'auto' | 'footwear' | 'food';
  onCategoryChange?: (category: 'gateway' | 'auto' | 'footwear' | 'food') => void;
  lang?: 'en' | 'ur';
  onLanguageToggle?: () => void;
  onSelectDealer?: (id: string) => void;
  favoritesCount?: number;
  compareCount?: number;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
}

export default function TopAppBar({ 
  currentTab, 
  setTab, 
  onOpenShowroomLogin,
  currentUser,
  favoritesCount = 0
}: TopAppBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => cinematicAudio.getMuted());
  const navContainerRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme } = useTheme();

  const handleToggleMute = () => {
    const nextMuted = cinematicAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      cinematicAudio.playLuxuryChime();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navTabs: Array<{ id: string; label: string; action?: () => void }> = [
    { id: 'home', label: 'Home' },
    { id: 'inventory', label: 'Buy Cars' },
    { id: 'dealers', label: 'Showrooms' },
    { id: 'sell', label: 'Sell Free' },
    { id: 'services', label: 'Services' },
    { id: 'compare', label: 'Compare' },
    { id: 'finance', label: 'Finance' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header 
      id="bazar360-app-header"
      className="bg-[var(--color-bg-primary)]/90 text-[var(--color-text-main)] border-b border-[var(--color-border-main)] py-2.5 px-3 md:px-6 sticky top-0 z-50 transition-all flex items-center justify-between backdrop-blur-md min-h-[64px]"
    >
      {/* LEFT: Navigation Drawer Toggle & Desktop Navigation Tabs */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => {
            const drawerBtn = document.getElementById('bazar360-drawer-toggle-btn');
            if (drawerBtn) {
              drawerBtn.click();
            } else {
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }
          }}
          className="p-2 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-accent-main)] border border-[var(--color-border-main)] flex items-center justify-center transition-all active:scale-95 cursor-pointer w-10 h-10 shadow-xs"
          title="Open Menu Drawer"
        >
          <Menu size={20} />
        </button>

        <div className="hidden lg:flex items-center gap-1 bg-[var(--color-bg-secondary)] p-1 rounded-xl border border-[var(--color-border-main)]">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id || (tab.id === 'inventory' && currentTab === 'explore');
            
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  cinematicAudio.playClick();
                  if (tab.action) {
                    tab.action();
                  } else {
                    setTab(tab.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-accent-main)] text-[#090D14] font-bold shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] hover:bg-[var(--color-bg-tertiary)]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTER: Swiping Dual Logo & Post Ad Quick Action */}
      <div className="flex items-center justify-center gap-3 mx-2">
        <DualSwipingBrandLogo className="scale-90 md:scale-100" />
        
        {/* Post Free Car Ad Button & Showroom Portal */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setTab('sell')}
            className="btn-gold-primary text-xs tracking-wider uppercase font-bold py-1.5 px-3.5 shadow-xs cursor-pointer"
            title="Post your car advertisement for free"
          >
            <PlusCircle size={14} />
            <span>Post Free Ad</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenShowroomLogin) onOpenShowroomLogin();
              else setTab('profile');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-accent-main)]/40 bg-[var(--color-accent-main)]/10 hover:bg-[var(--color-accent-main)]/20 text-[var(--color-accent-main)] text-xs font-mono font-extrabold tracking-wider uppercase transition-all shadow-xs cursor-pointer"
            title="Separate login portal for showroom owners and dealerships"
          >
            <Building2 size={14} />
            <span>Showroom Portal</span>
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: Audio, Theme Toggle, Support, Cart & Profile (Standardized 40px Touch Targets) */}
      <div className="flex items-center justify-end gap-2.5 shrink-0">
        
        {/* Utilities Group */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-main)]">
          {/* Sound FX Audio Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] hover:text-[var(--color-accent-main)] border border-[var(--color-border-subtle)] transition-all cursor-pointer w-10 h-10 flex items-center justify-center shrink-0 shadow-2xs"
            title={isMuted ? "Unmute Cockpit Audio" : "Mute Cockpit Audio"}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} className="text-[var(--color-accent-main)]" />}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={() => {
              cinematicAudio.playClick();
              toggleTheme();
            }}
            className="p-2 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] hover:text-[var(--color-accent-main)] border border-[var(--color-border-subtle)] transition-all cursor-pointer w-10 h-10 flex items-center justify-center shrink-0 shadow-2xs"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Live Messaging Quick Action Button */}
          <button
            type="button"
            onClick={() => {
              cinematicAudio.playClick();
              window.dispatchEvent(new CustomEvent('open-b360-messaging', {
                detail: {}
              }));
            }}
            className="relative p-2 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] transition-all cursor-pointer w-10 h-10 flex items-center justify-center shrink-0 shadow-2xs"
            title="Open Live Conversations & Messages"
          >
            <MessageSquare size={17} />
          </button>

          {/* Favorites / Shortlist Button */}
          <button
            type="button"
            onClick={() => {
              cinematicAudio.playClick();
              setTab('inventory');
            }}
            className="relative p-2 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] text-[var(--color-accent-main)] transition-all cursor-pointer w-10 h-10 flex items-center justify-center shrink-0 shadow-2xs"
            title="View Shortlist & Favorites"
          >
            <ShoppingBag size={17} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--color-accent-main)] text-[#090D14] font-mono font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile / Login Avatar Button */}
        {currentUser ? (
          <button
            type="button"
            onClick={() => setTab('profile')}
            className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-2xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-main)] transition-all cursor-pointer border border-[var(--color-border-main)] hover:border-[var(--color-accent-main)]/40 shrink-0 group min-h-[40px]"
            title="Open User Profile & Dashboard"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)] border border-[var(--color-accent-main)]/30 shrink-0">
              {currentUser.photoURL || (currentUser as any).avatar ? (
                <img
                  src={getOptimizedUrl(currentUser.photoURL || (currentUser as any).avatar, { width: 100, height: 100, quality: 'auto:best' })}
                  alt={currentUser.displayName || 'Profile'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-accent-main)] flex items-center justify-center font-bold text-[10px] text-[#090D14]">
                  {(currentUser.displayName || (currentUser as any).name || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[10px] font-bold text-[var(--color-text-main)] leading-none max-w-[80px] truncate group-hover:text-[var(--color-accent-main)] transition-colors">
                {currentUser.displayName || (currentUser as any).name || 'Profile'}
              </span>
              <span className="text-[7.5px] font-mono font-bold text-[var(--color-accent-main)] uppercase tracking-wider leading-none mt-0.5">
                {String(currentUser.role).toLowerCase().includes('admin') ? 'ADMIN' : String(currentUser.role).toLowerCase().includes('showroom') || String(currentUser.role).toLowerCase().includes('dealer') ? 'SHOWROOM' : 'USER'}
              </span>
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setTab('profile')}
            className="p-2 rounded-2xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-main)] transition-all cursor-pointer w-10 h-10 flex items-center justify-center shrink-0 border border-[var(--color-border-main)]"
            title="User Profile & Login"
          >
            <User size={18} />
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div ref={navContainerRef} className="absolute top-full left-0 right-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-main)] p-4 shadow-xl flex flex-col gap-2 lg:hidden z-50">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.action) tab.action();
                else setTab(tab.id);
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase text-[var(--color-text-main)] hover:bg-[var(--color-accent-main)] hover:text-[#090D14] transition-colors"
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
