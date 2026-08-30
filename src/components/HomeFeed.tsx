import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { CarListing, Dealer } from '../types';
import { VehicleCard } from './VehicleCard';
import MarketplaceHero from './MarketplaceHero';
import { TopBrandsRail } from './homepage/TopBrandsRail';
import { ShowroomsSection } from './homepage/ShowroomsSection';
import { ServicesSection } from './homepage/ServicesSection';
import { TrustSafetySection } from './homepage/TrustSafetySection';
import { SellYourCarBanner } from './homepage/SellYourCarBanner';
import { pageTransitions } from './AnimationProvider';
import { Sparkles, Car, ShieldCheck, ArrowRight, Award, Flame, CheckCircle2, PhoneCall, DollarSign } from 'lucide-react';

interface HomeFeedProps {
  listings: CarListing[];
  dealers: Dealer[];
  onSelectListing: (car: CarListing) => void;
  onSelectDealer?: (dealerId: string) => void;
  onToggleCompare: (car: CarListing) => void;
  compareList: CarListing[];
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
  onToggleCompare,
  compareList,
  onToggleFavorite,
  favoritesList,
  recentViewsList = [],
  lang,
  setTab,
  setSelectedCategory,
  setSearchQuery
}: HomeFeedProps) {
  const isUrdu = lang === 'ur';
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'recent' | 'certified' | 'budget' | 'suv'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState(8);

  // Featured listings from real data (only if actual featured exist)
  const featuredListings = useMemo(() => {
    const featured = (listings || []).filter(car => car.featured || car.verified || car.approved);
    return featured.length > 0 ? featured.slice(0, 4) : [];
  }, [listings]);

  // Filter listings for latest section
  const filteredListings = useMemo(() => {
    return (listings || []).filter(car => {
      if (selectedBrand && car.make?.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      if (selectedCity && !((car.location || car.registrationCity || '').toLowerCase().includes(selectedCity.toLowerCase()))) {
        return false;
      }
      if (activeTabFilter === 'certified') {
        return car.verified || car.approved;
      }
      if (activeTabFilter === 'budget') {
        return car.price <= 3000000;
      }
      if (activeTabFilter === 'suv') {
        const titleLower = car.title?.toLowerCase() || '';
        const modelLower = car.model?.toLowerCase() || '';
        return (
          car.tags?.includes('SUV') ||
          titleLower.includes('prado') ||
          titleLower.includes('fortuner') ||
          titleLower.includes('revo') ||
          titleLower.includes('land cruiser') ||
          titleLower.includes('sportage') ||
          titleLower.includes('tucson') ||
          modelLower.includes('suv')
        );
      }
      return true;
    });
  }, [listings, activeTabFilter, selectedBrand, selectedCity]);

  const sortedListings = useMemo(() => {
    if (activeTabFilter === 'recent') {
      return [...filteredListings].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return filteredListings;
  }, [filteredListings, activeTabFilter]);

  const displayedListings = useMemo(() => {
    return sortedListings.slice(0, visibleCount);
  }, [sortedListings, visibleCount]);

  const handleBrandSelect = (brandName: string) => {
    setSelectedBrand(prev => (prev === brandName ? '' : brandName));
  };

  return (
    <motion.div
      variants={pageTransitions}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] overflow-x-hidden font-sans pb-24"
    >
      {/* 1. Hero & Fast Search Engine */}
      <MarketplaceHero 
        lang={lang} 
        onSearch={(query) => {
          if (setSearchQuery) setSearchQuery(query);
        }} 
        setTab={setTab} 
        listings={listings}
        onSelectListing={onSelectListing}
      />

      {/* 2. Top Brands Rail */}
      <TopBrandsRail
        onSelectBrand={handleBrandSelect}
        selectedBrand={selectedBrand}
        lang={lang}
      />

      {/* 3. Featured Vehicles (Rendered ONLY when verified/featured listings exist) */}
      {featuredListings.length > 0 && (
        <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border-main)] bg-[var(--color-bg-secondary)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] border border-[var(--color-accent-main)]/30 text-[var(--color-accent-main)] text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={14} />
                  <span>Handpicked Stock</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-header)] tracking-tight">
                  {isUrdu ? 'خاص گاڑیاں (ممتاز انتخاب)' : 'Featured & Verified Vehicles'}
                </h2>
              </div>

              <button
                onClick={() => setTab('inventory')}
                className="btn-luxury-secondary text-xs"
              >
                <span>Explore All Inventory</span>
                <ArrowRight size={14} className="text-[var(--color-accent-main)]" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((car, idx) => (
                <VehicleCard
                  key={car.id}
                  car={car}
                  dealer={dealers.find(d => d.id === car.dealerId)}
                  onSelect={onSelectListing}
                  onToggleCompare={onToggleCompare}
                  isComparing={compareList.some(c => c.id === car.id)}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoritesList.some(f => f.id === car.id)}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Recently Added Marketplace Inventory */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border-main)] bg-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-accent-main)]">
                {isUrdu ? 'حقیقی مارکیٹ پلیس لسٹنگز' : 'Real Marketplace Data'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-header)] mt-1 tracking-tight">
                {isUrdu ? 'حالیہ گاڑیوں کی فہرست' : 'Recently Added Vehicles'}
              </h2>
            </div>

            {/* Tab Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-main)] shadow-xs">
              {[
                { id: 'all', label: 'All Cars' },
                { id: 'recent', label: 'Newest' },
                { id: 'certified', label: 'Verified Only' },
                { id: 'budget', label: 'Under 30 Lakh' },
                { id: 'suv', label: 'SUVs & 4x4' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    activeTabFilter === tab.id
                      ? 'bg-[var(--color-accent-main)] text-[#090D14] shadow-xs font-bold'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-header)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Active Brand / City Badges */}
          {(selectedBrand || selectedCity) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)]">Active Filters:</span>
              {selectedBrand && (
                <span className="px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] border border-[var(--color-accent-main)]/30 text-[var(--color-accent-main)] text-xs font-mono font-bold flex items-center gap-2">
                  Make: {selectedBrand}
                  <button onClick={() => setSelectedBrand('')} className="hover:text-[var(--color-text-header)] cursor-pointer">×</button>
                </span>
              )}
              {selectedCity && (
                <span className="px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] border border-[var(--color-accent-main)]/30 text-[var(--color-accent-main)] text-xs font-mono font-bold flex items-center gap-2">
                  City: {selectedCity}
                  <button onClick={() => setSelectedCity('')} className="hover:text-[var(--color-text-header)] cursor-pointer">×</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedBrand('');
                  setSelectedCity('');
                }}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent-main)] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Listings Grid */}
          {displayedListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedListings.map((car, idx) => (
                <VehicleCard
                  key={car.id}
                  car={car}
                  dealer={dealers.find(d => d.id === car.dealerId)}
                  onSelect={onSelectListing}
                  onToggleCompare={onToggleCompare}
                  isComparing={compareList.some(c => c.id === car.id)}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoritesList.some(f => f.id === car.id)}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[var(--color-bg-secondary)] border border-[var(--color-border-main)] rounded-3xl p-8 shadow-xs">
              <Car size={48} className="mx-auto text-[var(--color-text-muted)] mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-[var(--color-text-header)]">No Vehicles Found</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-md mx-auto">
                No active listings match your current filters. Try resetting your selected filters or search for another vehicle.
              </p>
              <button
                onClick={() => {
                  setActiveTabFilter('all');
                  setSelectedBrand('');
                  setSelectedCity('');
                }}
                className="mt-4 btn-gold-primary text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < sortedListings.length && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount(prev => Math.min(prev + 8, sortedListings.length))}
                className="btn-luxury-secondary px-8 py-3 text-xs"
              >
                Load More Vehicles ({sortedListings.length - visibleCount} Remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Explore Showrooms (Real Showroom Directory) */}
      <ShowroomsSection 
        dealers={dealers} 
        onSelectDealer={onSelectDealer || (() => setTab('dealers'))} 
        setTab={setTab} 
        lang={lang} 
      />

      {/* 6. Auto Services (4 Core Automotive Services) */}
      <ServicesSection setTab={setTab} lang={lang} />

      {/* 7. Why Bazar360 (4 Concise Trust Pillars) */}
      <TrustSafetySection lang={lang} />

      {/* 8. Ready to Sell Your Car? Conversion Section */}
      <SellYourCarBanner setTab={setTab} lang={lang} />

    </motion.div>
  );
}
