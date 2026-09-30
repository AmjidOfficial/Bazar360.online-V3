import React from 'react';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  unreadMessagesCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  unreadMessagesCount,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      
      {/* 1. Home */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
          currentTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home size={19} />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* 2. Explore / Auto Choice */}
      <button
        onClick={() => onSelectTab('auto-choice')}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
          currentTab === 'auto-choice' || currentTab === 'explore' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Compass size={19} />
        <span className="text-[10px] mt-0.5">Explore</span>
      </button>

      {/* 3. + Sell (Center Highlight) */}
      <button
        onClick={() => onSelectTab('sell')}
        className="flex flex-col items-center justify-center -mt-4"
      >
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <PlusCircle size={24} />
        </div>
        <span className="text-[10px] font-bold text-slate-800 mt-0.5">Sell</span>
      </button>

      {/* 4. Messages */}
      <button
        onClick={() => onSelectTab('messages')}
        className={`relative flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
          currentTab === 'messages' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <MessageSquare size={19} />
        <span className="text-[10px] mt-0.5">Messages</span>
        {unreadMessagesCount > 0 && (
          <span className="absolute top-0 right-3 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadMessagesCount}
          </span>
        )}
      </button>

      {/* 5. Profile */}
      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
          currentTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <User size={19} />
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>

    </nav>
  );
};
