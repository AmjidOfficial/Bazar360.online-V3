import React, { useMemo, useState } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Store, 
  Star, 
  Car, 
  Zap, 
  SlidersHorizontal,
  Building2,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { CarListing, Dealer } from '../types';
import HomeVehicleCard from './HomeVehicleCard';
import { Interactive3DShowroomHero } from './Interactive3DShowroomHero';
import { cinematicAudio } from '../lib/cinematicAudio';

interface HomeFeedProps {
  listings: CarListing[];
  dealers: Dealer[];
  onSelectListing: (car: CarListing) => void;
  onSelectDealer?: (dealerId: string) => void;
  onToggleCompare?: (car: CarListing) => void;
  compareList?: CarListing[];
  onToggleFavorite: (car: CarListing) => void;
  favoritesList: CarListing[];
  recentViewsList?: CarListing[];
  lang: 'en' | 'ur';
  setTab: (tab: string) => void;
  setSelectedCategory?: (category: string) => void;
  setSearchQuery?: (query: string) => void;
}

export function HomeFeed({
  listings,
  dealers,
  onSelectListing,
  onSelectDealer,
  onToggleFavorite,
  favoritesList,
  setTab,
  setSearchQuery,
}: HomeFeedProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCity, setActiveCity] = useState('All');

  const realListings = useMemo(() => (Array.isArray(listings) ? listings : []).filter((car) => car?.id), [listings]);
  const availableListings = useMemo(
    () => realListings.filter((car) => car.status !== 'Sold' && !car.isSold && !car.isArchived),
    [realListings]
  );
  const realShowrooms = useMemo(
    () => (Array.isArray(dealers) ? dealers : []).filter((dealer) => dealer?.id && dealer?.name),
    [dealers]
  );

  const verifiedListings = useMemo(
    () => availableListings.filter((car) => car.verified || car.approved || car.featured),
    [availableListings]
  );

  const filteredListings = useMemo(() => {
    let result = availableListings;
    if (activeCategory !== 'All') {
      result = result.filter((car) => {
        const text = `${car.vehicleType || ''} ${car.title || ''} ${car.model || ''} ${car.make || ''} ${car.tags?.join(' ') || ''}`.toLowerCase();
        if (activeCategory === 'Sedans') return text.includes('sedan') || text.includes('civic') || text.includes('corolla') || text.includes('yaris') || text.includes('city') || text.includes('e-tron');
        if (activeCategory === 'EVs') return car.fuelType === 'Electric' || car.fuelType === 'Hybrid' || /electric|ev|hybrid|taycan|e-tron/.test(text);
        if (activeCategory === 'SUVs') return /suv|sportage|tucson|fortuner|prado|land cruiser|vezel|cross/.test(text);
        if (activeCategory === 'Luxury') return /mercedes|audi|bmw|porsche|lexus|land rover|range rover/.test(text);
        if (activeCategory === 'Exotic') return /porsche|ferrari|lamborghini|bentley|amg|turbo/.test(text);
        return true;
      });
    }
    return result;
  }, [activeCategory, availableListings]);

  const filteredShowrooms = useMemo(() => {
    if (activeCity === 'All') return realShowrooms;
    return realShowrooms.filter((d) => (d.location || '').toLowerCase().includes(activeCity.toLowerCase()));
  }, [activeCity, realShowrooms]);

  const doSearch = () => {
    cinematicAudio.playClick();
    if (setSearchQuery) {
      setSearchQuery(query.trim());
    }
    setTab('inventory');
  };

  const categories = [
    { id: 'All', label: 'All Vehicles', icon: Car },
    { id: 'Sedans', label: 'Sedans', icon: Car },
    { id: 'EVs', label: 'EVs & Hybrids', icon: Zap },
    { id: 'SUVs', label: 'SUVs & 4x4', icon: Car },
    { id: 'Luxury', label: 'Luxury', icon: Award },
    { id: 'Exotic', label: 'Exotic', icon: Star },
  ];

  const cityTabs = [
    { id: 'All', label: 'All Showrooms', count: realShowrooms.length },
    { id: 'Lahore', label: 'Lahore', count: realShowrooms.filter(d => (d.location || '').toLowerCase().includes('lahore')).length || 14 },
    { id: 'Karachi', label: 'Karachi', count: realShowrooms.filter(d => (d.location || '').toLowerCase().includes('karachi')).length || 19 },
    { id: 'Islamabad', label: 'Islamabad', count: realShowrooms.filter(d => (d.location || '').toLowerCase().includes('islamabad')).length || 8 },
    { id: 'Peshawar', label: 'Peshawar', count: realShowrooms.filter(d => (d.location || '').toLowerCase().includes('peshawar')).length || 12 },
  ];

  return (
    <main className="min-h-screen bg-[#0b1326] text-[#dae2fd] pb-24 font-sans selection:bg-[#00d2ff] selection:text-[#003543]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        
        {/* 1. Interactive 3D Supercar Showroom Hero Section */}
        <Interactive3DShowroomHero
          onExploreClick={() => {
            cinematicAudio.playClick();
            setTab('inventory');
          }}
          onSellClick={() => {
            cinematicAudio.playClick();
            setTab('sell');
          }}
          availableCount={availableListings.length || 48}
          verifiedCount={verifiedListings.length || 24}
        />

        {/* 2. Fast Search Bar Shortcut (Stitch Design Pattern) */}
        <div className="relative flex items-center bg-[#171f33] rounded-2xl p-2 sm:p-2.5 shadow-xl border border-[#00d2ff]/20 mb-6">
          <Search size={20} className="text-[#00d2ff] ml-3 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            placeholder="Search make, model, variant or showroom..."
            className="w-full bg-transparent border-none outline-none px-3 text-[#dae2fd] text-sm sm:text-base placeholder:text-[#859399]"
          />
          <button
            type="button"
            onClick={doSearch}
            className="bg-gradient-to-r from-[#00d2ff] to-[#47d6ff] text-[#003543] font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
          </button>
        </div>

        {/* 3. Quick Category Horizontal Filters */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#dae2fd] tracking-tight">
              Categories
            </h2>
            <button
              type="button"
              onClick={() => setTab('inventory')}
              className="text-xs font-bold text-[#00d2ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    cinematicAudio.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[92px] sm:min-w-[104px] h-24 sm:h-26 rounded-2xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#222a3d] border-[#00d2ff] shadow-lg shadow-[#00d2ff]/20 scale-105'
                      : 'bg-[#171f33] border-[#00d2ff]/10 hover:border-[#00d2ff]/40 hover:bg-[#1e293b]'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#00d2ff] text-[#003543]'
                        : 'bg-[#222a3d] text-[#00d2ff] group-hover:bg-[#00d2ff] group-hover:text-[#003543]'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold text-[#dae2fd] mt-2 tracking-tight">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Featured Verified Vehicles Showcase */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-extrabold text-[#dae2fd] tracking-tight">
                  Featured Verified Vehicles
                </h2>
                <ShieldCheck size={20} className="text-[#00d2ff]" />
              </div>
              <p className="text-xs sm:text-sm text-[#859399]">
                Inspected & 360° Certified across Islamabad, Lahore, Karachi & Peshawar
              </p>
            </div>

            <button
              type="button"
              onClick={() => setTab('inventory')}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#00d2ff] hover:underline cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredListings.slice(0, 8).map((car) => (
                <HomeVehicleCard
                  key={car.id}
                  car={car}
                  dealer={realShowrooms.find((d) => d.id === car.dealerId)}
                  onSelect={onSelectListing}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoritesList.some((item) => item.id === car.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#171f33] border border-[#00d2ff]/20 text-center">
              <Car size={36} className="mx-auto text-[#00d2ff]/60 mb-2" />
              <h3 className="font-bold text-[#dae2fd]">No vehicles found in this category</h3>
              <p className="text-xs text-[#859399] mt-1">Try switching categories or view all live inventory.</p>
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className="mt-4 px-4 py-2 rounded-xl bg-[#00d2ff] text-[#003543] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* 5. Elite Showroom Partners & Verified Hubs */}
        <section className="mb-10 p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-[#171f33] to-[#131b2e] border border-[#00d2ff]/25 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Store size={20} className="text-[#ffb95f]" />
                <h2 className="text-lg sm:text-2xl font-extrabold text-[#dae2fd] tracking-tight">
                  Elite Showroom Partners
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#859399]">
                Verified luxury dealerships & certified delivery bays
              </p>
            </div>

            <button
              type="button"
              onClick={() => setTab('dealers')}
              className="text-xs font-bold text-[#ffb95f] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Showrooms</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
            {cityTabs.map((c) => {
              const isSelected = activeCity === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    cinematicAudio.playClick();
                    setActiveCity(c.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#00d2ff] text-[#003543] shadow-md shadow-[#00d2ff]/20 font-bold'
                      : 'bg-[#222a3d] text-[#bbc9cf] hover:text-[#dae2fd] hover:bg-[#2d3449] border border-[#3c494e]'
                  }`}
                >
                  <MapPin size={12} />
                  <span>{c.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-[#003543]/20 text-[#003543]' : 'bg-[#171f33] text-[#00d2ff]'
                  }`}>
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Showroom Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {filteredShowrooms.slice(0, 3).map((dealer) => (
              <div
                key={dealer.id}
                onClick={() => {
                  cinematicAudio.playClick();
                  onSelectDealer?.(dealer.id);
                }}
                className="group flex flex-col bg-[#0b1326] rounded-2xl overflow-hidden border border-[#00d2ff]/20 hover:border-[#00d2ff]/50 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative h-44 w-full overflow-hidden bg-[#171f33]">
                  {dealer.coverImage || dealer.logo ? (
                    <img
                      src={dealer.coverImage || dealer.logo}
                      alt={dealer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#859399]">
                      <Building2 size={36} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-[#060e20]/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#ffb95f]/30 text-[#ffb95f] text-xs font-bold shadow-md">
                    <Star size={12} fill="#ffb95f" />
                    <span>{dealer.rating || '4.9'}</span>
                    <span className="text-[10px] text-[#859399]">(128)</span>
                  </div>

                  {/* Certified Hub Badge */}
                  <div className="absolute top-3 left-3 bg-[#060e20]/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#00d2ff]/30 text-[#00d2ff] text-[10px] font-bold shadow-md uppercase tracking-wider">
                    <ShieldCheck size={12} />
                    <span>Certified Hub</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-bold text-[#dae2fd] group-hover:text-[#00d2ff] transition-colors">
                        {dealer.name}
                      </h3>
                      <span className="text-xs font-bold text-[#ffb95f]">
                        {dealer.vehiclesCount || '28'} Cars
                      </span>
                    </div>

                    <p className="text-xs text-[#859399] flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-[#00d2ff] shrink-0" />
                      <span className="truncate">{dealer.location || 'Pakistan'}</span>
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#47d6ff] text-[#003543] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#00d2ff]/20 cursor-pointer"
                  >
                    <span>Visit Showroom</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Partner Callout */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#222a3d] to-[#171f33] border border-[#ffb95f]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-sm font-bold text-[#dae2fd] flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#ffb95f]" />
                Own an Auto Showroom or Dealership in Pakistan?
              </span>
              <p className="text-xs text-[#bbc9cf] mt-0.5">
                Join Bazar360 Elite Showroom Network & reach verified high-intent buyers nationwide.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                cinematicAudio.playClick();
                setTab('dealers');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#ffb95f] hover:bg-[#ee9800] text-[#2a1700] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0 active:scale-95"
            >
              Partner Up
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
