import React, { useState } from 'react';
import { Bell, Menu, MessageSquare, Moon, Search, Sun } from 'lucide-react';
import { UserProfile } from '../lib/dbService';
import MobileSideDrawer from './MobileSideDrawer';
import { useTheme } from './ThemeContext';
import Bazar360Logo from './Bazar360Logo';

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

const NAV_ITEMS = [
  ['inventory', 'Buy Cars'],
  ['sell', 'Sell Cars'],
  ['dealers', 'Showrooms'],
  ['concierge', 'Services'],
  ['community', 'Community'],
];

export default function NavigationAudit({ currentTab, setTab, currentUser, onLogout, onLoginClick, lang, onLanguageToggle, favoritesCount = 0, onSearchChange, children }: NavigationAuditProps) {
  const { isDark, toggleTheme } = useTheme();
  const [searchVal, setSearchVal] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearchChange?.(searchVal.trim());
    setTab('search');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] flex flex-col pb-16 md:pb-0">
      <header className="b360-global-header">
        <div className="b360-global-header-inner">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsDrawerOpen(true)} className="b360-header-icon md:hidden" aria-label="Open menu"><Menu size={18} /></button>
            <Bazar360Logo variant="header" size="md" theme={isDark ? 'dark' : 'light'} showTagline={false} onClick={() => setTab('home')} />
          </div>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
            {NAV_ITEMS.map(([tab, label]) => <button key={tab} type="button" onClick={() => setTab(tab)} className={`b360-header-link ${currentTab === tab ? 'is-active' : ''}`}>{label}</button>)}
          </nav>

          <div className="flex items-center gap-2">
            <form onSubmit={submitSearch} className="b360-header-search hidden md:flex">
              <Search size={15} />
              <input value={searchVal} onChange={(event) => setSearchVal(event.target.value)} placeholder={lang === 'ur' ? 'گاڑی تلاش کریں...' : 'Search cars, make, model...'} aria-label="Search vehicles" />
            </form>
            <button type="button" onClick={() => setTab('notifications')} className="b360-header-icon hidden sm:flex" aria-label="Notifications"><Bell size={17} />{favoritesCount > 0 ? <span className="b360-header-count">{favoritesCount}</span> : null}</button>
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-b360-messaging'))} className="b360-header-icon hidden sm:flex" aria-label="Messages"><MessageSquare size={17} /></button>
            <button type="button" onClick={toggleTheme} className="b360-header-icon" aria-label="Toggle theme">{isDark ? <Sun size={17} /> : <Moon size={17} />}</button>
            {currentUser ? (
              <button type="button" onClick={() => setTab('profile')} className="b360-header-profile" aria-label="Open profile">
                {currentUser.photoURL ? <img src={currentUser.photoURL} alt="" /> : <span>{(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}</span>}
              </button>
            ) : <button type="button" onClick={onLoginClick} className="b360-header-login">Sign in</button>}
          </div>
        </div>

        <div className="b360-mobile-search md:hidden">
          <form onSubmit={submitSearch}>
            <Search size={15} />
            <input value={searchVal} onChange={(event) => setSearchVal(event.target.value)} placeholder={lang === 'ur' ? 'گاڑی تلاش کریں...' : 'Search cars, make, model...'} aria-label="Search vehicles" />
          </form>
        </div>
      </header>

      <main className="flex-grow w-full relative">{children}</main>

      <MobileSideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} currentTab={currentTab} setTab={setTab} currentUser={currentUser} onLogout={onLogout} onLoginClick={onLoginClick} lang={lang} onLanguageToggle={onLanguageToggle} />
    </div>
  );
}
