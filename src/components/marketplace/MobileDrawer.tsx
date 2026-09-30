import React from 'react';
import { 
  X, 
  Home, 
  Compass, 
  Car, 
  MessageSquare, 
  Bell, 
  Heart, 
  FileText, 
  Users, 
  Store, 
  LayoutDashboard, 
  Scale, 
  Calculator, 
  User, 
  Settings, 
  ShieldCheck, 
  PlusCircle,
  Sparkles,
  Globe,
  Activity,
  DollarSign,
  Building2,
  PhoneCall
} from 'lucide-react';
import { Bazar360Logo, AutoChoiceLogo } from '../common/BrandLogos';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  favoritesCount: number;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  leadsCount: number;
  onOpenCompare: () => void;
  onOpenValuation: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  favoritesCount,
  unreadMessagesCount,
  unreadNotificationsCount,
  leadsCount,
  onOpenCompare,
  onOpenValuation,
}) => {
  if (!isOpen) return null;

  const handleItemClick = (tabId: string, action?: () => void) => {
    if (action) {
      action();
    } else {
      onSelectTab(tabId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start lg:hidden">
      <div className="bg-white w-72 h-full flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-left">
        
        <div className="space-y-6">
          
          {/* Header with Logo & Close */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Bazar360Logo size="sm" frame="rounded" background="dark" />

            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          {/* Sell Button Banner */}
          <button
            onClick={() => handleItemClick('sell')}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <PlusCircle size={16} />
            <span>+ Post Vehicle Ad</span>
          </button>

          {/* Marketplace Navigation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Marketplace
            </span>
            <nav className="space-y-1">
              {[
                { id: 'home', label: 'Home Feed', icon: Home },
                { id: 'explore', label: 'Explore All', icon: Compass },
                { id: 'auto-choice', label: 'Auto Choice', icon: Car, badge: 'Flagship' },
                { id: 'messages', label: 'Messages', icon: MessageSquare, count: unreadMessagesCount },
                { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotificationsCount },
                { id: 'saved', label: 'Saved Vehicles', icon: Heart, count: favoritesCount },
                { id: 'my-posts', label: 'My Listings', icon: FileText },
                { id: 'leads', label: 'My Leads CRM', icon: Users, count: leadsCount },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">
                        {item.badge}
                      </span>
                    )}
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Showroom & Business */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Showrooms & Tools
            </span>
            <nav className="space-y-1">
              {[
                { id: 'showrooms', label: 'Verified Showrooms', icon: Store },
                { id: 'fleet-health', label: 'Fleet & Diagnostics', icon: Activity, badge: 'Northvale' },
                { id: 'financing', label: 'Financing & Trade-In', icon: DollarSign },
                { id: 'about', label: 'About & Showroom Story', icon: Building2 },
                { id: 'contact', label: 'Contact & Location', icon: PhoneCall },
                { id: 'compare', label: 'Compare Vehicles', icon: Scale, action: onOpenCompare },
                { id: 'valuation', label: 'Vehicle Valuation', icon: Calculator, action: onOpenValuation },
                { id: 'profile', label: 'Profile & Trust', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id, item.action)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

        </div>

        {/* Footer Trust Badge & SEO Sitemap */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 mt-6 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <ShieldCheck size={15} className="text-blue-600" />
            <span>Direct Marketplace</span>
          </div>
          <p className="text-[10px] text-slate-500">Zero commission • Direct WhatsApp</p>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Globe size={12} />
              <span>Sitemap.xml</span>
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600"
            >
              robots.txt
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
