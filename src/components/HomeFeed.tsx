import React, { useMemo, useState } from 'react';
import { CarListing, Dealer } from '../types';
import { VehicleCard } from './VehicleCard';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
  Store,
  Tag,
  Wrench,
  Phone,
  PlayCircle,
} from 'lucide-react';

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

const formatPrice = (price: number) => {
  if (!Number.isFinite(price)) return 'Price on request';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatMileage = (mileage: number) => {
  if (!Number.isFinite(mileage)) return 'Mileage not listed';
  return `${new Intl.NumberFormat('en-PK').format(mileage)} km`;
};

export function HomeFeed({
  listings,
  dealers,
  onSelectListing,
  onSelectDealer,
  onToggleCompare,
  compareList,
  onToggleFavorite,
  favoritesList,
  lang,
  setTab,
  setSearchQuery,
}: HomeFeedProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const realListings = useMemo(
    () => (Array.isArray(listings) ? listings : []).filter((car) => car && car.id),
    [listings],
  );

  const availableListings = useMemo(
    () => realListings.filter((car) => car.status !== 'Sold' && !car.isSold && !car.isArchived),
    [realListings],
  );

  const featuredListings = useMemo(
    () => availableListings.filter((car) => car.featured || car.verified || car.approved).slice(0, 4),
    [availableListings],
  );

  const latestListings = useMemo(
    () =>
      [...availableListings]
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 4),
    [availableListings],
  );

  const heroImage = featuredListings[0]?.primaryImage || featuredListings[0]?.imageUrl || latestListings[0]?.imageUrl;
  const showroomImage = dealers.find((dealer) => dealer.coverImage)?.coverImage;

  const realShowrooms = useMemo(
    () => (Array.isArray(dealers) ? dealers : []).filter((dealer) => dealer && dealer.id && dealer.name),
    [dealers],
  );

  const galleryImages = useMemo(() => {
    const images: Array<{ url: string; showroom: Dealer }> = [];
    for (const showroom of realShowrooms) {
      const media = [...(showroom.gallery || []), ...(showroom.media || []), ...(showroom.activityFeed || []).map((post) => post.imageUrl)].filter(Boolean);
      for (const url of media) {
        if (!images.some((item) => item.url === url)) images.push({ url, showroom });
        if (images.length >= 5) break;
      }
      if (images.length >= 5) break;
    }
    return images;
  }, [realShowrooms]);

  const doSearch = () => {
    const value = query.trim();
    if (setSearchQuery) setSearchQuery(value);
    setTab('search');
  };

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Sedans', value: 'sedan' },
    { label: 'SUVs', value: 'suv' },
    { label: '4x4', value: '4x4' },
    { label: 'Electric', value: 'electric' },
  ];

  const filteredLatest = useMemo(() => {
    if (activeCategory === 'All') return latestListings;
    return latestListings.filter((car) => {
      const type = `${car.vehicleType || ''} ${car.title || ''} ${car.model || ''} ${car.tags?.join(' ') || ''}`.toLowerCase();
      if (activeCategory === 'Electric') return car.fuelType === 'Electric';
      if (activeCategory === 'Sedans') return type.includes('sedan');
      if (activeCategory === 'SUVs') return type.includes('suv') || type.includes('sportage') || type.includes('tucson') || type.includes('fortuner') || type.includes('prado');
      return type.includes('4x4') || type.includes('pickup') || type.includes('revo') || type.includes('land cruiser');
    });
  }, [activeCategory, latestListings]);

  return (
    <main className="b360-home min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] pb-20">
      {/* Hero: visual first, real marketplace data second */}
      <section className="relative isolate overflow-hidden bg-[#0b1626] text-white">
        {heroImage && (
          <img
            src={heroImage}
            alt="Vehicle listed on Bazar360"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,18,31,.96)_0%,rgba(7,18,31,.78)_42%,rgba(7,18,31,.22)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#07121f] via-transparent to-transparent" />

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck size={14} className="text-orange-400" />
              Real listings. Real sellers. Real showrooms.
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-300">BAZAR360.ONLINE</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Find your next car with confidence.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Buy, sell and connect through Pakistan's smart automotive marketplace. Browse actual vehicles and verified showroom inventory, then contact the seller directly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setTab('inventory')} className="b360-btn b360-btn-primary">
                Browse Inventory <ArrowRight size={16} />
              </button>
              <button onClick={() => setTab('sell')} className="b360-btn b360-btn-light">
                Sell Your Vehicle <Tag size={16} />
              </button>
            </div>

            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 border-t border-white/15 pt-5">
              <div>
                <div className="text-xl font-semibold">{availableListings.length}</div>
                <div className="text-xs text-white/55">Live vehicles</div>
              </div>
              <div>
                <div className="text-xl font-semibold">{realShowrooms.length}</div>
                <div className="text-xs text-white/55">Showrooms</div>
              </div>
              <div>
                <div className="text-xl font-semibold">{realListings.filter((car) => car.verified || car.approved).length}</div>
                <div className="text-xs text-white/55">Verified vehicles</div>
              </div>
            </div>
          </div>

          <div className="lg:justify-self-end lg:w-full lg:max-w-xl">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-800 shadow-sm">
                <Search size={20} className="text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && doSearch()}
                  placeholder="Search make, model, city..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  aria-label="Search vehicles"
                />
                <button onClick={doSearch} className="rounded-lg bg-[#0f2035] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#172f4e]">
                  Search
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ['Make', 'Toyota'],
                  ['City', 'Peshawar'],
                  ['Fuel', 'Any'],
                  ['Price', 'Any'],
                ].map(([label, value]) => (
                  <button key={label} onClick={() => setTab('search')} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10">
                    <div className="text-[10px] uppercase tracking-wider text-white/45">{label}</div>
                    <div className="mt-0.5 text-xs font-semibold text-white/90">{value}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real inventory */}
      <section className="b360-section bg-white">
        <div className="b360-container">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="b360-kicker">Our vehicles</p>
              <h2 className="b360-title">Find your perfect ride</h2>
              <p className="b360-copy">Real marketplace vehicles, shown from the current Bazar360 data.</p>
            </div>
            <button onClick={() => setTab('inventory')} className="b360-link">View all inventory <ArrowRight size={15} /></button>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => setActiveCategory(category.label)}
                className={`b360-chip ${activeCategory === category.label ? 'b360-chip-active' : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {filteredLatest.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredLatest.map((car, index) => (
                <VehicleCard
                  key={car.id}
                  car={car}
                  dealer={realShowrooms.find((dealer) => dealer.id === car.dealerId)}
                  onSelect={onSelectListing}
                  onToggleCompare={onToggleCompare}
                  isComparing={compareList.some((item) => item.id === car.id)}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoritesList.some((item) => item.id === car.id)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <CarEmptyState />
            </div>
          )}
        </div>
      </section>

      {/* Value proposition, inspired by the reference composition but using Bazar360 content */}
      <section className="bg-[#0b1626] text-white">
        <div className="b360-container grid gap-8 py-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
          <div className="relative overflow-hidden rounded-2xl min-h-[330px]">
            {showroomImage ? (
              <img src={showroomImage} alt="Bazar360 showroom" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            ) : heroImage ? (
              <img src={heroImage} alt="Bazar360 vehicle" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07121f] via-[#07121f]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">Why Bazar360</p>
              <h2 className="mt-2 max-w-lg text-3xl font-semibold">More than a listing. A better way to connect.</h2>
            </div>
          </div>

          <div className="space-y-5">
            {[
              ['Real vehicle information', 'Vehicle details come from actual marketplace listings, not stock demo cards.', ShieldCheck],
              ['Direct seller connection', 'Call, WhatsApp or open the seller/showroom details from the live listing.', Phone],
              ['Showroom discovery', 'Explore real showrooms, their inventory and their public business information.', Store],
              ['Useful after-sale support', 'Access automotive services and customer tools already available in the platform.', Wrench],
            ].map(([title, text, Icon]) => (
              <div key={String(title)} className="flex gap-4 border-b border-white/10 pb-5 last:border-b-0">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-500/15 text-orange-300"><Icon size={18} /></span>
                <div>
                  <h3 className="text-base font-semibold text-white">{title as string}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/60">{text as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform services */}
      <section className="b360-section bg-[#f7f8fa]">
        <div className="b360-container">
          <div className="mb-8">
            <p className="b360-kicker">Our services</p>
            <h2 className="b360-title">Everything you need in one place</h2>
            <p className="b360-copy">Simple paths for buyers, sellers and automotive businesses.</p>
          </div>
          <div className="grid divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {[
              ['Buy a vehicle', 'Search, compare and contact sellers.', Search, () => setTab('inventory')],
              ['Sell your vehicle', 'Create a real listing with your own media.', Tag, () => setTab('sell')],
              ['Find showrooms', 'Discover real showroom businesses and inventory.', Store, () => setTab('dealers')],
              ['Auto services', 'Explore the available automotive service tools.', Wrench, () => setTab('concierge')],
            ].map(([title, text, Icon, action]) => (
              <button key={String(title)} onClick={action as () => void} className="group p-6 text-left transition hover:bg-slate-50">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-orange-600"><Icon size={20} /></span>
                <h3 className="mt-5 font-semibold text-slate-900">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text as string}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-orange-600">Explore <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured/verified real inventory */}
      {featuredListings.length > 0 && (
        <section className="b360-section bg-white">
          <div className="b360-container">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="b360-kicker">Verified selection</p>
                <h2 className="b360-title">Vehicles worth a closer look</h2>
              </div>
              <button onClick={() => setTab('inventory')} className="b360-link hidden sm:inline-flex">Explore inventory <ArrowRight size={15} /></button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredListings.map((car, index) => (
                <VehicleCard
                  key={car.id}
                  car={car}
                  dealer={realShowrooms.find((dealer) => dealer.id === car.dealerId)}
                  onSelect={onSelectListing}
                  onToggleCompare={onToggleCompare}
                  isComparing={compareList.some((item) => item.id === car.id)}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoritesList.some((item) => item.id === car.id)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="b360-section bg-[#f7f8fa]">
        <div className="b360-container grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="b360-kicker">How it works</p>
            <h2 className="b360-title">A simple process to get you on the road</h2>
            <p className="b360-copy mt-4">From finding a vehicle to contacting the seller, Bazar360 keeps the journey clear.</p>
            <button onClick={() => setTab('search')} className="b360-btn b360-btn-dark mt-7">Start searching <ArrowRight size={16} /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['01', 'Choose your vehicle', 'Use search, filters and real listing details to narrow your choices.'],
              ['02', 'Check the details', 'Review photos, specs, price, location and seller or showroom information.'],
              ['03', 'Connect directly', 'Use the available call or WhatsApp contact path for the listing.'],
              ['04', 'Complete your deal', 'Meet, inspect and complete the transaction directly with the seller.'],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-500 text-sm font-bold text-white">{number}</span>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real showroom gallery */}
      {galleryImages.length > 0 && (
        <section className="bg-[#0b1626] py-14 text-white lg:py-20">
          <div className="b360-container">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">Our showrooms</p>
                <h2 className="mt-2 text-3xl font-semibold">Real places. Real inventory.</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">A visual look at media already published by Bazar360 showrooms.</p>
              </div>
              <button onClick={() => setTab('dealers')} className="b360-btn b360-btn-light hidden sm:inline-flex">View showrooms <ArrowRight size={15} /></button>
            </div>
            <div className="grid auto-rows-[180px] gap-3 sm:grid-cols-3 lg:auto-rows-[210px]">
              {galleryImages.map((item, index) => (
                <button
                  key={`${item.url}-${index}`}
                  onClick={() => onSelectDealer?.(item.showroom.id)}
                  className={`group relative overflow-hidden rounded-2xl text-left ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                >
                  <img src={item.url} alt={item.showroom.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-sm font-semibold">{item.showroom.name}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-white/65"><MapPin size={12} /> {item.showroom.location}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Showroom directory */}
      {realShowrooms.length > 0 && (
        <section className="b360-section bg-white">
          <div className="b360-container">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="b360-kicker">Verified showrooms</p>
                <h2 className="b360-title">Meet the businesses behind the inventory</h2>
              </div>
              <button onClick={() => setTab('dealers')} className="b360-link hidden sm:inline-flex">All showrooms <ArrowRight size={15} /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {realShowrooms.slice(0, 3).map((dealer) => (
                <button key={dealer.id} onClick={() => onSelectDealer?.(dealer.id)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    {(dealer.coverImage || dealer.logoUrl || dealer.logo) && <img src={dealer.coverImage || dealer.logoUrl || dealer.logo} alt={dealer.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />}
                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
                      {dealer.verified || dealer.flagshipVerified ? 'Verified showroom' : 'Showroom'}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{dealer.name}</h3>
                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} /> {dealer.location}</div>
                      </div>
                      <ArrowRight size={16} className="mt-1 text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                      <span>{Number.isFinite(dealer.vehiclesCount) ? dealer.vehiclesCount : 0} vehicles</span>
                      {dealer.rating > 0 && <span>{dealer.rating.toFixed(1)} rating</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-[#0b1626] text-white">
        {showroomImage && <img src={showroomImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />}
        <div className="absolute inset-0 bg-[#07121f]/75" />
        <div className="b360-container relative py-16 text-center lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">Ready to drive?</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">Your next vehicle could be closer than you think.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/60">Search real listings or publish your vehicle and connect with people looking for it.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button onClick={() => setTab('inventory')} className="b360-btn b360-btn-primary">Browse inventory <ArrowRight size={16} /></button>
            <button onClick={() => setTab('sell')} className="b360-btn b360-btn-light">Post your vehicle <Tag size={16} /></button>
          </div>
        </div>
      </section>
    </main>
  );
}

function CarEmptyState() {
  return (
    <div>
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-400"><Search size={19} /></div>
      <h3 className="mt-4 text-base font-semibold text-slate-800">No vehicles match this category</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">No dummy vehicles are shown. Try another category or open the full inventory.</p>
    </div>
  );
}

export default HomeFeed;
