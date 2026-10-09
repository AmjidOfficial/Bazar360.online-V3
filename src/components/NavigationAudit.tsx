import React, { useState } from 'react';
import { 
  Compass, Grid, Store, Sparkles, PlusCircle, ShieldAlert,
  User, LogIn, Heart, MessageCircle, Globe, Sun, Moon
} from 'lucide-react';
import { UserProfile } from '../lib/dbService';
import { useTheme } from './ThemeContext';
import { DualSwipingBrandLogo } from './DualSwipingBrandLogo';

interface NavigationAuditProps {
  currentTab: string;
  setTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onLoginClick: () => void;
  lang: 'en' | 'ur';
  onLanguageToggle: () => void;
  favoritesCount?: number;
  onSearchChange?: (val: string) => void;
  children: React.ReactNode;
}

export default function NavigationAudit({
  currentTab,
  setTab,
  currentUser,
  onLogout,
  onLoginClick,
  lang,
  onLanguageToggle,
  favoritesCount = 0,
  children
}: NavigationAuditProps) {
  const { theme, toggleTheme } = useTheme();
  const isUrdu = lang === 'ur';

  const t = {
    en: {
      home: 'Home',
      inventory: 'Buy Cars',
      dealers: 'Showrooms',
      services: 'Services',
      community: 'Community',
      sell: 'Post Ad',
      login: 'Sign In',
      profile: 'Profile',
      admin: 'Admin'
    },
    ur: {
      home: 'ہوم',
      inventory: 'گاڑیاں',
      dealers: 'شورومز',
      services: 'سروسز',
      community: 'کمیونٹی',
      sell: 'اشتہار لگائیں',
      login: 'سائن ان',
      profile: 'پروفائل',
      admin: 'ایڈمن'
    }
  }[lang];

  const navLinks = [
    { id: 'home', label: t.home },
    { id: 'inventory', label: t.inventory },
    { id: 'dealers', label: t.dealers },
    { id: 'services', label: t.services },
    { id: 'community', label: t.community },
    ...(currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin' || ['amjid.bisconni@gmail.com', 'khattakghani94@gmail.com', 'mazharsouls@gmail.com'].includes(currentUser?.email?.toLowerCase() || '') ? [{ id: 'admin', label: t.admin }] : [])
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ========================================================= */}
      {/* DESKTOP TOP BAR (STRICT 3-ZONE CONTRACT, ONE ROW)        */}
      {/* Zone 1: Brand Wordmark | Zone 2: 4-5 Nav Links | Zone 3: CTA & Controls */}
      {/* ========================================================= */}
      <header className="hidden md:block sticky top-0 z-50 w-full bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-b border-[var(--color-border-main)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8 w-full">
          
          {/* Zone 1: Single element brand wordmark */}
          <div 
            onClick={() => setTab('home')}
            className="flex items-center gap-2 cursor-pointer shrink-0 select-none group"
            title="Bazar360 - The Auto Choice"
          >
            <DualSwipingBrandLogo className="border-none bg-transparent hover:bg-transparent p-0 min-w-[160px] max-h-11" />
          </div>

          {/* Zone 2: 4-5 concise single-line text links */}
          <nav className="flex items-center gap-6 text-xs font-semibold tracking-wide uppercase shrink-0">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id || (link.id === 'inventory' && currentTab === 'search');
              return (
                <button
                  key={link.id}
                  onClick={() => setTab(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive 
                      ? 'text-amber-500 font-bold border-b-2 border-amber-500' 
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-header)]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Utility Controls & Primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onLanguageToggle}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] hover:bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Toggle Language"
            >
              <Globe size={14} />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] hover:bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Saved Favorites Badge */}
            <button
              onClick={() => setTab('favorites')}
              className="relative p-2 rounded-lg text-[var(--color-text-muted)] hover:text-rose-500 hover:bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Saved Vehicles"
            >
              <Heart size={15} className={favoritesCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            <button
              onClick={() => currentUser ? setTab('profile') : onLoginClick()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-text-header)] hover:bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <User size={14} className="text-amber-500" />
              <span>{currentUser ? (currentUser.displayName?.split(' ')[0] || t.profile) : t.login}</span>
            </button>

            {/* Primary Action Button: Post Ad */}
            <button
              onClick={() => setTab('sell')}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-sm active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <PlusCircle size={14} className="stroke-[2.5]" />
              <span>{t.sell}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE STICKY NAVIGATION HEADER (COMPACT & CLEAN)         */}
      {/* ========================================================= */}
      <header className="md:hidden sticky top-0 z-50 w-full bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-b border-[var(--color-border-main)] px-3 py-2 flex items-center justify-between select-none">
        
        {/* Brand Wordmark */}
        <div 
          onClick={() => setTab('home')}
          className="flex items-center gap-2 cursor-pointer bg-transparent shrink-0"
        >
          <DualSwipingBrandLogo className="border-none bg-transparent hover:bg-transparent p-0 min-w-[130px] max-h-9" />
        </div>

        {/* Action icons with accessible 44px touch targets */}
        <div className="flex items-center gap-1 shrink-0">
          {/* WhatsApp Direct Chat */}
          <a
            href="https://wa.me/923159085086"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 active:scale-90 transition-all flex items-center justify-center"
            title="Chat on WhatsApp"
            aria-label="WhatsApp Support"
          >
            <MessageCircle size={18} className="stroke-[2.5]" />
          </a>

          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="w-11 h-11 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] active:scale-90 transition-all cursor-pointer flex items-center justify-center text-xs font-bold font-mono"
            title="Switch Language"
            aria-label="Switch Language"
          >
            {isUrdu ? 'EN' : 'اردو'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] active:scale-90 transition-all cursor-pointer flex items-center justify-center"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Favorites */}
          <button
            onClick={() => setTab('favorites')}
            className="relative w-11 h-11 rounded-lg text-[var(--color-text-muted)] hover:text-rose-400 bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] active:scale-90 transition-all cursor-pointer flex items-center justify-center"
            title="Favorites"
            aria-label="Favorites"
          >
            <Heart size={16} className={favoritesCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
            {favoritesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white font-mono text-[8px] font-bold px-1 rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

      </header>

      {/* Main Container Wrapper with mobile bottom clearance */}
      <div className="flex-grow w-full relative pb-24 md:pb-0">
        {children}
      </div>

    </div>
  );
}

