import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Car, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  PhoneCall, 
  FileCheck,
  Building2,
  BadgeDollarSign,
  CheckCircle2,
  MessageCircle,
  Award,
  Users,
  Filter,
  Eye,
  Fuel,
  Settings,
  FileText,
  Brush,
  Shield,
  Handshake,
  Star,
  PlusCircle
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { dbFetchListings } from '../lib/dbService';
import { CarListing } from '../types';
import { formatPkrPrice } from '../lib/currency';

interface AutoChoiceHeroProps {
  lang: 'en' | 'ur';
  onSearch: (query: string) => void;
  setTab: (tab: string) => void;
  listings?: CarListing[];
  onSelectListing?: (car: CarListing) => void;
}

export default function AutoChoiceHero({ lang, onSearch, setTab, listings, onSelectListing }: AutoChoiceHeroProps) {
  const { theme } = useTheme();
  const isUrdu = lang === 'ur';
  const [searchInput, setSearchInput] = useState('');
  const [makeSelect, setMakeSelect] = useState('');
  const [citySelect, setCitySelect] = useState('');
  const [budgetSelect, setBudgetSelect] = useState('');
  const [conditionSelect, setConditionSelect] = useState<'All' | 'Used' | 'New'>('All');
  const [activeCarIndex, setActiveCarIndex] = useState(0);

  // 5 Specialized services with matching pills from the picture
  const specializedServices = [
    {
      id: 'inspection',
      title: 'Vehicle Inspection Report',
      subtext: 'Digital 360° Health Check',
      pill: 'Certified Grading',
      pillBg: 'bg-zinc-950 text-white border-zinc-800',
      icon: ShieldCheck,
      desc: '200+ point diagnostic check covering engine, suspension, paint thickness & body filler.',
      targetTab: 'services'
    },
    {
      id: 'excise',
      title: 'Excise Services & Registration',
      subtext: 'Government Verification Support',
      pill: 'Government Services',
      pillBg: 'bg-[#FF6B00] text-white border-orange-600',
      icon: FileCheck,
      desc: 'Hassle-free biometric verification, tax clearance, and official smart card processing.',
      targetTab: 'services'
    },
    {
      id: 'detailing',
      title: 'Car Detailing & Rejuvenation',
      subtext: 'Multi-stage rotary correction',
      pill: 'Polishing',
      pillBg: 'bg-zinc-950 text-amber-400 border-zinc-800',
      icon: Brush,
      desc: 'Deep steam extraction, multi-stage paint polishing, engine bay cleaning, and sterilization.',
      targetTab: 'services'
    },
    {
      id: 'ceramic_ppf',
      title: 'Ceramic Coating & Paint Protection (PPF)',
      subtext: 'Military-grade nano coatings',
      pill: 'Nano-Ceramic',
      pillBg: 'bg-zinc-950 text-emerald-400 border-zinc-800',
      icon: Shield,
      desc: 'Self-healing clear TPU PPF film protecting against stone chips, scratches, and oxidation.',
      targetTab: 'services'
    },
    {
      id: 'sell_for_u',
      title: 'Sell For U',
      subtext: 'Consignment & Managed Sales',
      pill: 'Sell For U',
      pillBg: 'bg-zinc-950 text-sky-400 border-zinc-800',
      icon: Handshake,
      desc: 'Let our experts sell your car with professional 4K shoots, filtered buyer calls & safe transfer.',
      targetTab: 'sell'
    }
  ];
  
  // Ref and states for our fluid swiping specialized services carousel
  

  
  // The premium silver supercar generated asset
  const supercarAsset = '/src/assets/images/silver_supercar_1785343088161.jpg';

  // Autoplay for Verified Premium Vehicles Showcase
  useEffect(() => {
    if (!listings || listings.length <= 1) return;
    const interval = setInterval(() => {
      setActiveCarIndex((prev) => (prev + 1) % listings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [listings]);

  // Autoplay for Specialized Services Swiper Card Carousel



  const handleServiceClick = (targetTab: string, serviceId: string) => {
    if (targetTab === 'services') {
      // Set storage so services page can pre-select the category
      sessionStorage.setItem('preselectedServiceId', serviceId);
    }
    setTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParts = [searchInput.trim(), makeSelect, citySelect, budgetSelect, conditionSelect !== 'All' ? conditionSelect : ''].filter(Boolean);
    const combinedQuery = queryParts.join(' ');
    if (combinedQuery || onSearch) {
      onSearch(combinedQuery || 'All');
      setTab('inventory');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#0B1410] text-white font-sans relative overflow-hidden" id="auto-choice-hero-container">
      {/* Dynamic ambient studio lighting glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-950/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* ========================================================= */}
        {/* MAIN SPLIT GRID (EXACTLY REPLICATING THE ATTACHED MOCKUP) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          
          {/* LEFT COLUMN: THE GORGEOUS SPECIALIZED SERVICES CARD (WHITE ROUNDED CARD) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-stretch">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/20 h-full flex flex-col justify-between overflow-hidden"
              id="specialized-services-card"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-6 bg-amber-500 rounded-full" />
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-sans">
                      {isUrdu ? "ہماری خصوصی خدمات" : "Our Specialized Services"}
                    </h2>
                  </div>
                </div>

                {/* Specialized Services Vertical Stack */}
                <div className="relative mt-2">
                  <div className="flex flex-col gap-2.5">
                    {specializedServices.map((service) => (
                      <motion.div
                        key={service.id}
                        className="w-full"
                        whileHover={{ y: -2, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      >
                        <div
                          onClick={() => handleServiceClick(service.targetTab, service.id)}
                          className="group relative flex flex-row items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-amber-50 hover:to-amber-100/50 border border-slate-100 hover:border-amber-200 transition-all duration-300 cursor-pointer shadow-sm text-left overflow-hidden"
                        >
                          {/* Ambient card neon glow */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
                          
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300 shadow-md">
                            {React.createElement(service.icon, { size: 18, className: "stroke-[2.5]" })}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate group-hover:text-amber-600 transition-colors">
                                {service.title}
                              </h3>
                              <span className={`hidden sm:flex text-[8px] sm:text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-full border shadow-sm shrink-0 ${service.pillBg}`}>
                                {service.pill}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-sans leading-snug line-clamp-1">
                              {service.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>\n                </div>\n              </div>\n              {/* Secure Booking footer */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-left flex items-center justify-between text-slate-500">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" /> Authorized KP Partner
                </span>
                <span className="text-[9.5px] font-mono font-black text-slate-400">
                  SECURE BOOKING 24/7
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: THE LUXURIOUS STUDIO SHOWCASE BANNER (DARK BLACK/GREEN CAVERN) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-stretch">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#0F1E15] to-[#040806] rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col justify-between relative overflow-hidden h-full min-h-[480px]"
              id="showroom-studio-banner"
            >
              {/* Studio Backdrop neon accent lines */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-12 left-12 w-48 h-48 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />

              {/* Text Header Layout */}
              <div className="space-y-3 z-10 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] uppercase font-mono font-black tracking-[0.25em] text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
                    ★ {isUrdu ? "بزار 360 • آٹو چوائس" : "Bazar360.online • Auto Choice"}
                  </span>
                  
                  <span className="text-[9.5px] font-mono font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {isUrdu ? "لائیو شو روم" : "Showroom Direct"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-sans leading-none">
                  {isUrdu ? "خصوصی پریمیم گاڑیوں کا شوکیس" : "Verified Premium Vehicles"}
                </h1>
                
                <p className="text-xs text-zinc-300 leading-relaxed font-normal font-sans">
                  {isUrdu 
                    ? "بازار 360 پر دستیاب 100٪ اصلی اور تصدیق شدہ اشتہارات۔ براہ راست واٹس ایپ پر رابطہ اور مستند سودے بازی کریں۔"
                    : "100% active, actual, and verified advertisements on Bazar360.online. Browse, inspect details, and negotiate directly with the owner on WhatsApp."}
                </p>

                {/* Embedded Hero Action Trigger */}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setTab('sell');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-300/40"
                  >
                    <PlusCircle size={16} />
                    <span>{isUrdu ? "گاڑی کا اشتہار لگائیں +" : "Add a Vehicle Card / Post Adv +"}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Vehicle Showcase Swiper with Swipe Gestures */}
              <div className="relative my-4 py-2 z-10 flex-1 flex flex-col justify-center min-h-[250px] touch-pan-y">
                {listings && listings.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCarIndex}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, { offset, velocity }) => {
                          const swipe = offset.x;
                          if (swipe < -50 || velocity.x < -300) {
                            setActiveCarIndex(prev => (prev === listings.length - 1 ? 0 : prev + 1));
                          } else if (swipe > 50 || velocity.x > 300) {
                            setActiveCarIndex(prev => (prev === 0 ? listings.length - 1 : prev - 1));
                          }
                        }}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch gap-4 hover:border-amber-500/30 transition-all group cursor-grab active:cursor-grabbing select-none"
                      >
                        {/* Vehicle Image Container */}
                        <div className="w-full sm:w-2/5 h-44 sm:h-auto min-h-[140px] rounded-xl overflow-hidden relative bg-zinc-950 flex items-center justify-center shrink-0">
                          <img
                            src={listings[activeCarIndex].imageUrl || (listings[activeCarIndex].images && listings[activeCarIndex].images[0])}
                            alt={listings[activeCarIndex].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-500 text-[9px] font-mono font-black text-black uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck size={10} /> Verified
                          </div>
                          {listings[activeCarIndex].featured && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-[9px] font-mono font-black text-black uppercase tracking-wider">
                              Featured
                            </div>
                          )}
                        </div>

                        {/* Vehicle Info */}
                        <div className="flex-1 flex flex-col justify-between text-left space-y-2.5 py-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">
                                {listings[activeCarIndex].make} • {listings[activeCarIndex].year}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-tight group-hover:text-amber-400 transition-colors">
                              {listings[activeCarIndex].title}
                            </h3>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 font-sans leading-relaxed">
                              {listings[activeCarIndex].description || "No description provided."}
                            </p>
                          </div>

                          {/* Attributes row */}
                          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono bg-white/5 p-1.5 rounded-lg border border-white/5">
                            <div>
                              <span className="block text-zinc-500 text-[8px] font-black uppercase">Engine</span>
                              <span className="text-white font-bold">{listings[activeCarIndex].engineCC || listings[activeCarIndex].specs?.engineSize || "1000 cc"}</span>
                            </div>
                            <div>
                              <span className="block text-zinc-500 text-[8px] font-black uppercase">Fuel</span>
                              <span className="text-white font-bold">{listings[activeCarIndex].fuelType || "Petrol"}</span>
                            </div>
                            <div>
                              <span className="block text-zinc-500 text-[8px] font-black uppercase">Mileage</span>
                              <span className="text-white font-bold">{(listings[activeCarIndex].mileage || 0).toLocaleString()} km</span>
                            </div>
                          </div>

                          {/* Price & Primary CTA */}
                          <div className="flex items-center justify-between gap-2 pt-1.5">
                            <div>
                              <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Price</span>
                              <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                                {formatPkrPrice(listings[activeCarIndex].price)}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                if (onSelectListing) {
                                  onSelectListing(listings[activeCarIndex]);
                                } else {
                                  setTab('inventory');
                                }
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <Eye size={12} />
                              <span>{isUrdu ? "تفصیل دیکھیں" : "View Details"}</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Carousel navigation controls */}
                    <div className="flex items-center justify-between px-1">
                      {/* Page Counter Indicator */}
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                        Vehicle {activeCarIndex + 1} of {listings.length}
                      </span>

                      {/* Dots & Nav Buttons */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          {listings.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveCarIndex(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeCarIndex === idx ? 'w-5 bg-amber-500' : 'w-1.5 bg-slate-600'}`}
                              title={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setActiveCarIndex(prev => (prev === 0 ? listings.length - 1 : prev - 1))}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90 cursor-pointer"
                            title="Previous vehicle"
                          >
                            <ArrowRight size={12} className="rotate-180" />
                          </button>
                          <button
                            onClick={() => setActiveCarIndex(prev => (prev === listings.length - 1 ? 0 : prev + 1))}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90 cursor-pointer"
                            title="Next vehicle"
                          >
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500 text-xs">
                    No active listings found in inventory.
                  </div>
                )}
              </div>

              {/* Authentic Showroom Location & Trust Info */}
              <div className="pt-3 border-t border-white/5 text-center sm:text-left">
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium tracking-tight leading-relaxed">
                  Alamas Car Village, Ring Road, Peshawar · 100% Verified Dealer Inventory · Direct Showroom Negotiations & WhatsApp Connect
                </p>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* HORIZONTAL GLASSMORPHIC SERVICE & CATEGORY ICON STRIP     */}
        {/* ========================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6 overflow-x-auto no-scrollbar py-2"
        >
          <div className="flex items-center gap-3 min-w-max">
            {[
              { id: 'suv', label: isUrdu ? 'ایس یو وی' : 'SUVs', icon: Car, badge: 'Popular', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400' },
              { id: 'sedan', label: isUrdu ? 'سیڈان' : 'Sedans', icon: Car, badge: 'Comfort', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400' },
              { id: 'certified', label: isUrdu ? 'سرٹیفائیڈ' : 'Certified', icon: ShieldCheck, badge: 'Verified', color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400' },
              { id: 'ev', label: isUrdu ? 'ای الیکٹرک' : 'EVs & Hybrids', icon: Zap, badge: 'Eco', color: 'from-green-500/20 to-emerald-500/10 border-green-500/30 text-green-400' },
              { id: 'detailing', label: isUrdu ? 'ڈیٹیلنگ' : 'Detailing', icon: Brush, badge: 'Service', color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400' },
              { id: 'excise', label: isUrdu ? 'ایکسی سمارٹ' : 'KP Excise', icon: FileCheck, badge: 'Govt', color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400' },
              { id: 'sell', label: isUrdu ? 'فروخت' : 'Sell For U', icon: Handshake, badge: '0% Fee', color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400' },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'detailing' || cat.id === 'excise' || cat.id === 'sell') {
                      handleServiceClick(cat.id === 'sell' ? 'sell' : 'services', cat.id);
                    } else {
                      onSearch(cat.label);
                      setTab('inventory');
                    }
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r ${cat.color} border backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group`}
                >
                  <div className="p-2 rounded-xl bg-black/40 text-current shadow-inner">
                    <Icon size={16} className="group-hover:rotate-6 transition-transform" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-white tracking-tight">{cat.label}</span>
                    <span className="block text-[9px] font-mono font-bold text-emerald-300/80 uppercase">{cat.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* INTERACTIVE SEARCH & FILTER BOX (FLUID & OPTIMIZED)        */}
        {/* ========================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-gradient-to-r from-[#0F1E15] to-[#122218] border border-white/10 rounded-[28px] p-6 shadow-2xl space-y-4"
          id="advanced-search-dock"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
                <Filter size={16} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white font-sans">
                  {isUrdu ? "ایڈوانس وہیکل سرچ" : "Advance Vehicle Search"}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-bold font-sans">
                  {isUrdu ? "میک، بجٹ اور شہر کے حساب سے فلٹر کریں" : "Filter verified inventory instantly by Make, Budget, City, & Condition"}
                </p>
              </div>
            </div>

            {/* Condition Filter Pills */}
            <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl self-start sm:self-center">
              {(['All', 'Used', 'New'] as const).map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setConditionSelect(cond)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    conditionSelect === cond
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Form Filter Layout */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Model keyword query input */}
            <div className="col-span-1 md:col-span-4 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Make, Model e.g. Fortuner, Civic, Prado..."
                className="w-full bg-black/50 border border-white/10 focus:border-amber-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
              />
            </div>

            {/* Make Select */}
            <div className="col-span-1 md:col-span-2 relative">
              <Car size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <select
                value={makeSelect}
                onChange={(e) => setMakeSelect(e.target.value)}
                className="w-full bg-black/50 border border-white/10 focus:border-amber-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">All Makes</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Mercedes">Mercedes-Benz</option>
                <option value="Porsche">Porsche</option>
                <option value="BMW">BMW</option>
                <option value="Audi">Audi</option>
              </select>
            </div>

            {/* City Select */}
            <div className="col-span-1 md:col-span-2 relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <select
                value={citySelect}
                onChange={(e) => setCitySelect(e.target.value)}
                className="w-full bg-black/50 border border-white/10 focus:border-amber-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">All Cities</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Rawalpindi">Rawalpindi</option>
              </select>
            </div>

            {/* Budget range select */}
            <div className="col-span-1 md:col-span-2 relative">
              <BadgeDollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <select
                value={budgetSelect}
                onChange={(e) => setBudgetSelect(e.target.value)}
                className="w-full bg-black/50 border border-white/10 focus:border-amber-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="Under 50 Lakhs">Under 50 Lakhs</option>
                <option value="50 Lakhs - 1 Crore">50 Lakhs - 1 Crore</option>
                <option value="1 Crore - 2 Crores">1 Crore - 2 Crores</option>
                <option value="2 Crores+">2 Crores+</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <Search size={15} />
                <span>{isUrdu ? "تلاش کریں" : "Find Cars"}</span>
              </button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
