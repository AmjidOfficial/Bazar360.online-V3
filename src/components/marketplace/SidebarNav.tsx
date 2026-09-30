import React from 'react';
import { 
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
  Megaphone, 
  BarChart3, 
  Scale, 
  Calculator, 
  User, 
  Settings, 
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Globe,
  Activity,
  DollarSign,
  Building2,
  PhoneCall
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  favoritesCount: number;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  leadsCount: number;
  onOpenCompare: () => void;
  onOpenValuation: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  unreadMessagesCount,
  unreadNotificationsCount,
  leadsCount,
  onOpenCompare,
  onOpenValuation,
}) => {
  const mainNavItems = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'explore', label: 'Explore All', icon: Compass },
    { id: 'auto-choice', label: 'Auto Choice', icon: Car, badge: 'Flagship' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: unreadMessagesCount },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotificationsCount },
    { id: 'saved', label: 'Saved Vehicles', icon: Heart, count: favoritesCount },
    { id: 'my-posts', label: 'My Listings', icon: FileText },
    { id: 'leads', label: 'My Leads CRM', icon: Users, count: leadsCount, highlight: true },
  ];

  const businessItems = [
    { id: 'showrooms', label: 'Verified Showrooms', icon: Store },
    { id: 'fleet-health', label: 'Fleet & Diagnostics', icon: Activity, badge: 'Northvale' },
    { id: 'financing', label: 'Financing & Trade-In', icon: DollarSign },
    { id: 'showroom-studio', label: 'Showroom Studio', icon: LayoutDashboard },
    { id: 'crm', label: 'Seller Pipeline CRM', icon: Users },
    { id: 'marketing', label: 'Marketing Suite', icon: Megaphone },
  ];

  const toolItems = [
    { id: 'about', label: 'About & Showroom Story', icon: Building2 },
    { id: 'contact', label: 'Contact & Showroom Bay', icon: PhoneCall },
    { id: 'compare', label: 'Compare Vehicles', icon: Scale, action: onOpenCompare },
    { id: 'valuation', label: 'Vehicle Valuation', icon: Calculator, action: onOpenValuation },
    { id: 'profile', label: 'Profile & Trust', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 p-4 flex flex-col justify-between hidden lg:flex select-none sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      
      <div className="space-y-6">
        
        {/* Section 1: Main Platform Navigation */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center justify-between">
            <span>Bazar360 Marketplace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Network Live" />
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className={isActive ? 'text-blue-400' : 'text-slate-400 shrink-0'} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      item.highlight 
                        ? 'bg-emerald-500 text-white' 
                        : isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Showroom & Dealer Business Studio */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Showroom & CRM
          </div>
          <nav className="space-y-1">
            {businessItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className={isActive ? 'text-blue-400' : 'text-slate-400 shrink-0'} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Smart Automotive Tools & Identity */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Tools & Identity
          </div>
          <nav className="space-y-1">
            {toolItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      onSelectTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className={isActive ? 'text-blue-400' : 'text-slate-400 shrink-0'} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronRight size={13} className="text-slate-300" />
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Verified Guarantee Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 mt-4 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <ShieldCheck size={15} className="text-blue-600" />
          <span>Bazar360 Trust</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          100% verified dealer inventory & direct WhatsApp communication with zero commission.
        </p>
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            title="View auto-generated XML Sitemap for search engines"
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

    </aside>
  );
};
