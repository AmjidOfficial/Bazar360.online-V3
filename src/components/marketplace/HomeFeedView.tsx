import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Bike, 
  Truck, 
  Zap, 
  Wrench, 
  Store, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Heart, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Gauge, 
  Fuel, 
  MapPin, 
  Sparkles, 
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { CarListing, Dealer } from '../../types';
import { PAKISTAN_BRANDS, PAKISTAN_CITIES, CAR_MODELS } from '../../lib/pakistanCarData';
import { AutoChoiceLogo, Bazar360Logo } from '../common/BrandLogos';
import { VerticalVehicleAccordion } from './VerticalVehicleAccordion';
import { FivePillarServiceGrid } from './FivePillarServiceGrid';
import { FourStageBuyingProcess } from './FourStageBuyingProcess';
import { ProgressiveImage } from '../common/ProgressiveImage';

interface HomeFeedViewProps {
  listings: CarListing[];
  dealers: Dealer[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectVehicle: (car: CarListing) => void;
  onSelectDealer: (dealer: Dealer) => void;
  onNavigateToAutoChoice: (category?: string, filters?: any) => void;
  formatPrice: (price: number) => string;
}

export const HomeFeedView: React.FC<HomeFeedViewProps> = ({
  listings,
  dealers,
  favorites,
  onToggleFavorite,
  onSelectVehicle,
  onSelectDealer,
  onNavigateToAutoChoice,
  formatPrice,
}) => {
  const [quickMake, setQuickMake] = useState('All');
  const [quickModel, setQuickModel] = useState('All');
  const [quickMaxPrice, setQuickMaxPrice] = useState('All');
  const [quickCity, setQuickCity] = useState('All');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<string>('All');
  
  // Pagination State for Recommended Feed
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const sectorCategories = [
    { id: 'Cars', label: 'Cars', icon: Car, count: listings.filter(l => !l.vehicleType || l.vehicleType === 'car').length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'Bikes', label: 'Bikes', icon: Bike, count: listings.filter(l => l.vehicleType === 'motorcycle' || l.vehicleType === 'bike').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'Trucks', label: 'Trucks & Vans', icon: Truck, count: listings.filter(l => l.vehicleType === 'commercial').length, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'EV', label: 'EVs & Hybrids', icon: Zap, count: listings.filter(l => l.fuelType === 'Electric' || l.fuelType === 'Hybrid').length, color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { id: 'Parts', label: 'Auto Parts', icon: Wrench, count: 24, color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 'Showrooms', label: 'Showrooms', icon: Store, count: dealers.length, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToAutoChoice('All', {
      make: quickMake,
      model: quickModel,
      maxPrice: quickMaxPrice !== 'All' ? parseInt(quickMaxPrice) : undefined,
      city: quickCity,
    });
  };

  const activeVehicles = useMemo(() => {
    return listings.filter(l => {
      if (l.isSold || l.isArchived) return false;
      if (feedCategoryFilter === 'Featured') return l.featured;
      if (feedCategoryFilter === 'Verified') return l.verified;
      if (feedCategoryFilter === 'SUV') return (l as any).bodyType?.toLowerCase().includes('suv') || l.title.toLowerCase().includes('fortuner') || l.title.toLowerCase().includes('prado');
      if (feedCategoryFilter === 'Sedan') return (l as any).bodyType?.toLowerCase().includes('sedan') || l.title.toLowerCase().includes('civic') || l.title.toLowerCase().includes('corolla') || l.title.toLowerCase().includes('yaris');
      return true;
    });
  }, [listings, feedCategoryFilter]);

  // Paginated Slicing
  const totalPages = Math.ceil(activeVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return activeVehicles.slice(start, start + itemsPerPage);
  }, [activeVehicles, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Smooth scroll back to feed section
    const el = document.getElementById('recommended-feed-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. SECTOR CATEGORY LAUNCHER */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Automotive Categories
          </h2>
          <button 
            type="button"
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer" 
            onClick={() => onNavigateToAutoChoice()}
          >
            <span>View All Categories</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
          {sectorCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'Showrooms') {
                    onNavigateToAutoChoice('Showrooms');
                  } else {
                    onNavigateToAutoChoice(cat.id);
                  }
                }}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-slate-200/80 hover:border-blue-500 bg-slate-50/70 hover:bg-white transition-all group cursor-pointer text-center hover:shadow-md"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${cat.color} border shadow-xs`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate w-full">
                  {cat.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {cat.count > 0 ? `${cat.count} Available` : 'Explore'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. FLAGSHIP HERO WITH QUICK-FINDER */}
      <section className="relative overflow-hidden bg-[#0A101D] text-[#DAE2FD] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-800">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <AutoChoiceLogo size="md" frame="glow" background="dark" />
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={11} />
              <span>Verified Pakistan Network</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Find certified cars with zero commission.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
            Direct owner-to-buyer transactions and authorized dealership showrooms across Karachi, Lahore, Islamabad, and Peshawar.
          </p>

          {/* Quick Search Widget */}
          <form onSubmit={handleQuickSearch} className="mt-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-xl">
            {/* Make */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Make</label>
              <select
                value={quickMake}
                onChange={(e) => {
                  setQuickMake(e.target.value);
                  setQuickModel('All');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
              >
                <option value="All">All Makes</option>
                {PAKISTAN_BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Model</label>
              <select
                value={quickModel}
                onChange={(e) => setQuickModel(e.target.value)}
                disabled={quickMake === 'All' || !CAR_MODELS[quickMake]}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-40 cursor-pointer"
              >
                <option value="All">All Models</option>
                {quickMake !== 'All' && CAR_MODELS[quickMake]?.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Budget (PKR)</label>
              <select
                value={quickMaxPrice}
                onChange={(e) => setQuickMaxPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
              >
                <option value="All">Any Budget</option>
                <option value="2000000">Under 20 Lakh</option>
                <option value="5000000">Under 50 Lakh</option>
                <option value="10000000">Under 1 Crore</option>
                <option value="30000000">Under 3 Crore</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">City</label>
              <select
                value={quickCity}
                onChange={(e) => setQuickCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
              >
                <option value="All">All Cities</option>
                {PAKISTAN_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="col-span-2 sm:col-span-4 mt-1">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30 active:scale-98"
              >
                <Search size={16} />
                <span>Search Auto Choice Live Catalog</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. VERTICAL INTERACTIVE VEHICLE ACCORDION */}
      <VerticalVehicleAccordion
        listings={listings}
        onSelectVehicle={onSelectVehicle}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        formatPrice={formatPrice}
      />

      {/* 4. VERIFIED SHOWROOMS STRIP */}
      {dealers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Store size={20} className="text-blue-600" />
                <span>Certified Showrooms & Dealerships</span>
              </h2>
              <p className="text-xs text-slate-500">Authorized showroom inventory with direct physical inspection bays</p>
            </div>
            <button 
              onClick={() => onNavigateToAutoChoice('Showrooms')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Showrooms</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dealers.slice(0, 3).map((dealer) => (
              <div
                key={dealer.id}
                onClick={() => onSelectDealer(dealer)}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex items-center gap-3.5 group"
              >
                <img
                  src={dealer.logo || dealer.logoUrl || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg'}
                  alt={dealer.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 truncate">
                      {dealer.name}
                    </h3>
                    <ShieldCheck size={15} className="text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="shrink-0 text-slate-400" />
                    <span className="truncate">{dealer.location}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <span className="font-bold text-slate-900">{dealer.vehiclesCount || 6} Cars</span>
                    <span>·</span>
                    <span className="text-amber-600 font-bold">★ {dealer.rating || 4.9}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. 5 PILLARS OF TRUST SERVICE GRID */}
      <FivePillarServiceGrid
        onNavigateToCategory={(cat) => onNavigateToAutoChoice(cat)}
      />

      {/* 6. RECOMMENDED VEHICLES FEED WITH TABS & PAGINATION */}
      <section id="recommended-feed-anchor" className="space-y-5 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Car size={20} className="text-blue-600" />
              <span>Recommended Live Inventory</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verified private owner and dealership listings updated in real-time
            </p>
          </div>

          {/* Filter Tabs (Zero-Pill interactive segmented controls) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto overflow-x-auto max-w-full">
            {['All', 'Featured', 'Verified', 'SUV', 'Sedan'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setFeedCategoryFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  feedCategoryFilter === tab
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {paginatedVehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Car size={44} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No vehicles available in this tab</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try switching tabs or exploring our complete multi-city catalog.
            </p>
            <button
              onClick={() => {
                setFeedCategoryFilter('All');
                setCurrentPage(1);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Reset Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedVehicles.map((car) => {
              const isFav = favorites.includes(car.id);
              const img = car.imageUrl || (car.images && car.images[0]) || '/src/assets/images/hero_luxury_suv_showroom_1790660934265.jpg';
              const targetPhone = car.sellerWhatsApp || car.phone || '923001234567';
              const waText = encodeURIComponent(
                `Hi, I am interested in your vehicle on Bazar360:\n🚗 ${car.title}\n📅 Year: ${car.year}\n💰 Price: ${formatPrice(car.price)}\n📍 Location: ${car.location || car.registrationCity || 'Pakistan'}\nListing Ref: ${car.id}`
              );

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col group"
                >
                  {/* Photo Frame with Progressive Loading */}
                  <div 
                    className="relative overflow-hidden cursor-pointer"
                    onClick={() => onSelectVehicle(car)}
                  >
                    <ProgressiveImage
                      src={img}
                      alt={car.title}
                      aspectRatio="aspect-[16/10]"
                      className="group-hover:scale-105"
                    />

                    {/* Save Heart */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(car.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:text-rose-500 shadow-sm transition-colors cursor-pointer"
                      title="Save vehicle"
                    >
                      <Heart size={16} className={isFav ? 'text-rose-500 fill-rose-500' : ''} />
                    </button>

                    {/* Verified Badge */}
                    {car.verified && (
                      <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <ShieldCheck size={12} />
                        <span>Verified</span>
                      </div>
                    )}

                    {/* Condition Pill */}
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {car.condition || 'Inspected'} · {car.assemblyType || 'Local'}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => onSelectVehicle(car)}
                        className="font-bold text-slate-900 text-sm leading-snug hover:text-blue-600 cursor-pointer line-clamp-1 transition-colors"
                      >
                        {car.title}
                      </h3>

                      <div className="text-base font-black text-blue-600 mt-1 font-mono">
                        {formatPrice(car.price)}
                      </div>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-1.5 mt-3 text-xs text-slate-600">
                        <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">{car.year}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex items-center gap-1">
                          <Gauge size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">{car.mileage?.toLocaleString()} km</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex items-center gap-1">
                          <Fuel size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">{car.fuelType || 'Petrol'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin size={12} className="shrink-0 text-slate-400" />
                          {car.location || car.registrationCity || 'Pakistan'}
                        </span>
                        <span className="text-slate-400 font-medium">
                          {car.sellerType || 'Seller'}
                        </span>
                      </div>
                    </div>

                    {/* Direct Contact Actions (WhatsApp, Call, Details) */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectVehicle(car)}
                        className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Vehicle
                      </button>

                      {/* Direct WhatsApp Responder */}
                      <a
                        href={`https://wa.me/${targetPhone.replace(/\D/g, '')}?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare size={14} />
                      </a>

                      {/* Direct Call */}
                      {car.phone && (
                        <a
                          href={`tel:${car.phone}`}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center transition-colors"
                          title="Call Seller"
                        >
                          <Phone size={14} />
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mt-6">
            <div className="text-xs text-slate-500 font-medium">
              Showing page <span className="font-bold text-slate-900">{currentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span> ({activeVehicles.length} vehicles)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>

              {/* Page Number Buttons */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === p
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 7. FOUR STAGE BUYING PROCESS PIPELINE */}
      <FourStageBuyingProcess
        onNavigateToCatalog={() => onNavigateToAutoChoice('All')}
        onNavigateToSell={() => onNavigateToAutoChoice('All')}
      />

    </div>
  );
};
