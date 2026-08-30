import { NO_IMAGE_SVG } from "../types";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Car, 
  Sparkles, 
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building2,
  ArrowRight,
  PlusCircle,
  Pause,
  Play,
  MapPin,
  Flame,
  RefreshCw,
  Award
} from 'lucide-react';
import { CarListing } from '../types';

interface MarketplaceHeroProps {
  lang: 'en' | 'ur';
  onSearch: (query: string) => void;
  setTab: (tab: string) => void;
  listings?: CarListing[];
  onSelectListing?: (car: CarListing) => void;
}

// Helper function to format price in Lakh / Crore for Pakistan market
function formatPakPrice(price: number): string {
  if (!price || isNaN(price)) return 'Contact for Price';
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)} Crore`;
  }
  if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(1)} Lakh`;
  }
  return `PKR ${price.toLocaleString()}`;
}

export default function MarketplaceHero({ lang, onSearch, setTab, listings = [], onSelectListing }: MarketplaceHeroProps) {
  const isUrdu = lang === 'ur';
  const [searchInput, setSearchInput] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [searchMode, setSearchMode] = useState<'buy' | 'sell' | 'showroom'>('buy');
  
  // Hero Live Inventory Carousel State
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Filter valid live inventory from backend Firestore listings, sorted latest uploaded first
  const validPropListings = (listings || [])
    .filter(item => item && (item.images?.length > 0 || item.imageUrl || item.title || item.make))
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  
  const heroVehicles = validPropListings;
  const activeHeroCar = heroVehicles.length > 0 ? (heroVehicles[selectedHeroIndex % heroVehicles.length] || heroVehicles[0]) : null;

  // Auto cycle timer (every 4.5 seconds)
  useEffect(() => {
    if (!isAutoplay || isHovered || heroVehicles.length <= 1) return;
    
    const interval = setInterval(() => {
      setSelectedHeroIndex((prev) => (prev + 1) % heroVehicles.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoplay, isHovered, heroVehicles.length]);

  const handleNextHero = () => {
    setSelectedHeroIndex((prev) => (prev + 1) % heroVehicles.length);
  };

  const handlePrevHero = () => {
    setSelectedHeroIndex((prev) => (prev - 1 + heroVehicles.length) % heroVehicles.length);
  };

  const handleCombinedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'sell') {
      setTab('sell');
      return;
    }
    if (searchMode === 'showroom') {
      setTab('dealers');
      return;
    }
    const queryParts = [searchInput, selectedMake, selectedCity, selectedPrice, selectedCondition].filter(Boolean);
    const combinedQuery = queryParts.join(' ');
    onSearch(combinedQuery);
    setTab('search');
  };

  return (
    <div className="relative w-full bg-[#090D14] text-white overflow-hidden pt-20 pb-12 lg:pt-28 lg:pb-16 border-b border-white/10">
      
      {/* Luxury Champagne Gold Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#C5A880]/12 via-[#0F1626]/40 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Precision Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Headline, Subtitle & Luxury Search Console */}
          <div className="w-full lg:col-span-7 flex flex-col justify-center order-1">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#C5A880] text-xs font-semibold tracking-wide uppercase w-fit mb-3"
            >
              <Sparkles size={13} className="text-[#C5A880]" />
              <span>{isUrdu ? 'پاکستان کا بہترین تصدیق شدہ آٹوموٹو نیٹ ورک' : 'Verified Automotive Marketplace'}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 leading-[1.12]"
            >
              {isUrdu ? 'اپنی اگلی پسندیدہ' : 'Find Your Next'}{' '}
              <span className="text-gold-gradient font-black">
                {isUrdu ? 'گاڑی دریافت کریں' : 'Dream Vehicle'}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm sm:text-base text-[#94A3B8] max-w-xl mb-6 leading-relaxed font-normal"
            >
              {isUrdu
                ? 'پاکستان بھر کے تصدیق شدہ شورومز اور براہ راست مالکان سے گاڑیاں خریدیں اور 60 سیکنڈ میں مفت اشتہار لگائیں۔'
                : 'Connect with certified showrooms, browse inspected vehicles across Pakistan, and list your car in seconds.'}
            </motion.p>

            {/* Luxury Search Console Container */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="w-full bg-[#0F1626]/95 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl"
            >
              {/* Buy / Sell / Showrooms Mode Switch */}
              <div className="flex items-center gap-1.5 p-1 bg-[#172238] rounded-xl border border-white/10 w-fit mb-4 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSearchMode('buy')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    searchMode === 'buy'
                      ? 'bg-[#C5A880] text-[#090D14] shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Car size={14} />
                  <span>{isUrdu ? 'خریدیں' : 'Buy Cars'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchMode('sell')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    searchMode === 'sell'
                      ? 'bg-[#C5A880] text-[#090D14] shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <PlusCircle size={14} />
                  <span>{isUrdu ? 'بیچیں' : 'Sell Your Car'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchMode('showroom')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    searchMode === 'showroom'
                      ? 'bg-[#C5A880] text-[#090D14] shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Building2 size={14} />
                  <span>{isUrdu ? 'شورومز' : 'Showrooms'}</span>
                </button>
              </div>

              {/* Search Form Controls */}
              <form onSubmit={handleCombinedSearch} className="space-y-3">
                
                {/* Text Search Input */}
                <div className="relative group">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors group-focus-within:text-[#C5A880]" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={isUrdu ? "میک، ماڈل یا شہر درج کریں..." : "Search make, model, city (e.g. Civic, Fortuner, Islamabad)..."}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#172238] border border-white/10 rounded-xl text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 transition-all hover:border-white/20"
                  />
                </div>

                {/* Dropdowns Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#172238] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <option value="">All Makes</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="KIA">KIA</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="MG">MG</option>
                    <option value="Changan">Changan</option>
                    <option value="Audi">Audi</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes">Mercedes-Benz</option>
                  </select>

                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#172238] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <option value="">All Cities</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Multan">Multan</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </select>

                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#172238] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <option value="">Any Budget</option>
                    <option value="1500000">Under 15 Lakh</option>
                    <option value="3000000">Under 30 Lakh</option>
                    <option value="5000000">Under 50 Lakh</option>
                    <option value="10000000">Under 1 Crore</option>
                    <option value="20000000">Under 2 Crore</option>
                  </select>

                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#172238] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <option value="">All Conditions</option>
                    <option value="Used">Used</option>
                    <option value="New">New / Unregistered</option>
                    <option value="Certified">Verified Only</option>
                  </select>
                </div>

                {/* Submit Search Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setTab('search')}
                    className="text-xs text-[#94A3B8] hover:text-[#C5A880] flex items-center justify-center sm:justify-start gap-1 font-semibold transition-colors cursor-pointer py-1"
                  >
                    <SlidersHorizontal size={14} />
                    <span>Advanced Filters</span>
                  </button>

                  <button
                    type="submit"
                    className="btn-gold-primary text-xs tracking-wider uppercase w-full sm:w-auto"
                  >
                    <span>{isUrdu ? 'تلاش کریں' : 'Search Vehicles'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Floating Live Inventory Showcase */}
          <div className="w-full lg:col-span-5 relative flex flex-col items-center justify-center order-2 mt-4 lg:mt-0">
            
            <div 
              className="w-full space-y-3"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Header Label Bar above Showcase Card */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5A880]"></span>
                  </span>
                  <span className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
                    <Award size={14} className="text-[#C5A880]" />
                    <span>{isUrdu ? 'لائیو گاڑی شوکیس' : 'Live Showcase Inventory'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#94A3B8] bg-[#172238] px-2 py-0.5 rounded-md border border-white/10">
                    {(selectedHeroIndex % Math.max(heroVehicles.length, 1)) + 1} / {heroVehicles.length || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAutoplay(!isAutoplay)}
                    title={isAutoplay ? 'Pause auto rotation' : 'Start auto rotation'}
                    className="p-1 rounded-md bg-[#172238] hover:bg-[#253554] text-[#94A3B8] hover:text-white transition-colors cursor-pointer border border-white/10"
                  >
                    {isAutoplay ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                </div>
              </div>

              {/* Main Showcase Vehicle Card */}
              {heroVehicles.length === 0 ? (
                <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0F1626] p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center mx-auto text-[#C5A880]">
                    <Car size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-sm">No Live Vehicles Posted Yet</h3>
                    <p className="text-xs text-slate-400">Be the first to list your vehicle on Bazar360.online!</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab('sell')}
                    className="btn-gold-primary text-xs inline-flex items-center gap-2"
                  >
                    <PlusCircle size={14} />
                    <span>Post Free Advertisement</span>
                  </button>
                </div>
              ) : activeHeroCar ? (
                <div className="space-y-3">
                  <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0F1626] group flex flex-col">
                  
                  {/* Auto Rotation Progress Bar */}
                  {isAutoplay && !isHovered && heroVehicles.length > 1 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
                      <motion.div
                        key={selectedHeroIndex}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4.5, ease: 'linear' }}
                        className="h-full bg-[#C5A880]"
                      />
                    </div>
                  )}

                  {/* Vehicle Image Canvas */}
                  <div className="relative w-full aspect-[16/9] bg-[#090D14] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeHeroCar.id || selectedHeroIndex}
                        src={activeHeroCar.images?.[0] || activeHeroCar.imageUrl || NO_IMAGE_SVG}
                        alt={activeHeroCar.title || `${activeHeroCar.make} ${activeHeroCar.model}`}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35 }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    </AnimatePresence>

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5">
                      <div className="bg-[#090D14]/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-[11px] font-bold text-white shadow-lg">
                        <ShieldCheck size={14} className="text-[#C5A880]" />
                        <span>Verified Stock</span>
                      </div>

                      {activeHeroCar.condition && (
                        <div className="bg-[#C5A880] text-[#090D14] px-2 py-1 rounded-xl text-[10px] font-extrabold uppercase shadow-sm">
                          {activeHeroCar.condition}
                        </div>
                      )}
                    </div>

                    {/* Top Right Model Year */}
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                      <div className="bg-[#090D14]/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-white shadow-lg">
                        {activeHeroCar.year} Model
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    {heroVehicles.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevHero}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#090D14]/85 hover:bg-[#C5A880] hover:text-[#090D14] text-white border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-xl active:scale-95"
                          aria-label="Previous vehicle"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextHero}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#090D14]/85 hover:bg-[#C5A880] hover:text-[#090D14] text-white border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-xl active:scale-95"
                          aria-label="Next vehicle"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Vehicle Information */}
                  <div className="p-4 sm:p-5 bg-[#0F1626] border-t border-white/10 space-y-3.5 flex-1 flex flex-col justify-between">
                    
                    {/* Row 1: Title & Demand Price */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C5A880]">
                          {activeHeroCar.make}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                          {activeHeroCar.model || activeHeroCar.title}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-mono uppercase text-[#94A3B8] block">Price</span>
                        <span className="text-sm sm:text-base font-extrabold text-[#C5A880]">
                          {formatPakPrice(activeHeroCar.price)}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Location & Showroom Name */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#94A3B8] pb-1 border-b border-white/10">
                      <div className="flex items-center gap-1 truncate text-white/90">
                        <MapPin size={13} className="text-[#C5A880] shrink-0" />
                        <span className="truncate font-medium">
                          {activeHeroCar.registrationCity || activeHeroCar.location || 'Peshawar'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-semibold text-white/80 bg-[#172238] px-2.5 py-0.5 rounded-lg border border-white/10">
                        <Building2 size={12} className="text-[#C5A880]" />
                        <span className="truncate max-w-[130px]">
                          {activeHeroCar.sellerName || 'Bazar360'}
                        </span>
                      </div>
                    </div>

                    {/* Row 3: Key Specs Grid */}
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="bg-[#172238]/80 p-2 rounded-xl border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Mileage</span>
                        <span className="text-xs font-bold text-white font-mono truncate">
                          {activeHeroCar.mileage ? `${(activeHeroCar.mileage / 1000).toFixed(1)}k km` : 'Unreg.'}
                        </span>
                      </div>

                      <div className="bg-[#172238]/80 p-2 rounded-xl border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Engine</span>
                        <span className="text-xs font-bold text-white font-mono truncate">
                          {activeHeroCar.specs?.engineSize || (activeHeroCar.engineCC ? `${activeHeroCar.engineCC} CC` : 'N/A')}
                        </span>
                      </div>

                      <div className="bg-[#172238]/80 p-2 rounded-xl border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Trans.</span>
                        <span className="text-xs font-bold text-white truncate">
                          {activeHeroCar.transmission || 'Auto'}
                        </span>
                      </div>

                      <div className="bg-[#172238]/80 p-2 rounded-xl border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Fuel</span>
                        <span className="text-xs font-bold text-white truncate">
                          {activeHeroCar.fuelType || 'Petrol'}
                        </span>
                      </div>
                    </div>

                    {/* Row 4: Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectListing) {
                            onSelectListing(activeHeroCar);
                          } else {
                            setTab('inventory');
                          }
                        }}
                        className="btn-gold-primary flex-1 text-xs"
                      >
                        <span>View Details</span>
                        <ChevronRight size={14} />
                      </button>

                      <a
                        href={`https://wa.me/${activeHeroCar.sellerWhatsApp || activeHeroCar.sellerPhone || '923159085086'}?text=${encodeURIComponent(`Hi, I am interested in your ${activeHeroCar.year} ${activeHeroCar.make} ${activeHeroCar.model} listed on Bazar360.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0"
                        title="Contact Seller on WhatsApp"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </div>

                  </div>
                </div>

                {/* Selectable Live Inventory Thumbnails Rail */}
                {heroVehicles.length > 1 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
                        Available Vehicles:
                      </span>
                      <span className="text-[10px] text-[#C5A880] font-semibold flex items-center gap-1">
                        <RefreshCw size={10} className="animate-spin text-[#C5A880]" style={{ animationDuration: '6s' }} />
                        Rotating
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full">
                      {heroVehicles.map((car, idx) => {
                        const isSelected = idx === (selectedHeroIndex % heroVehicles.length);
                        return (
                          <button
                            key={car.id || idx}
                            type="button"
                            onClick={() => {
                              setSelectedHeroIndex(idx);
                              setIsAutoplay(false);
                            }}
                            className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 relative ${
                              isSelected
                                ? 'bg-[#172238] border-[#C5A880] text-white shadow-md ring-1 ring-[#C5A880]/50'
                                : 'bg-[#0F1626]/70 border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20'
                            }`}
                          >
                            <img
                              src={car.images?.[0] || car.imageUrl || NO_IMAGE_SVG}
                              alt={car.make || 'Car'}
                              className="w-9 h-9 rounded-lg object-cover"
                            />
                            <div className="text-left">
                              <p className="text-[10px] font-bold truncate max-w-[80px] sm:max-w-[100px]">{car.make} {car.model}</p>
                              <p className="text-[9px] text-[#C5A880] font-extrabold">
                                {car.price ? formatPakPrice(car.price).replace('PKR ', '') : 'Call'}
                              </p>
                            </div>
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C5A880] border border-[#0F1626]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              ) : null}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
