import React from 'react';
import { motion } from 'motion/react';
import { Home, Search, ShoppingBag, Store, User, Heart } from 'lucide-react';
import { UserProfile } from '../lib/dbService';

interface BottomNavBarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  lang: 'en' | 'ur';
  currentUser?: UserProfile | null;
  favoritesCount?: number;
  cartCount?: number;
  // Make these optional to avoid compilation errors from App.tsx
  onCategoryChange?: (category: any) => void;
  onLanguageToggle?: () => void;
  theme?: any;
  toggleTheme?: () => void;
}

export default function BottomNavBar({ 
  currentTab, 
  setTab,
  lang,
  currentUser,
  favoritesCount = 0,
  cartCount = 0
}: BottomNavBarProps) {

  const t = {
    en: {
      home: 'Home',
      search: 'Search',
      post: 'Post Ad',
      dealers: 'Showrooms',
      profile: 'Profile'
    },
    ur: {
      home: 'ہوم',
      search: 'تلاش',
      post: 'اشتہار',
      dealers: 'شورومز',
      profile: 'پروفائل'
    }
  }[lang];

  interface TabItem {
    id: string;
    label: string;
    icon: any;
    isPrimary?: boolean;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'inventory', label: t.search, icon: Search },
    { id: 'sell', label: t.post, icon: ShoppingBag, isPrimary: true },
    { id: 'dealers', label: t.dealers, icon: Store },
    { id: 'profile', label: t.profile, icon: User }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-md z-40 bg-[var(--color-bg-secondary)]/95 backdrop-blur-2xl border border-[var(--color-border-main)] rounded-full shadow-[var(--shadow-bento)] px-3 py-1 transition-all"
    >
      <div className="flex justify-around items-center h-[54px] relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id || (tab.id === 'inventory' && currentTab === 'search') || (tab.id === 'profile' && currentTab === 'portal');

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className="relative flex flex-col items-center justify-center -mt-5 cursor-pointer group shrink-0"
                title={tab.label}
              >
                {/* Elevated Primary Action Container */}
                <div className="flex items-center justify-center w-12 h-12 bg-amber-500 hover:bg-amber-600 rounded-full text-slate-950 shadow-lg border-2 border-[var(--color-bg-secondary)] group-hover:scale-105 active:scale-95 transition-all duration-200">
                  <Icon size={20} className="stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-sans font-bold tracking-wider mt-0.5 uppercase text-amber-500">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-14 transition-all duration-150 active:scale-95 cursor-pointer h-full min-h-[44px]"
            >
              {/* Active Tab Floating Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activeBottomTab"
                  className="absolute inset-0 my-auto h-9 w-full bg-amber-500/15 rounded-xl border border-amber-500/25"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon Container */}
              <div className={`relative z-10 transition-colors duration-150 ${
                isActive ? 'text-amber-500' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-header)]'
              }`}>
                <Icon size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
              </div>

              {/* Tab Label */}
              <span className={`relative z-10 text-[9.5px] font-sans tracking-tight mt-0.5 transition-colors duration-150 ${
                isActive ? 'text-amber-500 font-bold' : 'text-[var(--color-text-muted)] font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

