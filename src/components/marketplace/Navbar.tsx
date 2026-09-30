import React from 'react';
import { 
  Search, 
  PlusCircle, 
  Heart, 
  MessageSquare, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck, 
  MapPin,
  Car,
  DollarSign
} from 'lucide-react';
import { PAKISTAN_CITIES } from '../../lib/pakistanCarData';
import { Bazar360Logo, AutoChoiceLogo } from '../common/BrandLogos';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  favoritesCount: number;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  currencyMode: 'PKR' | 'USD';
  onToggleCurrency: () => void;
  onOpenMobileMenu: () => void;
  onOpenCompare: () => void;
  onOpenValuation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  favoritesCount,
  unreadMessagesCount,
  unreadNotificationsCount,
  currencyMode,
  onToggleCurrency,
  onOpenMobileMenu,
  onOpenCompare,
  onOpenValuation,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 md:gap-6">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Open Navigation Drawer"
          >
            <Menu size={20} />
          </button>

          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            {/* 100% Actual Bazar360 Logo Badge */}
            <Bazar360Logo size="xs" frame="rounded" background="dark" />
            
            <div className="h-5 w-[1px] bg-slate-200 hidden md:block" />
            
            {/* 100% Actual Auto Choice Logo in Luxury Frame */}
            <div className="hidden md:block">
              <AutoChoiceLogo size="xs" frame="rounded" background="dark" />
            </div>
          </div>
        </div>

        {/* Center: Universal Smart Search Bar */}
        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Toyota Corolla, Fortuner in Peshawar, under 50 Lakh..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* City Selector */}
          <div className="relative shrink-0">
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Pakistan</option>
              {PAKISTAN_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions: Tools, Shortlist, Messages, Notifications, Post Ad */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
            title={`Switch to ${currencyMode === 'PKR' ? 'USD ($)' : 'PKR (Rs.)'}`}
          >
            <span className="text-[10px] text-slate-400 font-mono">CURRENCY:</span>
            <span className="text-blue-600">{currencyMode}</span>
          </button>

          {/* Saved / Shortlist */}
          <button
            onClick={() => onSelectTab('saved')}
            className={`relative p-2 rounded-xl border border-slate-200 transition-colors cursor-pointer ${
              currentTab === 'saved' ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Saved Shortlist"
          >
            <Heart size={18} className={favoritesCount > 0 && currentTab !== 'saved' ? 'text-rose-500 fill-rose-500' : ''} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Messages */}
          <button
            onClick={() => onSelectTab('messages')}
            className={`relative p-2 rounded-xl border border-slate-200 transition-colors cursor-pointer ${
              currentTab === 'messages' ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Direct Messages"
          >
            <MessageSquare size={18} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => onSelectTab('notifications')}
            className={`relative p-2 rounded-xl border border-slate-200 transition-colors cursor-pointer ${
              currentTab === 'notifications' ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Sell Button (+ Sell) */}
          <button
            onClick={() => onSelectTab('sell')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>+ Sell</span>
          </button>

        </div>

      </div>

      {/* Mobile Search & City Sub-bar */}
      <div className="md:hidden px-4 pb-3 pt-1 flex items-center gap-2 border-t border-slate-100">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search make, model, city..."
            className="w-full pl-8 pr-7 py-1.5 bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="All">All Cities</option>
          {PAKISTAN_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </header>
  );
};
