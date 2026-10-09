import React, { useState, useEffect, useMemo } from 'react';
import { Dealer, CarListing, Review } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  LayoutGrid, 
  Newspaper, 
  Image as ImageIcon, 
  MessageSquare,
  ArrowLeft,
  Settings,
  ShieldCheck,
  Share2,
  Heart,
  Menu,
  X,
  QrCode,
  Phone,
  MessageCircle,
  Copy,
  Download,
  ExternalLink,
  Users,
  Printer,
  Sparkles,
  PlusCircle,
  Plus,
  PhoneCall,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import { ShowroomHero } from './ShowroomHero';
import { dbUpdateDealer } from '../lib/dbService';
import { AutoChoiceLogo } from './Bazar360Logo';
import { ThemeSwitcher } from './ThemeSwitcher';
import ShowroomFABMenu from './ShowroomFABMenu';
import { QRCodeCanvas } from 'qrcode.react';
import { ShowroomInventorySkeleton } from './layout/SkeletonLoader';
import { BusinessCardGenerator } from './BusinessCardGenerator';

// Performance optimization: Lazy load non-critical sections to reduce initial bundle evaluation
const InventoryGrid = React.lazy(() => import('./InventoryGrid').then(module => ({ default: module.InventoryGrid })));
const ContactSection = React.lazy(() => import('./ContactSection').then(module => ({ default: module.ContactSection })));
const MediaGallery = React.lazy(() => import('./MediaGallery').then(module => ({ default: module.MediaGallery })));

interface ShowroomMiniSiteProps {
  dealer: Dealer;
  listings: CarListing[];
  reviews: Review[];
  onSelectListing: (listing: CarListing) => void;
  currentUser?: any;
  onAddReview?: (comment: string, rating: number) => Promise<void>;
  onPublishActivity?: (dealerId: string, post: any) => Promise<void>;
  onApproveActivity?: (dealerId: string, postId: string) => Promise<void>;
  onNavigateToSell?: () => void;
  onOpenQrModal?: (dealer: Dealer) => void;
  onOpenSupportDrawer?: (initialMessage?: string) => void;
  onBack?: () => void;
}

export default function ShowroomMiniSite({
  dealer: initialDealer,
  listings,
  onSelectListing,
  currentUser,
  onNavigateToSell,
  onOpenSupportDrawer,
  onBack
}: ShowroomMiniSiteProps) {
  const [dealer, setDealer] = useState<Dealer>(initialDealer);
  const [activeTab, setActiveTab] = useState('home');
  const [isLiked, setIsLiked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // QR Customizer States
  const [qrColor, setQrColor] = useState('#F97316');
  const [qrBg, setQrBg] = useState('#FFFFFF');
  const [qrSize, setQrSize] = useState(250);

  // Business Card Customizer States
  const [cardName, setCardName] = useState('Malak Mazhar');
  const [cardTitle, setCardTitle] = useState('Director / Chief Partner');
  const [cardPhone, setCardPhone] = useState('0315-9085086');
  const [cardSecondary, setCardSecondary] = useState('0346-9085033');
  const [cardAddress, setCardAddress] = useState('Alamas Car Village, Ring Road, Peshawar');
  const [cardSlogan, setCardSlogan] = useState('The Right Choice');
  const [isCardBack, setIsCardBack] = useState(false);

  useEffect(() => {
    setDealer(initialDealer);
  }, [initialDealer]);

  useEffect(() => {
    if (dealer) {
      const likedShowrooms = JSON.parse(localStorage.getItem('bazar360_liked_showrooms') || '[]');
      setIsLiked(likedShowrooms.includes(dealer.id));
    }
  }, [dealer.id]);

  const handleLike = async () => {
    const likedShowrooms = JSON.parse(localStorage.getItem('bazar360_liked_showrooms') || '[]');
    const newIsLiked = !isLiked;
    
    let updatedLiked;
    if (newIsLiked) {
      updatedLiked = [...likedShowrooms, dealer.id];
      console.log(`You liked ${dealer.name}!`);
    } else {
      updatedLiked = likedShowrooms.filter((id: string) => id !== dealer.id);
      toast.info(`Unliked ${dealer.name}.`);
    }
    
    setIsLiked(newIsLiked);
    localStorage.setItem('bazar360_liked_showrooms', JSON.stringify(updatedLiked));
    
    try {
      const currentCount = dealer.likes_count || dealer.likesCount || 0;
      const newCount = newIsLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
      await dbUpdateDealer(dealer.id, { likesCount: newCount, likes_count: newCount });
      setDealer(prev => ({ ...prev, likesCount: newCount, likes_count: newCount }));
    } catch (err) {
      console.warn('Failed to update likes count:', err);
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInquireFleet = () => {
    const fleetCount = listings.length;
    const msg = `Hello! I am inquiring about the available vehicle fleet (${fleetCount} active stock units) at ${dealer.name} (${dealer.location || 'Peshawar'}). Please share more details and current stock deals.`;
    if (onOpenSupportDrawer) {
      onOpenSupportDrawer(msg);
    } else {
      console.log('Inquire Fleet message:', msg);
    }
  };

  const isOwner = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.uid === dealer.ownerUid || currentUser.role === 'Admin' || currentUser.role === 'Super Admin';
  }, [currentUser, dealer]);

  const handleShareShowroom = async () => {
    const shareUrl = `${window.location.origin}/dealers/${dealer.id}`;
    const mapLink = dealer.id === 'auto-choice-peshawar' 
      ? "https://maps.google.com/?q=Auto+choice+Alamas+Car+Village+Ring+Road+Peshawar"
      : `https://maps.google.com/?q=${encodeURIComponent(dealer.location || 'Peshawar')}`;
      
    const shareText = `🚗 ${dealer.name.toUpperCase()} 🚗\n✨ "${dealer.subtitle || 'Elite Automotive Dealership'}"\n📍 Location: ${dealer.location}\n🗺️ Google Maps: ${mapLink}\n📞 Contact/WhatsApp: ${dealer.whatsapp || '0315-9085086'}\n👥 Showroom Lead: Malak Mazhar\n🌐 Browse Real-Time Inventory: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: dealer.name,
          text: shareText,
          url: shareUrl
        });
        console.log('Showroom details shared successfully!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(shareText);
          console.log('📋 Full Showroom Share Card copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(shareText);
      console.log('📋 Full Showroom Share Card copied to clipboard! Ready to send on WhatsApp.');
    }
  };

  // Modern dynamic QR Url computing
  const encodedQrData = useMemo(() => {
    const baseUrl = `${window.location.origin}/dealers/${dealer.id}`;
    const cleanColor = qrColor.replace('#', '');
    const cleanBg = qrBg.replace('#', '');
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(baseUrl)}&color=${cleanColor}&bgcolor=${cleanBg}&margin=10`;
  }, [dealer.id, qrColor, qrBg, qrSize]);

  const tabs = [
    { id: 'home', label: 'Home', icon: <Info size={16} /> },
    { id: 'about', label: 'About & Contacts', icon: <Newspaper size={16} /> },
    { id: 'inventory', label: 'Inventory', icon: <LayoutGrid size={16} /> },
    { id: 'media', label: 'Media', icon: <ImageIcon size={16} /> },
    { id: 'qrcode', label: 'QR Code', icon: <QrCode size={16} /> },
  ];

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen text-[var(--color-text-main)] transition-colors duration-200">
      
      {/* 1. MOBILE RESPONSIVE TOP HEADER BAR */}
      <header className="md:hidden sticky top-0 z-40 h-14 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-3 flex items-center justify-between shadow-lg overflow-hidden">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack || (() => window.history.back())}
            className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 text-gray-300 hover:text-orange-500 rounded-xl text-xs cursor-pointer active:scale-95 transition-all"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center font-black text-[10px] text-orange-500">
              {dealer.logo ? <img src={dealer.logo} alt="Logo" className="w-6 h-6 object-contain" /> : dealer.avatarLetter}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans font-black text-[11px] uppercase tracking-wide text-white leading-tight truncate max-w-[120px]">
                {dealer.name}
              </span>
              <span className="text-[7.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider leading-none">
                Verified Dealer
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Direct Compact WhatsApp Action Call/Msg */}
          <a
            href={`https://wa.me/${(dealer.whatsapp || '923159085086').replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-xl text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-90 transition-all flex items-center justify-center relative"
            title="Contact on WhatsApp"
          >
            <MessageCircle size={15} className="stroke-[2.5]" />
          </a>

          {/* Quick Call */}
          <a
            href={`tel:${dealer.whatsapp || '03159085086'}`}
            className="w-9 h-9 rounded-xl text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 active:scale-90 transition-all flex items-center justify-center"
            title="Call Showroom"
          >
            <Phone size={14} />
          </a>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer active:scale-95 transition-all"
            title="Open Menu"
          >
            <Menu size={15} />
          </button>
        </div>
      </header>

      {/* 2. RESPONSIVE SIDEBAR DRAWER OVERLAY (MOBILE ONLY) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/80 z-45"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-72 bg-[var(--color-bg-primary)] border-r border-[var(--color-border-main)] p-6 z-50 flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-orange-500">Showroom Desk</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border-main)] rounded-lg cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 border-b border-[var(--color-border-main)] pb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center font-black text-orange-500 shrink-0">
                    {dealer.logo ? <img src={dealer.logo} alt="Logo" className="w-8 h-8 object-contain" /> : dealer.avatarLetter}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black uppercase text-[var(--color-text-main)] truncate">{dealer.name}</h3>
                    <p className="text-[8px] font-mono uppercase text-emerald-500">Elite Certified</p>
                  </div>
                </div>

                <nav className="space-y-1.5">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-100 cursor-pointer ${
                          isActive 
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-secondary)]'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-[var(--color-border-main)] space-y-4">
                <button
                  onClick={handleLike}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isLiked ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-transparent border-[var(--color-border-main)] text-[var(--color-text-muted)]'
                  }`}
                >
                  <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                  <span>{isLiked ? 'Liked' : 'Like Showroom'} ({dealer.likesCount || dealer.likes_count || 0})</span>
                </button>
                <div className="flex items-center justify-between text-[9px] font-mono text-[var(--color-text-muted)] uppercase">
                  <span>{listings.length} Active Fleet</span>
                  <ThemeSwitcher />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN FULL-STACK SIDEBAR LAYOUT (DESKTOP) */}
      <div className="flex min-h-screen">
        
        {/* DESKTOP STICKY LEFT SIDEBAR */}
        <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-[var(--color-border-main)] bg-[var(--color-bg-secondary)]/30 backdrop-blur-md sticky top-0 h-screen p-6 overflow-y-auto justify-between select-none">
          <div className="space-y-8">
            {/* Back to Hub button */}
            <button 
              onClick={onBack || (() => window.history.back())}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] text-xs font-mono font-black uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:border-orange-500/50 hover:shadow transition-all duration-150 cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Hub
            </button>

            {/* Brand Header */}
            <div className="flex items-center gap-3 border-b border-[var(--color-border-main)] pb-5">
              <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center font-black text-lg text-orange-500 shrink-0">
                {dealer.logo ? <img src={dealer.logo} alt="Logo" className="w-9 h-9 object-contain" /> : dealer.avatarLetter}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black tracking-wide text-[var(--color-text-main)] uppercase truncate">
                  {dealer.name}
                </h2>
                <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold tracking-widest text-emerald-500 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded mt-0.5 border border-emerald-500/10">
                  <ShieldCheck size={8} /> Verified Store
                </span>
              </div>
            </div>

            {/* Navigation Tabs Links */}
            <nav className="space-y-1.5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-100 relative cursor-pointer ${
                      isActive 
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/15' 
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-secondary)]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabMarker"
                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom elements */}
          <div className="pt-6 border-t border-[var(--color-border-main)] space-y-4">


            <button
              onClick={handleLike}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                isLiked 
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-500' 
                  : 'bg-[var(--color-bg-primary)] border-[var(--color-border-main)] text-[var(--color-text-muted)] hover:text-rose-500 hover:border-rose-500/30'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-current' : ''} />
              <span>{isLiked ? 'Liked Showroom' : 'Like Showroom'}</span>
              <span className="text-[10px] opacity-65">({dealer.likesCount || dealer.likes_count || 0})</span>
            </button>

            <div className="flex items-center justify-between text-[9px] font-mono text-[var(--color-text-muted)] uppercase px-1">
              <span>{listings.length} Active Fleet</span>
              <span>•</span>
              <ThemeSwitcher />
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT CONTAINER (TAB SWITCHED VIEW) */}
        <main className="flex-1 min-w-0 min-h-screen px-4 md:px-8 py-8 md:py-12 max-w-7xl mx-auto space-y-12">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-12"
            >
              
              {/* ======================================================== */}
              {/* TAB 1: HOME/SHOWROOM TAB */}
              {/* ======================================================== */}
              {activeTab === 'home' && (
                <div className="space-y-12">
                  <ShowroomHero dealer={dealer} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] p-6 rounded-3xl shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center font-black text-2xl text-orange-500 shadow-lg shrink-0">
                            {dealer.logo ? <img src={dealer.logo} alt="Logo" className="w-11 h-11 object-contain" /> : dealer.avatarLetter}
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-[var(--color-text-main)] font-display tracking-tight uppercase">
                              {dealer.name}
                            </h2>
                            <p className="text-[var(--color-text-muted)] text-xs font-sans flex items-center gap-1.5 mt-0.5">
                              <ShieldCheck size={14} className="text-orange-500" />
                              Elite Verified Dealership Floor
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] p-6 md:p-8 rounded-3xl space-y-4 shadow-sm text-left">
                        <h3 className="text-orange-500 font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                          <Sparkles size={14} className="animate-spin" /> Executive Showroom Bio
                        </h3>
                        <div className="text-[var(--color-text-muted)] text-sm leading-relaxed font-sans prose prose-invert">
                          {dealer.description}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border-main)] font-mono text-center">
                          <div className="bg-[var(--color-bg-primary)] p-4 rounded-2xl border border-[var(--color-border-main)]">
                            <span className="text-[var(--color-text-main)] font-extrabold text-xl block">{listings.length}</span>
                            <span className="text-[9px] text-[var(--color-text-muted)] uppercase font-black">Live Units</span>
                          </div>
                          <div className="bg-[var(--color-bg-primary)] p-4 rounded-2xl border border-[var(--color-border-main)]">
                            <span className="text-[var(--color-text-main)] font-extrabold text-xl block">{dealer.likesCount || dealer.likes_count || 0}</span>
                            <span className="text-[9px] text-[var(--color-text-muted)] uppercase font-black">Store Fans</span>
                          </div>
                          <div className="bg-[var(--color-bg-primary)] p-4 rounded-2xl border border-[var(--color-border-main)] col-span-2 md:col-span-1">
                            <span className="text-emerald-500 font-extrabold text-xl block">100%</span>
                            <span className="text-[9px] text-[var(--color-text-muted)] uppercase font-black">Reliability</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SHARE DIGITAL SHOWROOM COGNITIVE CARD */}
                    <div className="lg:col-span-4">
                      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all pointer-events-none" />
                        <h3 className="text-lg font-black text-white font-display mb-4 flex items-center gap-2">
                          <Share2 size={18} className="text-orange-500" />
                          Share Showroom
                        </h3>
                        <p className="text-xs text-gray-400 font-sans leading-relaxed mb-6">
                          Utilize the Web Share integration to distribute this showroom profile directly with name, location, map link, and contact details!
                        </p>
                        <button 
                          onClick={handleShareShowroom}
                          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 border border-orange-400/20 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2"
                        >
                          <Share2 size={14} />
                          Share Digital Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SHOWROOM HIGHLIGHTS */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-[var(--color-border-main)] pb-4">
                      <h3 className="text-xl font-black text-[var(--color-text-main)] font-display uppercase tracking-widest">Showroom Highlights</h3>
                      <button 
                        onClick={() => handleTabClick('inventory')}
                        className="text-xs font-mono font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        Explore Fleet &rarr;
                      </button>
                    </div>
                    <React.Suspense fallback={
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 animate-pulse">
                        {[1, 2, 3, 4].map(n => (
                          <div key={n} className="bg-slate-900/50 rounded-3xl h-80 border border-white/5" />
                        ))}
                      </div>
                    }>
                      <InventoryGrid 
                        listings={listings.slice(0, 4)} 
                        dealer={dealer} 
                        onSelectListing={(id) => onSelectListing(listings.find(l => l.id === id)!)} 
                      />
                    </React.Suspense>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: MERGED ABOUT & CONTACTS TAB */}
              {/* ======================================================== */}
              {(activeTab === 'about' || activeTab === 'contacts') && (
                <div className="max-w-5xl mx-auto space-y-12 text-left">
                  {/* Mission & Story */}
                  <div className="space-y-6">
                    <h2 className="text-3xl font-black text-[var(--color-text-main)] font-display uppercase tracking-tight border-b border-[var(--color-border-main)] pb-4">
                      Our Showroom Mission & History
                    </h2>
                    <div className="prose prose-invert max-w-none font-sans text-base text-[var(--color-text-muted)] leading-relaxed">
                      {dealer.about ? (
                        <div dangerouslySetInnerHTML={{ __html: dealer.about }} />
                      ) : (
                        <p>{dealer.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Map & Working Hours */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                    {/* Map Coordinates Widget */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] p-6 rounded-3xl space-y-4 shadow-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--color-text-main)]">
                            GPS Coordinates & Pin
                          </h3>
                          <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{dealer.location}</p>
                        </div>
                      </div>

                      {dealer.id === 'auto-choice-peshawar' ? (
                        <div className="w-full h-48 rounded-2xl border border-[var(--color-border-main)] overflow-hidden bg-slate-950 relative">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.9780193666907!2d71.48557838117156!3d33.967404453093664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d917f3bfdc9deb%3A0xfc1d94addfbea0d5!2sAuto%20choice!5e0!3m2!1sen!2s!4v1781725478050!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      ) : (
                        <div className="bg-slate-950 rounded-2xl h-48 border border-[var(--color-border-main)] relative overflow-hidden flex items-center justify-center font-mono text-[var(--color-text-muted)]">
                          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1.2px,transparent_1.2px)] [background-size:12px_12px] opacity-60"></div>
                          <div className="z-10 text-center space-y-1">
                            <span className="text-[10px] uppercase font-black text-orange-500 block">GPS Pin Verified</span>
                            <span className="text-xs text-[var(--color-text-main)] block">{dealer.location || 'Peshawar'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Operational Hour Card */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--color-text-main)]">
                          Operational Hours Calendar
                        </h3>
                        <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                          Visit our showroom floor at {dealer.location || 'Almas Car Village, Ring Road, Peshawar'}. High-quality vehicle checkups, transfers, and direct cash bids accepted on-floor.
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-[var(--color-border-main)] text-xs font-mono">
                        <div className="flex justify-between py-1 border-b border-[var(--color-border-main)]/5">
                          <span className="text-[var(--color-text-muted)]">Mon - Sat:</span>
                          <span className="text-emerald-400 font-bold">9:00 AM - 9:00 PM</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[var(--color-text-muted)]">Sunday:</span>
                          <span className="text-orange-400 font-bold">Appointment Only</span>
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Team Directory & Contact Form */}
                    <div className="pt-6 border-t border-[var(--color-border-main)] space-y-8">
                      <div className="text-center max-w-2xl mx-auto space-y-2">
                        <h2 className="text-3xl font-black text-[var(--color-text-main)] font-display uppercase tracking-tight">Direct Contact & Team Directory</h2>
                        <p className="text-[var(--color-text-muted)] text-sm font-sans">Reach out to our executive directors or send a direct inquiry message.</p>
                      </div>

                      {/* Visitor Live Greeting Board for Malak Mazhar & Amjid */}
                      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="space-y-2">
                          <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[9px] font-mono font-black uppercase text-orange-400 tracking-wider">
                            Visitor Special Channel
                          </span>
                          <h3 className="text-lg font-black uppercase tracking-tight text-white font-sans">
                            Leave a Message for Malak Mazhar & Amjid
                          </h3>
                          <p className="text-xs text-gray-300 leading-relaxed font-sans max-w-xl">
                            You are currently browsing as a <strong className="text-orange-400 font-black uppercase">Visitor</strong>. Reach out directly to our principal partners and directors with a quick pre-formatted greeting message.
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 font-mono text-[10px]">
                          <a
                            href={`https://wa.me/923159085086?text=${encodeURIComponent("Hello Malak Mazhar, I am a visitor at your Auto Choice showroom page on Bazar360. I would like to inquire about your premium vehicles.")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-initial px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2"
                          >
                            <MessageCircle size={14} /> Greeting to Malak Mazhar
                          </a>
                          
                          <a
                            href={`https://wa.me/923469085033?text=${encodeURIComponent("Hello Amjid, I am browsing your premium Auto Choice showroom on Bazar360.online. Great layout!")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-initial px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                          >
                            <MessageCircle size={14} /> Greeting to Amjid
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Contact Form */}
                      <div className="lg:col-span-6 space-y-8">
                        <React.Suspense fallback={
                          <div className="bg-slate-900/50 rounded-3xl h-96 border border-white/5 animate-pulse w-full" />
                        }>
                          <ContactSection dealer={dealer} />
                        </React.Suspense>
                      </div>

                      {/* Team Directory */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
                          
                          <div className="space-y-1">
                            <h3 className="text-lg font-black uppercase text-[var(--color-text-main)] font-display tracking-wide flex items-center gap-2">
                              <Users size={20} className="text-orange-500" />
                              Showroom Team Directory
                            </h3>
                            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                              Connect with verified representatives of <span className="text-orange-500 font-bold">{dealer.name}</span> for swift purchase closures and professional on-desk support.
                            </p>
                          </div>

                          <div className="space-y-4">
                            {((dealer as any).businessCards && (dealer as any).businessCards.length > 0
                              ? (dealer as any).businessCards
                              : [
                                  {
                                    id: 'card-1',
                                    name: 'Malak Mazhar',
                                    role: 'Chief Sales Lead & Director',
                                    phone1: '+92 315 9085086',
                                    phone2: '+92 346 9085033',
                                    email: 'Mazharsouls@gmail.com',
                                    location: 'Alamas Car Village, Ring Road, Peshawar, Pakistan',
                                    colorAccent: 'orange'
                                  },
                                  {
                                    id: 'card-2',
                                    name: 'M. Nasir Mirza',
                                    role: 'Senior Sales Consultant',
                                    phone1: '+92 346 9085032',
                                    phone2: '+92 315 9085086',
                                    email: 'Mirzashowroom@gmail.com',
                                    location: 'Alamas Car Village, Ring Road, Peshawar, Pakistan',
                                    colorAccent: 'gold'
                                  },
                                  {
                                    id: 'card-3',
                                    name: 'Malak Waseem',
                                    role: 'Managing Partner & Coordinator',
                                    phone1: '+92 346 9085033',
                                    phone2: '+92 315 9085086',
                                    email: 'Waseempartners@gmail.com',
                                    location: 'Alamas Car Village, Ring Road, Peshawar, Pakistan',
                                    colorAccent: 'cyan'
                                  },
                                  {
                                    id: 'card-4',
                                    name: 'Asfandyar Zafar',
                                    role: 'Sales Executive',
                                    phone1: '+92 315 9085086',
                                    phone2: '+92 346 9085032',
                                    email: 'Asfandyarpartners@gmail.com',
                                    location: 'Alamas Car Village, Ring Road, Peshawar, Pakistan',
                                    colorAccent: 'emerald'
                                  }
                                ]
                            ).map((member: any, index: number) => {
                              const isLead = index === 0;
                              const nameInitials = member.name.split(' ').map((n: string) => n[0]).join('');
                              const waPhone = member.phone1.replace(/[^\d]/g, '');
                              const displayPhone = member.phone1;
                              
                              const accentColorClass = 
                                member.colorAccent === 'gold' ? 'text-amber-400' :
                                member.colorAccent === 'cyan' ? 'text-cyan-400' :
                                member.colorAccent === 'emerald' ? 'text-emerald-400' :
                                member.colorAccent === 'rose' ? 'text-rose-400' :
                                member.colorAccent === 'navy' ? 'text-blue-400' : 'text-orange-400';

                              const bgGradientClass = isLead 
                                ? 'bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30 shadow-lg'
                                : 'bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] shadow-md';

                              return (
                                <div key={member.id || index} className={`p-4 rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${bgGradientClass}`}>
                                  {isLead && (
                                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-orange-500 text-white font-mono font-black text-[7.5px] uppercase tracking-widest shadow-sm">
                                      Showroom Head
                                    </span>
                                  )}
                                  <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-sans font-black text-xs select-none ${
                                      isLead ? 'bg-orange-500 shadow-md' : 'bg-slate-800'
                                    }`}>
                                      {nameInitials}
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-1">
                                      <h4 className="text-xs font-black text-[var(--color-text-main)] uppercase flex items-center gap-1.5">
                                        {member.name}
                                      </h4>
                                      <p className={`text-[9px] font-mono font-bold uppercase tracking-wider ${accentColorClass}`}>
                                        {member.role}
                                      </p>
                                      <p className="text-[10px] text-[var(--color-text-muted)] font-mono leading-relaxed max-w-md truncate">
                                        📍 {member.location}
                                      </p>
                                      <div className="flex gap-2 pt-2.5">
                                        <a 
                                          href={`https://wa.me/${waPhone}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex-1 py-1.5 bg-emerald-600/15 text-emerald-500 hover:bg-emerald-600/25 rounded-lg text-[8px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                                        >
                                          <MessageCircle size={10} /> WhatsApp
                                        </a>
                                        <a 
                                          href={`tel:${displayPhone}`}
                                          className="flex-1 py-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] rounded-lg text-[8px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                                        >
                                          <Phone size={10} /> Call
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 6: MODERN QR CODE & BUSINESS CARD GENERATOR TAB */}
              {/* ======================================================== */}
              {activeTab === 'qrcode' && (
                <div className="max-w-5xl mx-auto space-y-8 text-left">
                  
                  <div className="border-b border-[var(--color-border-main)] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-[var(--color-text-main)] font-display uppercase tracking-tight">
                        Marketing Suite & Smart Signage
                      </h2>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Generate elite showroom signs and customizable double-sided automotive business cards with integrated brand QR graphics.
                      </p>
                    </div>
                    
                    {/* Switcher Controls */}
                    <div className="flex bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] p-1.5 rounded-2xl gap-1 font-mono text-[10px] uppercase font-black tracking-wider self-start md:self-auto">
                      <button 
                        onClick={() => setIsCardBack(false)}
                        className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                          !isCardBack 
                            ? 'bg-orange-500 text-white shadow-md' 
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                        }`}
                      >
                        Showroom QR Sign
                      </button>
                      <button 
                        onClick={() => setIsCardBack(true)}
                        className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                          isCardBack 
                            ? 'bg-orange-500 text-white shadow-md' 
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                        }`}
                      >
                        Showroom Business Card
                      </button>
                    </div>
                  </div>

                  {!isCardBack ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      
                      {/* Visual QR presentation frame */}
                      <div className="md:col-span-5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(249,115,22,0.03)_1.2px,transparent_1.2px)] [background-size:16px_16px] pointer-events-none"></div>
                        
                        <div className="relative mx-auto w-56 h-56 flex items-center justify-center bg-slate-950 rounded-2xl border border-white/10 p-3 shadow-inner">
                          {/* Neon horizontal scanning indicator line */}
                          <div className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-bounce top-1/2 z-10 pointer-events-none"></div>
                          
                          {/* Corner scanner alignment target paths */}
                          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-orange-500 rounded-tl-md"></div>
                          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-orange-500 rounded-tr-md"></div>
                          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-orange-500 rounded-bl-md"></div>
                          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-orange-500 rounded-br-md"></div>

                          {/* Live high-fidelity local QR Canvas with center brand icon logo */}
                          <QRCodeCanvas
                            id="showroom-qr-canvas"
                            value={`${window.location.origin}/dealers/${dealer.id}`}
                            size={qrSize}
                            bgColor={qrBg}
                            fgColor={qrColor}
                            level="H"
                            includeMargin={true}
                            className="w-44 h-44 rounded-lg object-contain bg-white p-2.5 border border-white/5 shadow-2xl transition-transform duration-300 hover:scale-105"
                            imageSettings={{
                              src: dealer.logo || "/auto_choice_logo_dark.jpg",
                              x: undefined,
                              y: undefined,
                              height: 36,
                              width: 36,
                              excavate: true,
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-black text-orange-500 uppercase tracking-widest block">Scan to Browse Inventory</span>
                          <span className="text-[9px] text-[var(--color-text-muted)] font-mono uppercase block">{dealer.name} Official Portal</span>
                        </div>
                      </div>

                      {/* QR Parameters Customizer & Actions */}
                      <div className="md:col-span-7 space-y-6">
                        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
                          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--color-text-main)]">
                            Customize Scan Configuration
                          </h3>

                          <div className="space-y-4 text-xs font-mono">
                            
                            {/* QR Code Ink Color Selector */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">QR Ink Contrast Theme</span>
                              <div className="flex flex-wrap gap-2">
                                <button 
                                  onClick={() => setQrColor('#F97316')}
                                  className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black cursor-pointer transition-colors ${
                                    qrColor === '#F97316' ? 'bg-orange-500 text-white border-orange-500' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border-[var(--color-border-main)] hover:text-[var(--color-text-main)]'
                                  }`}
                                >
                                  Electric Orange
                                </button>
                                <button 
                                  onClick={() => setQrColor('#38BDF8')}
                                  className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black cursor-pointer transition-colors ${
                                    qrColor === '#38BDF8' ? 'bg-sky-500 text-white border-sky-500' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border-[var(--color-border-main)] hover:text-[var(--color-text-main)]'
                                  }`}
                                >
                                  Cobalt Blue
                                </button>
                                <button 
                                  onClick={() => setQrColor('#000000')}
                                  className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black cursor-pointer transition-colors ${
                                    qrColor === '#000000' ? 'bg-black text-white border-black' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border-[var(--color-border-main)] hover:text-[var(--color-text-main)]'
                                  }`}
                                >
                                  Jet Charcoal
                                </button>
                              </div>
                            </div>

                            {/* Paper Contrast Base Color */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Contrast Background Card</span>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => setQrBg('#FFFFFF')}
                                  className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black cursor-pointer transition-colors ${
                                    qrBg === '#FFFFFF' ? 'bg-white text-slate-900 border-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border-[var(--color-border-main)]'
                                  }`}
                                >
                                  Polar White (Recommended for Prints)
                                </button>
                                <button 
                                  onClick={() => setQrBg('#FFF5EB')}
                                  className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black cursor-pointer transition-colors ${
                                    qrBg === '#FFF5EB' ? 'bg-orange-50 text-slate-900 border-orange-100' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border-[var(--color-border-main)]'
                                  }`}
                                >
                                  Antique Cream
                                </button>
                              </div>
                            </div>

                            {/* Size Slider */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] text-[var(--color-text-muted)] uppercase font-bold">
                                <span>Output Image Size</span>
                                <span className="text-[var(--color-text-main)]">{qrSize}x{qrSize} px</span>
                              </div>
                              <input 
                                type="range" 
                                min="150" 
                                max="350" 
                                step="50"
                                value={qrSize} 
                                onChange={(e) => setQrSize(parseInt(e.target.value))}
                                className="w-full accent-orange-500 h-1 bg-[var(--color-bg-primary)] rounded-lg appearance-none cursor-pointer border border-[var(--color-border-main)]"
                              />
                            </div>

                          </div>

                          {/* Actions Desk */}
                          <div className="pt-4 border-t border-[var(--color-border-main)] flex flex-col sm:flex-row gap-3">
                            
                            {/* Print placards */}
                            <button
                              onClick={() => {
                                const canvas = document.getElementById('showroom-qr-canvas') as HTMLCanvasElement;
                                const qrDataUrl = canvas ? canvas.toDataURL('image/png') : encodedQrData;
                                const iframe = document.createElement('iframe');
                                iframe.style.position = 'fixed';
                                iframe.style.right = '0';
                                iframe.style.bottom = '0';
                                iframe.style.width = '0';
                                iframe.style.height = '0';
                                iframe.style.border = '0';
                                document.body.appendChild(iframe);
                                const doc = iframe.contentWindow?.document;
                                if (doc) {
                                  doc.write(`
                                    <html>
                                      <head>
                                        <title>${dealer.name} - QR Floor Sign</title>
                                        <style>
                                          body { font-family: 'Inter', sans-serif; text-align: center; padding: 40px; background: #fff; color: #000; }
                                          .container { border: 8px double #000; max-width: 500px; margin: 0 auto; padding: 40px; border-radius: 20px; }
                                          h1 { font-size: 32px; font-weight: 900; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
                                          p { font-size: 14px; margin: 0 0 30px 0; color: #555; font-weight: 500; }
                                          img { width: 280px; height: 280px; margin: 20px auto; display: block; border: 1px solid #ddd; padding: 10px; border-radius: 10px; }
                                          .footer { font-size: 11px; margin-top: 30px; letter-spacing: 2px; font-weight: 800; text-transform: uppercase; color: #888; }
                                        </style>
                                      </head>
                                      <body>
                                        <div class="container">
                                          <h1>${dealer.name}</h1>
                                          <p>${dealer.subtitle || 'Elite Automotive Dealership'}</p>
                                          <img src="${qrDataUrl}" />
                                          <p style="margin: 30px 0 0 0; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">SCAN TO VIEW DIGITAL INVENTORY</p>
                                          <div class="footer">BAZAR360.ONLINE VERIFIED STORE</div>
                                        </div>
                                      </body>
                                    </html>
                                  `);
                                  doc.close();
                                  setTimeout(() => {
                                    iframe.contentWindow?.focus();
                                    iframe.contentWindow?.print();
                                    setTimeout(() => {
                                      if (document.body.contains(iframe)) document.body.removeChild(iframe);
                                    }, 2000);
                                  }, 300);
                                }
                              }}
                              className="flex-1 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border-main)] hover:text-orange-500 rounded-xl text-xs font-mono font-black uppercase tracking-widest transition-all cursor-pointer shadow flex items-center justify-center gap-2"
                            >
                              <Printer size={14} /> Print Floor Sign
                            </button>

                            {/* Direct download */}
                            <button
                              onClick={() => {
                                const canvas = document.getElementById('showroom-qr-canvas') as HTMLCanvasElement;
                                if (canvas) {
                                  const url = canvas.toDataURL('image/png');
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${dealer.id}-bazar360-qr.png`;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  console.log('✓ Standalone QR downloaded successfully!');
                                } else {
                                  toast.error('Could not locate canvas element');
                                }
                              }}
                              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-mono font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                            >
                              <Download size={14} /> Download QR Code
                            </button>

                          </div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <BusinessCardGenerator dealer={dealer} onUpdateDealer={(updated) => setDealer(updated)} />
                  )}

                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: COMPLETE INVENTORY FLEET TAB */}
              {/* ======================================================== */}
              {activeTab === 'inventory' && (
                <div className="space-y-8 text-left">
                  <div className="border-b border-[var(--color-border-main)] pb-4">
                    <h2 className="text-2xl font-black text-[var(--color-text-main)] font-display uppercase tracking-tight">
                      Complete Showroom Fleet
                    </h2>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      Browse and filter the real-time stock units currently stationed on {dealer.name}'s floor.
                    </p>
                  </div>
                  <React.Suspense fallback={<ShowroomInventorySkeleton />}>
                    <InventoryGrid 
                      listings={listings} 
                      dealer={dealer} 
                      onSelectListing={(id) => onSelectListing(listings.find(l => l.id === id)!)} 
                    />
                  </React.Suspense>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: SHOWROOM MEDIA GALLERY TAB */}
              {/* ======================================================== */}
              {activeTab === 'media' && (
                <div className="space-y-8 text-left">
                  <div className="border-b border-[var(--color-border-main)] pb-4">
                    <h2 className="text-2xl font-black text-[var(--color-text-main)] font-display uppercase tracking-tight">
                      Showroom Media Gallery
                    </h2>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      Explore virtual walkthrough videos, 360° interactive tours, and high-fidelity photos of {dealer.name}'s luxury floor.
                    </p>
                  </div>
                  <React.Suspense fallback={
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="bg-slate-900/50 rounded-2xl h-44 border border-white/5" />
                      ))}
                    </div>
                  }>
                    <MediaGallery 
                      media={dealer.gallery || []} 
                      isOwner={false} 
                      onAddMedia={(url) => {
                        const updated = { ...dealer, gallery: [...(dealer.gallery || []), url] };
                        setDealer(updated);
                      }} 
                      onRemoveMedia={(idx) => {
                        const updated = { ...dealer, gallery: (dealer.gallery || []).filter((_, i) => i !== idx) };
                        setDealer(updated);
                      }} 
                    />
                  </React.Suspense>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* Sticky "Inquire About Fleet" Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInquireFleet}
        className="fixed bottom-24 sm:bottom-24 md:bottom-8 left-4 sm:left-6 z-40 bg-gradient-to-r from-slate-900/90 to-black/90 backdrop-blur-xl border border-orange-500/40 text-white font-sans font-black text-xs uppercase tracking-wider px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.25)] hover:border-orange-500 transition-all cursor-pointer flex items-center gap-2.5 group"
        title="Inquire about this showroom's vehicle fleet"
      >
        <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-all shrink-0">
          <Building2 size={15} />
        </div>
        <div className="text-left leading-tight">
          <span className="block text-[11px] font-black tracking-wide text-white group-hover:text-orange-400 transition-colors">
            Inquire About Fleet
          </span>
          <span className="block text-[9px] text-gray-400 font-mono font-normal">
            {listings.length} Stock Units
          </span>
        </div>
      </motion.button>

      {/* Showroom FAB Action Contacts menu */}
      <ShowroomFABMenu 
        whatsappNumber={dealer?.whatsapp || '03159085086'} 
        onNavigateToSell={onNavigateToSell}
      />
    </div>
  );
}
