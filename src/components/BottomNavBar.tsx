import React from 'react';
import { Home, Store, Car, PlusCircle, User, Sparkles } from 'lucide-react';
import { UserProfile } from '../lib/dbService';
import { cinematicAudio } from '../lib/cinematicAudio';

interface BottomNavBarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  lang: 'en' | 'ur';
  currentUser?: UserProfile | null;
  favoritesCount?: number;
  cartCount?: number;
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
}: BottomNavBarProps) {

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dealers', label: 'Showrooms', icon: Store },
    { id: 'inventory', label: 'Inventory', icon: Car },
    { id: 'sell', label: 'Sell Car', icon: PlusCircle, isPrimary: true },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom,0.5rem)] bg-[var(--color-bg-secondary)]/95 backdrop-blur-xl border-t border-[var(--color-border-main)] shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.6)] transition-colors">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            currentTab === item.id || 
            (item.id === 'inventory' && currentTab === 'search') || 
            (item.id === 'profile' && currentTab === 'portal') ||
            (item.id === 'sell' && currentTab === 'post-upload');

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  cinematicAudio.playClick();
                  setTab(item.id);
                }}
                className="relative flex flex-col items-center justify-center -mt-5 cursor-pointer group shrink-0"
                title={item.label}
              >
                {/* Glow ring */}
                <div className="absolute inset-0 bg-[var(--color-accent-main)]/30 rounded-full blur-md animate-pulse pointer-events-none" />
                
                {/* Primary Button */}
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[var(--color-accent-main)] via-[var(--color-accent-hover)] to-[var(--color-accent-main)] rounded-2xl text-white shadow-lg shadow-[var(--color-accent-main)]/30 border-2 border-[var(--color-bg-secondary)] group-hover:scale-105 active:scale-95 transition-all">
                  <Icon size={22} className="stroke-[2.5]" />
                </div>

                <span className="text-[10px] font-extrabold tracking-tight text-[var(--color-accent-main)] mt-1 uppercase whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                cinematicAudio.playClick();
                setTab(item.id);
              }}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-14 transition-all rounded-xl cursor-pointer ${
                isActive
                  ? 'text-[var(--color-accent-main)] bg-[var(--color-accent-subtle)] font-bold shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] hover:bg-[var(--color-bg-tertiary)] active:scale-95'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className={`text-[10px] ${isActive ? 'font-bold text-[var(--color-accent-main)]' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
